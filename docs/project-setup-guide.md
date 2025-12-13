# RoomMap Project Setup Guide

Step-by-step guide to set up a complete RoomMap project from scratch.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone & Install Dependencies](#2-clone--install-dependencies)
3. [Supabase Setup](#3-supabase-setup)
4. [Database Schema Setup](#4-database-schema-setup)
5. [Row Level Security (RLS)](#5-row-level-security-rls)
6. [RPC Functions](#6-rpc-functions)
7. [JWT Custom Claims](#7-jwt-custom-claims)
8. [Environment Variables](#8-environment-variables)
9. [External Services Setup](#9-external-services-setup)
10. [Run Development Server](#10-run-development-server)
11. [Verify Installation](#11-verify-installation)

---

## 1. Prerequisites

Ensure your machine has the following installed:

| Tool    | Version | Check Command |
| ------- | ------- | ------------- |
| Node.js | >= 18.x | `node -v`     |
| npm     | >= 9.x  | `npm -v`      |
| Git     | >= 2.x  | `git -v`      |

---

## 2. Clone & Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd fe-rental-map

# Install dependencies
npm install
```

---

## 3. Supabase Setup

### 3.1 Create Project

1. Login to [supabase.com](https://supabase.com)
2. Click **New Project**
3. Fill in details:
   - **Name**: `roommap` (or any name)
   - **Region**: Choose nearest region (Singapore recommended for Vietnam)
   - **Database Password**: Save this password!
4. Wait for project initialization (~2 minutes)

### 3.2 Get API Keys

Go to **Project Settings** → **API**:

| Key            | Description                                            |
| -------------- | ------------------------------------------------------ |
| `Project URL`  | Supabase project URL                                   |
| `anon public`  | Public key for client-side (used as `PUBLISHABLE_KEY`) |
| `service_role` | Secret key for server-side (DO NOT expose to client)   |

### 3.3 Setup Google OAuth

> ⚠️ **Required**: This project uses Google OAuth for authentication

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add to **Authorized redirect URIs**:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`
   - Supabase: `https://<project-ref>.supabase.co/auth/v1/callback`
7. Copy **Client ID** and **Client Secret**
8. In Supabase Dashboard:
   - Go to **Authentication** → **Providers**
   - Enable **Google**
   - Paste Client ID and Client Secret

---

## 4. Database Schema Setup

Execute SQL files in order in **Supabase Dashboard** → **SQL Editor**:

### Step 4.1: Create Base Schema

Copy content from `docs/database/schema/db.sql` and run.

> ⚠️ **Note**: This file is for reference only. If Supabase already has tables, skip this step.

### Step 4.2: Add expires_at Column

```sql
-- File: docs/database/schema/add_expires_at_column.sql

ALTER TABLE posts
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

ALTER TABLE posts
ALTER COLUMN expires_at SET DEFAULT (NOW() + INTERVAL '14 days');

-- Backfill existing posts
UPDATE posts
SET expires_at = created_at + INTERVAL '14 days'
WHERE expires_at IS NULL;
```

### Step 4.3: Create Database Indexes

Copy content from `docs/database/schema/create_indexes.sql` and run.

**Important indexes**:

- `idx_posts_status` - Filter by status
- `idx_posts_created_by` - User's posts lookup
- `idx_posts_active_lat_lng` - Map bounds queries
- `idx_profiles_user_id` - Auth lookups

### Step 4.4: Seed Master Data (Required)

> ⚠️ **Important**: The following tables MUST have data for the app to work:

| Table            | Description                            | How to Add                                   |
| ---------------- | -------------------------------------- | -------------------------------------------- |
| `roles`          | User permissions (**REQUIRED, FIXED**) | Run file `docs/database/seed/roles_rows.sql` |
| `amenities`      | Amenities (Wifi, AC, etc.)             | Insert manually via Table Editor             |
| `property_types` | Property types (Room, Apartment, etc.) | Insert manually                              |
| `terms`          | Rental terms                           | Insert manually                              |
| `provinces`      | List of provinces/cities               | Import from Vietnam admin API                |
| `districts`      | List of districts                      | Import from Vietnam admin API                |
| `wards`          | List of wards                          | Import from Vietnam admin API                |

**Step 4.4.1: Seed Roles (Required First)**

```sql
-- File: docs/database/seed/roles_rows.sql
-- Run this file in SQL Editor
```

3 fixed roles:

- `renter` (id=1): Tenant - default role
- `lessor` (id=2): Landlord - can create posts
- `admin` (id=3): Administrator - full access

**Example seed property_types:**

```sql
INSERT INTO property_types (name, key, order_index, description) VALUES
  ('Room', 'room', 1, 'Single room for rent'),
  ('Mini Apartment', 'mini-apartment', 2, 'Studio/mini apartment'),
  ('Apartment', 'apartment', 3, 'Apartment in building'),
  ('House', 'house', 4, 'Whole house for rent');
```

> 💡 **Tip**: Province/district/ward data can be imported from [Vietnam Admin API](https://provinces.open-api.vn/)

---

## 5. Row Level Security (RLS)

### Step 5.1: Enable RLS

```sql
-- File: docs/database/rls/00_enable_rls_all_tables.sql

-- Lookup tables
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Main tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Junction tables
ALTER TABLE public.post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_terms ENABLE ROW LEVEL SECURITY;
```

### Step 5.2: Add RLS Policies

Run SQL files in `docs/database/rls/` folder in order:

| Folder                                           | Description                |
| ------------------------------------------------ | -------------------------- |
| `amenities/`                                     | Read-only for lookup       |
| `provinces/`, `districts/`, `wards/`             | Location lookups           |
| `property_types/`, `terms/`, `roles/`            | Master data                |
| `profiles/`                                      | User profile CRUD          |
| `posts/`                                         | Post CRUD with owner check |
| `post_images/`, `post_amenities/`, `post_terms/` | Junction tables            |

---

## 6. RPC Functions

Run SQL files in **SQL Editor**:

### 6.1 Map Bounds Query

```sql
-- File: docs/database/create_rpc_function.sql
-- Function: get_posts_by_map_bounds()
-- Filter posts by map viewport and filters
```

### 6.2 Dashboard Statistics

```sql
-- File: docs/database/dashboard_stats_functions.sql
-- Functions:
--   - get_dashboard_overview()
--   - get_dashboard_posts_by_property_type()
--   - get_dashboard_posts_by_status()
--   - get_dashboard_posts_trend()
--   - get_dashboard_top_districts()
```

### 6.3 Admin Posts List

```sql
-- File: docs/database/get_admin_posts.sql
-- Function: get_admin_posts()
```

### 6.4 User Posts List

```sql
-- File: docs/database/get_user_posts.sql
-- Function: get_user_posts()
```

### 6.5 Admin Users List

```sql
-- File: docs/database/get_admin_users.sql
-- Function: get_admin_users()
```

### 6.6 Post CRUD

```sql
-- File: docs/database/insert_post.sql
-- Function: insert_post()

-- File: docs/database/update_post.sql
-- Function: update_post()

-- File: docs/database/admin_delete_post.sql
-- Function: admin_delete_post()
```

---

## 7. JWT Custom Claims

### Step 7.1: Create Hook Function

```sql
-- File: docs/database/jwt_custom_claims.sql
-- Function: custom_access_token_hook()
```

### Step 7.2: Enable Hook in Supabase

1. Go to **Authentication** → **Hooks**
2. Click **Add hook**
3. Select **Customize Access Token (JWT)**
4. Select function: `custom_access_token_hook`
5. Click **Create hook**

> ✅ After enabling, JWT will contain `user_role` and `profile_id`

---

## 8. Environment Variables

Create `.env.local` file at project root:

```bash
# ===========================================
# Supabase (Required)
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsIn...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsIn...

# ===========================================
# App Domain (Optional - defaults to roommap.vn)
# ===========================================
NEXT_PUBLIC_APP_DOMAIN=roommap.vn
NEXT_PUBLIC_SUPPORT_EMAIL=support@roommap.vn

# ===========================================
# API URL (Required for internal API calls)
# ===========================================
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# ===========================================
# Mapbox (Required)
# ===========================================
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoi...

# ===========================================
# Cloudflare R2 - Image Storage (Required)
# S3-compatible API credentials for AWS SDK
# ===========================================
S3_REGION=auto
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=roommap-images
NEXT_PUBLIC_R2_URL=https://xxx.r2.dev

# ===========================================
# Google Analytics 4 (Optional)
# ===========================================
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# ===========================================
# Upstash Redis - Rate Limiting (Optional)
# ===========================================
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXxxxXXX

# ===========================================
# Cron Jobs (Production only)
# ===========================================
CRON_SECRET=<generate-with-openssl-rand-hex-32>
```

> ⚠️ **Note**: Ensure variable names are exactly as above. Project uses `PUBLISHABLE_KEY` instead of `ANON_KEY`.

---

## 9. External Services Setup

### 9.1 Mapbox

1. Sign up at [mapbox.com](https://www.mapbox.com/)
2. Go to **Account** → **Tokens**
3. Copy **Default public token**

### 9.2 Cloudflare R2 (Image Storage)

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **R2 Object Storage**
3. Create a new bucket
4. Go to **Manage R2 API Tokens** → Create token
5. Enable **Public Access** for the bucket

### 9.3 Google Analytics 4 (Optional)

Details: [GA4 Integration Guide](./ga4-integration.md)

1. Create GA4 property at [analytics.google.com](https://analytics.google.com/)
2. Get Measurement ID (`G-XXXXXXXXXX`)

### 9.4 Upstash Redis (Optional)

Details: [Rate Limiting Guide](./rate-limiting.md)

1. Sign up at [console.upstash.com](https://console.upstash.com/)
2. Create Redis database
3. Copy REST URL and Token

---

## 10. Run Development Server

```bash
npm run dev
```

Open browser: [http://localhost:3000](http://localhost:3000)

---

## 11. Verify Installation

### Checklist

| Item     | Test            | Expected                      |
| -------- | --------------- | ----------------------------- |
| Homepage | Visit `/`       | Landing page displays         |
| Map      | Visit `/map`    | Mapbox loads, markers display |
| Auth     | Click "Login"   | Google OAuth popup            |
| Database | Create new post | Post saves successfully       |

### Debug Tools

```bash
# Check Supabase connection
curl $NEXT_PUBLIC_SUPABASE_URL/rest/v1/ \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"

# Check GA4 (in browser console)
JSON.parse(localStorage.getItem('roommap_cookie_consent'))

# Check Redis connection
curl "$UPSTASH_REDIS_REST_URL/ping" \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
```

---

## Production Deployment

### Vercel Setup

1. Connect repository to Vercel
2. Add all environment variables
3. Deploy

### Cron Jobs

Details: [Cron Jobs Guide](./cron-jobs.md)

`vercel.json` is already configured:

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

> ⚠️ Remember to add `CRON_SECRET` to Vercel Environment Variables

---

## Reference Documentation

| Topic            | File                                       |
| ---------------- | ------------------------------------------ |
| Cron Jobs        | [cron-jobs.md](./cron-jobs.md)             |
| Google Analytics | [ga4-integration.md](./ga4-integration.md) |
| Rate Limiting    | [rate-limiting.md](./rate-limiting.md)     |
| Database Schema  | [database/schema/](./database/schema/)     |
| RLS Policies     | [database/rls/](./database/rls/)           |
| RPC Functions    | [database/\*.sql](./database/)             |

---

## Troubleshooting

| Issue                                       | Solution                                                                    |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| Supabase connection failed                  | Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| Map not loading                             | Check `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`                                     |
| Image upload error                          | Check R2 credentials and bucket permissions                                 |
| RLS blocking queries                        | Check policies and user authentication                                      |
| JWT missing role                            | Verify `custom_access_token_hook` is enabled                                |
| Google login not working                    | Check OAuth redirect URIs in Google Console and Supabase                    |
| API calls fail                              | Check `NEXT_PUBLIC_API_URL` is set correctly                                |
| Empty dropdowns (Property types, Amenities) | Master tables not seeded - see Step 4.4                                     |

---

_Last updated: 2025-12-13_
