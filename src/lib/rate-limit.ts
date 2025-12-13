import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

/**
 * Rate limiter using Upstash Redis - production-ready solution
 * Works with serverless/edge deployments
 *
 * Required environment variables:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

// Check if Redis is configured
const isRedisConfigured =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis client only if configured
const redis = isRedisConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

/**
 * Rate limit configuration with requests per window
 */
const RATE_LIMIT_CONFIG = {
  write: { requests: 20, window: "60 s" },
  upload: { requests: 10, window: "60 s" },
  auth: { requests: 5, window: "60 s" },
  read: { requests: 100, window: "60 s" },
} as const;

/** Rate limiters for different operation types */
const rateLimiters = redis
  ? {
      /** POST/PUT/DELETE operations - 20 requests per 60 seconds */
      write: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          RATE_LIMIT_CONFIG.write.requests,
          RATE_LIMIT_CONFIG.write.window
        ),
        prefix: "ratelimit:write",
      }),

      /** File upload operations - 10 requests per 60 seconds */
      upload: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          RATE_LIMIT_CONFIG.upload.requests,
          RATE_LIMIT_CONFIG.upload.window
        ),
        prefix: "ratelimit:upload",
      }),

      /** Auth operations (login, register) - 5 requests per 60 seconds */
      auth: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          RATE_LIMIT_CONFIG.auth.requests,
          RATE_LIMIT_CONFIG.auth.window
        ),
        prefix: "ratelimit:auth",
      }),

      /** Read operations - 100 requests per 60 seconds */
      read: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          RATE_LIMIT_CONFIG.read.requests,
          RATE_LIMIT_CONFIG.read.window
        ),
        prefix: "ratelimit:read",
      }),
    }
  : null;

export type RateLimiterType = keyof typeof RATE_LIMIT_CONFIG;

/** Get client IP from request headers */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    headers.get("x-real-ip") ||
    headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

/**
 * Check rate limit and return 429 response if exceeded.
 * Gracefully degrades if Redis is not configured (returns null = allow request).
 *
 * @param request - The incoming request
 * @param type - The type of rate limiter to use
 * @returns NextResponse with 429 status if rate limited, null otherwise
 */
export async function checkRateLimit(
  request: Request,
  type: RateLimiterType = "write"
): Promise<NextResponse | null> {
  // Graceful degradation: if Redis is not configured, allow all requests
  if (!rateLimiters) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Rate Limit] Redis not configured. Rate limiting disabled."
      );
    }
    return null;
  }

  try {
    const ip = getClientIp(request);
    const limiter = rateLimiters[type];
    const { success, limit, remaining, reset } = await limiter.limit(ip);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    return null; // Rate limit passed
  } catch (error) {
    // Log error but don't block request if rate limiting fails
    console.error("[Rate Limit] Error checking rate limit:", error);
    return null; // Fail open: allow request on error
  }
}
