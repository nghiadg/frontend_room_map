# Rate Limiting

Rate limiting system using **Upstash Redis** to protect APIs from abuse and DDoS attacks.

## Setup

### 1. Create Redis Database

1. Sign up at [console.upstash.com](https://console.upstash.com/) (free tier available)
2. Create a new Redis database
3. Copy the **REST URL** and **REST Token**

### 2. Configure Environment Variables

Add to your `.env.local` file:

```bash
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxxXXX
```

## Rate Limits

| Type     | Limit       | Applied To                             |
| -------- | ----------- | -------------------------------------- |
| `read`   | 100 req/min | GET endpoints                          |
| `write`  | 20 req/min  | POST/PUT/DELETE (no file upload)       |
| `upload` | 10 req/min  | Create/update posts with image uploads |
| `auth`   | 5 req/min   | Login/register operations              |

## Usage

```typescript
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Check rate limit first
  const rateLimitResponse = await checkRateLimit(request, "upload");
  if (rateLimitResponse) return rateLimitResponse;

  // Process request...
}
```

## Rate Limit Response

When rate limit is exceeded:

```json
{
  "error": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 45
}
```

**HTTP Status**: `429 Too Many Requests`

**Headers**:

- `Retry-After`: Seconds until reset
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in window
- `X-RateLimit-Reset`: Timestamp when limit resets

## Graceful Degradation

If Redis is **not configured** or **connection fails**:

- Rate limiting is **disabled**
- Requests are processed normally
- Warning is logged in development mode

This ensures the application remains functional even without Redis.

## Protected API Routes

### User Routes

- `POST /api/v1/posts` - upload
- `PUT /api/v1/posts/[id]` - upload
- `DELETE /api/v1/posts/[id]` - write
- `PATCH /api/v1/posts/[id]/bump` - write
- `PATCH /api/v1/posts/[id]/mark-as-rented` - write
- `PATCH /api/v1/posts/[id]/toggle-visibility` - write
- `GET /api/v1/me/posts` - read
- `GET/PUT /api/v1/profile` - read/write

### Admin Routes

- `GET /api/v1/admin/posts` - read
- `DELETE /api/v1/admin/posts/[id]` - write
- `POST /api/v1/admin/posts/[id]/bump` - write
- `GET /api/v1/admin/dashboard/*` - read (5 endpoints)
- `GET /api/v1/admin/users` - read
- `GET /api/v1/admin/roles` - read

### Public Routes

- `GET /api/v1/posts/map-bounds` - read
- `GET /api/v1/locations/*` - read (3 endpoints)
- `GET /api/v1/amenities` - read
- `GET /api/v1/property-types` - read
- `GET /api/v1/terms` - read
- `GET /api/v1/roles` - read
- `GET /api/v1/mapbox/geocoding-forward` - read
