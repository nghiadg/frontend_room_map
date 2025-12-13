# Vercel Cron Jobs Guide

This document describes the cron job implementation for automatic post expiration in the RoomMap application.

## Overview

Posts are automatically marked as `expired` after 14 days. This is handled by a Vercel Cron Job that runs daily.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel Scheduler                        │
│                   (runs at 00:00 UTC daily)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              GET /api/cron/expire-posts                     │
│                                                             │
│  1. Verify CRON_SECRET (production only)                    │
│  2. Query: posts WHERE status='active' AND expires_at < NOW │
│  3. Update: SET status='expired'                            │
│  4. Return: count of expired posts                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                               │
│                    (posts table)                            │
└─────────────────────────────────────────────────────────────┘
```

## Files

| File                                     | Purpose                     |
| ---------------------------------------- | --------------------------- |
| `vercel.json`                            | Cron schedule configuration |
| `src/app/api/cron/expire-posts/route.ts` | Cron endpoint handler       |

## Configuration

### vercel.json

```json
{
  "crons": [
    {
      "path": "/api/cron/expire-posts",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Schedule format**: Standard cron syntax

- `0 0 * * *` = Every day at 00:00 UTC

### Environment Variables

| Variable                    | Required   | Description                                                                   |
| --------------------------- | ---------- | ----------------------------------------------------------------------------- |
| `CRON_SECRET`               | Production | Secret token for Vercel Cron authentication                                   |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes        | Service role key to bypass RLS (get from Supabase Dashboard → Settings → API) |

## Setup Instructions

### 1. Add Environment Variable

In Vercel Dashboard:

1. Go to **Project Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `CRON_SECRET`
   - **Value**: Generate a random string (e.g., `openssl rand -hex 32`)
   - **Environment**: Production

### 2. Deploy

Push your code to trigger a deployment. Vercel will automatically register the cron job.

### 3. Verify

Check the **Vercel Dashboard** → **Logs** → **Cron** to see execution history.

## Security

The endpoint is protected by a Bearer token in production:

```typescript
if (authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

Vercel automatically sends this header when invoking cron jobs.

## Local Development

In development mode (`NODE_ENV !== 'production'`), the security check is skipped for easier testing.

### Manual Testing

```bash
# Local
curl http://localhost:3000/api/cron/expire-posts

# Production (requires CRON_SECRET)
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.vercel.app/api/cron/expire-posts
```

## Vercel Plan Limits

| Plan         | Cron Jobs | Minimum Frequency |
| ------------ | --------- | ----------------- |
| Hobby (Free) | 2         | Daily             |
| Pro          | 40        | Hourly            |

## Monitoring

### Response Format

```json
{
  "success": true,
  "message": "Expired 5 posts",
  "expiredPostIds": [1, 2, 3, 4, 5]
}
```

### Logs

Check Vercel Dashboard → **Deployments** → **Functions** → **Logs** for execution history and errors.

## Troubleshooting

| Issue            | Solution                                      |
| ---------------- | --------------------------------------------- |
| Cron not running | Verify `vercel.json` syntax and redeploy      |
| 401 Unauthorized | Check `CRON_SECRET` is set in Vercel          |
| No posts expired | Verify `expires_at` column exists in database |
| 500 Error        | Check Supabase connection and RLS policies    |

## Related Files

- [post-status.ts](../src/constants/post-status.ts) - Status constants
- [add_expires_at_column.sql](./database/schema/add_expires_at_column.sql) - Database migration
