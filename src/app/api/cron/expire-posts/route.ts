import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { POST_STATUS } from "@/constants/post-status";
import { timingSafeEqual } from "crypto";

/**
 * GET /api/cron/expire-posts
 * Vercel Cron Job to mark expired posts
 * Runs daily at 00:00 UTC (configured in vercel.json)
 *
 * Security:
 * - Protected by CRON_SECRET with timing-safe comparison
 * - Uses admin client (service role) to bypass RLS
 * - Does not expose sensitive data in response
 * - Rate limited by Vercel Cron (once daily)
 */
export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // In production, require CRON_SECRET for security
    if (process.env.NODE_ENV === "production") {
      if (!cronSecret) {
        console.error("CRON_SECRET environment variable not set");
        return NextResponse.json(
          { error: "Server configuration error" },
          { status: 500 }
        );
      }

      // Use timing-safe comparison to prevent timing attacks
      const expectedToken = `Bearer ${cronSecret}`;
      const providedToken = authHeader || "";

      // Ensure both strings are same length for timingSafeEqual
      const isValidLength = providedToken.length === expectedToken.length;
      const isValidToken =
        isValidLength &&
        timingSafeEqual(Buffer.from(providedToken), Buffer.from(expectedToken));

      if (!isValidToken) {
        // Use generic error message to prevent enumeration
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Use admin client to bypass RLS (no user session in cron jobs)
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    // Find all active posts that have expired
    // Update them to 'expired' status
    const { data, error } = await supabase
      .from("posts")
      .update({
        status: POST_STATUS.EXPIRED,
        updated_at: now,
      })
      .eq("status", POST_STATUS.ACTIVE)
      .lt("expires_at", now)
      .select("id");

    if (error) {
      // Log error server-side only, don't expose details to client
      console.error("Error expiring posts:", error);
      return NextResponse.json({ error: "Operation failed" }, { status: 500 });
    }

    const expiredCount = data?.length || 0;
    console.log(`Cron job completed: ${expiredCount} posts expired`);

    // Only return count, not IDs (avoid information leak)
    return NextResponse.json(
      {
        success: true,
        expiredCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
