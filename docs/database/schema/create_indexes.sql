-- ============================================================================
-- Supabase Database Indexes
-- Purpose: Optimize query performance for all RPC functions and API queries
-- Usage: Copy entire file and paste into Supabase SQL Editor, then click Run
-- Created: 2025-12-13
-- ============================================================================

-- ============================================================================
-- POSTS TABLE INDEXES (Critical - Most queried table)
-- ============================================================================

-- Index 1: Status filtering
-- Used by: get_admin_posts, get_user_posts, get_posts_by_map_bounds, dashboard stats
-- Query pattern: WHERE status = 'active' / status != 'deleted'
CREATE INDEX IF NOT EXISTS idx_posts_status 
ON public.posts (status);

-- Index 2: User's own posts lookup
-- Used by: get_user_posts (My Posts page)
-- Query pattern: WHERE created_by = ?
CREATE INDEX IF NOT EXISTS idx_posts_created_by 
ON public.posts (created_by);

-- Index 3: Date sorting and filtering
-- Used by: get_admin_posts, get_user_posts, get_dashboard_posts_trend
-- Query pattern: ORDER BY created_at DESC, WHERE created_at >= ? AND created_at <= ?
CREATE INDEX IF NOT EXISTS idx_posts_created_at 
ON public.posts (created_at DESC);

-- Index 4: Composite index for admin posts list
-- Used by: get_admin_posts with date range filter and sort
-- Query pattern: WHERE status = ? AND created_at >= ? ORDER BY created_at
CREATE INDEX IF NOT EXISTS idx_posts_status_created_at 
ON public.posts (status, created_at DESC);

-- Index 5: Composite index for user posts with status filter
-- Used by: get_user_posts
-- Query pattern: WHERE created_by = ? AND status != 'deleted'
CREATE INDEX IF NOT EXISTS idx_posts_status_created_by 
ON public.posts (created_by, status);

-- Index 6: Property type filtering
-- Used by: get_admin_posts, get_posts_by_map_bounds
-- Query pattern: WHERE property_type_id = ?
CREATE INDEX IF NOT EXISTS idx_posts_property_type_id 
ON public.posts (property_type_id);

-- Index 7: Geo-spatial partial index for map bounds queries (active posts only)
-- Used by: get_posts_by_map_bounds
-- Query pattern: WHERE status = 'active' AND lat >= ? AND lat <= ? AND lng >= ? AND lng <= ?
-- Note: Partial index only includes active posts for optimal performance
CREATE INDEX IF NOT EXISTS idx_posts_active_lat_lng 
ON public.posts (lat, lng) 
WHERE status = 'active';

-- Index 8-10: Location code foreign key lookups
-- Used by: Multiple functions for JOINs with provinces/districts/wards
CREATE INDEX IF NOT EXISTS idx_posts_province_code 
ON public.posts (province_code);

CREATE INDEX IF NOT EXISTS idx_posts_district_code 
ON public.posts (district_code);

CREATE INDEX IF NOT EXISTS idx_posts_ward_code 
ON public.posts (ward_code);

-- Index 11: Price range filtering (for map bounds)
-- Used by: get_posts_by_map_bounds
-- Query pattern: WHERE price >= ? AND price <= ?
CREATE INDEX IF NOT EXISTS idx_posts_price 
ON public.posts (price);

-- Index 12: Area range filtering (for map bounds)
-- Used by: get_posts_by_map_bounds
-- Query pattern: WHERE area >= ? AND area <= ?
CREATE INDEX IF NOT EXISTS idx_posts_area 
ON public.posts (area);


-- ============================================================================
-- PROFILES TABLE INDEXES
-- ============================================================================

-- Index 1: User ID lookup (CRITICAL - used on every protected route)
-- Used by: Middleware auth check, all API routes
-- Query pattern: WHERE user_id = ?
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id 
ON public.profiles (user_id);

-- Index 2: Active users filter (partial index)
-- Used by: get_admin_users, get_dashboard_overview
-- Query pattern: WHERE deleted_at IS NULL
CREATE INDEX IF NOT EXISTS idx_profiles_active 
ON public.profiles (id) 
WHERE deleted_at IS NULL;

-- Index 3: Role filtering
-- Used by: get_admin_users
-- Query pattern: JOIN roles, WHERE role_id = ?
CREATE INDEX IF NOT EXISTS idx_profiles_role_id 
ON public.profiles (role_id);


-- ============================================================================
-- POST_IMAGES TABLE INDEXES
-- ============================================================================

-- Index 1: Images by post ID
-- Used by: get_admin_posts, get_user_posts (subquery for first image)
-- Query pattern: WHERE post_id = ? ORDER BY id ASC LIMIT 1
CREATE INDEX IF NOT EXISTS idx_post_images_post_id 
ON public.post_images (post_id, id);


-- ============================================================================
-- POST_AMENITIES TABLE INDEXES
-- ============================================================================

-- Index 1: Amenities by post ID
-- Used by: Post detail page, update_post DELETE
-- Query pattern: WHERE post_id = ?
CREATE INDEX IF NOT EXISTS idx_post_amenities_post_id 
ON public.post_amenities (post_id);

-- Index 2: Posts by amenity ID
-- Used by: get_posts_by_map_bounds (filter by amenities)
-- Query pattern: WHERE amenity_id = ANY(?)
CREATE INDEX IF NOT EXISTS idx_post_amenities_amenity_id 
ON public.post_amenities (amenity_id);

-- Index 3: Composite for amenity filtering with grouping
-- Used by: get_posts_by_map_bounds HAVING clause
CREATE INDEX IF NOT EXISTS idx_post_amenities_post_amenity 
ON public.post_amenities (post_id, amenity_id);


-- ============================================================================
-- POST_TERMS TABLE INDEXES
-- ============================================================================

-- Index 1: Terms by post ID
-- Used by: Post detail page, update_post DELETE
-- Query pattern: WHERE post_id = ?
CREATE INDEX IF NOT EXISTS idx_post_terms_post_id 
ON public.post_terms (post_id);


-- ============================================================================
-- LOCATION TABLES INDEXES
-- ============================================================================

-- Districts by province (for cascading dropdowns)
-- Used by: /api/v1/locations/provinces/[provinceCode]/districts
-- Query pattern: WHERE province_code = ?
CREATE INDEX IF NOT EXISTS idx_districts_province_code 
ON public.districts (province_code);

-- Wards by district (for cascading dropdowns)
-- Used by: /api/v1/locations/districts/[districtCode]/wards
-- Query pattern: WHERE district_code = ?
CREATE INDEX IF NOT EXISTS idx_wards_district_code 
ON public.wards (district_code);


-- ============================================================================
-- VERIFICATION QUERIES (Uncomment to run)
-- ============================================================================

/*
-- View all indexes on public schema
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check index usage statistics
SELECT 
  schemaname,
  relname AS table_name,
  indexrelname AS index_name,
  idx_scan AS times_used,
  idx_tup_read AS rows_read,
  idx_tup_fetch AS rows_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Test map bounds query performance
EXPLAIN ANALYZE
SELECT * FROM get_posts_by_map_bounds(
  ne_lat := 21.0,
  ne_lng := 106.0,
  sw_lat := 20.0,
  sw_lng := 105.0
);

-- Test user posts query performance
EXPLAIN ANALYZE
SELECT * FROM get_user_posts(_profile_id := 1);

-- Test admin posts query performance
EXPLAIN ANALYZE
SELECT * FROM get_admin_posts();
*/

-- ============================================================================
-- INDEX SIZE ESTIMATION
-- Run this after creating indexes to check their size
-- ============================================================================

/*
SELECT
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
  relname AS table_name,
  indexrelname AS index_name
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
*/
