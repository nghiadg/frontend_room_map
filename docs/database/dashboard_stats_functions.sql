-- ============================================================================
-- Supabase RPC Functions: Dashboard Statistics
-- Purpose: Get statistics for admin dashboard
-- Usage: Copy entire file and paste into Supabase SQL Editor, then click Run
-- Note: Uses 'status' field with values: 'active', 'rented', 'hidden', 'deleted'
-- ============================================================================

-- ============================================================================
-- RPC 1: get_dashboard_overview
-- Returns basic statistics for stats cards
-- Optimized: Uses single table scan with FILTER for conditional aggregation
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_overview()
RETURNS JSON
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  posts_stats RECORD;
  user_count BIGINT;
BEGIN
  -- Single scan for all post statistics using FILTER clause
  SELECT 
    COUNT(*) FILTER (WHERE status != 'deleted') as total_posts,
    COUNT(*) FILTER (WHERE status = 'active') as available_posts,
    COUNT(*) FILTER (WHERE status = 'rented') as rented_posts,
    COUNT(*) FILTER (WHERE status = 'deleted') as deleted_posts,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days' AND status != 'deleted') as posts_last_30_days
  INTO posts_stats
  FROM posts;

  -- Separate query for users (different table)
  SELECT COUNT(*) INTO user_count FROM profiles WHERE deleted_at IS NULL;

  RETURN json_build_object(
    'total_posts', posts_stats.total_posts,
    'available_posts', posts_stats.available_posts,
    'rented_posts', posts_stats.rented_posts,
    'deleted_posts', posts_stats.deleted_posts,
    'total_users', user_count,
    'posts_last_30_days', posts_stats.posts_last_30_days
  );
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_dashboard_overview IS 'Returns basic dashboard overview statistics for stats cards. Optimized with single table scan.';

-- ============================================================================
-- RPC 2: get_dashboard_posts_by_property_type
-- Returns post distribution by property type for bar chart
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_posts_by_property_type()
RETURNS TABLE (
  key TEXT,
  name TEXT,
  count BIGINT
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pt.key::TEXT,
    pt.name::TEXT,
    COUNT(p.id)::BIGINT as count
  FROM property_types pt
  LEFT JOIN posts p ON p.property_type_id = pt.id AND p.status != 'deleted'
  GROUP BY pt.id, pt.key, pt.name
  ORDER BY pt.order_index;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_dashboard_posts_by_property_type IS 'Returns post distribution by property type for bar chart.';

-- ============================================================================
-- RPC 3: get_dashboard_posts_by_status
-- Returns post distribution by status for pie chart
-- Optimized: Uses single GROUP BY scan instead of 4 UNION queries
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_posts_by_status()
RETURNS TABLE (
  status TEXT,
  count BIGINT
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.status::TEXT,
    COUNT(*)::BIGINT
  FROM posts p
  WHERE p.status IN ('active', 'rented', 'hidden', 'deleted')
  GROUP BY p.status
  ORDER BY 
    CASE p.status
      WHEN 'active' THEN 1
      WHEN 'rented' THEN 2
      WHEN 'hidden' THEN 3
      WHEN 'deleted' THEN 4
    END;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_dashboard_posts_by_status IS 'Returns post distribution by status for pie chart. Optimized with single GROUP BY scan.';

-- ============================================================================
-- RPC 4: get_dashboard_posts_trend
-- Returns post creation trend over time for area chart
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_posts_trend(
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  date DATE,
  count BIGINT
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(p.created_at) as date,
    COUNT(*)::BIGINT as count
  FROM posts p
  WHERE p.created_at >= NOW() - (days_back || ' days')::INTERVAL 
    AND p.status != 'deleted'
  GROUP BY DATE(p.created_at)
  ORDER BY date;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_dashboard_posts_trend IS 'Returns post creation trend over time for area chart.';

-- ============================================================================
-- RPC 5: get_dashboard_top_districts
-- Returns top districts with most posts for horizontal bar chart
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_top_districts(
  limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  district_name TEXT,
  province_name TEXT,
  count BIGINT
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.name::TEXT as district_name,
    prov.name::TEXT as province_name,
    COUNT(p.id)::BIGINT as count
  FROM posts p
  LEFT JOIN districts d ON p.district_code = d.code
  LEFT JOIN provinces prov ON p.province_code = prov.code
  WHERE p.status != 'deleted'
  GROUP BY d.name, prov.name
  ORDER BY count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_dashboard_top_districts IS 'Returns top districts with most posts for horizontal bar chart.';

-- ============================================================================
-- Verification Queries
-- ============================================================================
/*
-- Test get_dashboard_overview
SELECT get_dashboard_overview();

-- Test get_dashboard_posts_by_property_type
SELECT * FROM get_dashboard_posts_by_property_type();

-- Test get_dashboard_posts_by_status
SELECT * FROM get_dashboard_posts_by_status();

-- Test get_dashboard_posts_trend
SELECT * FROM get_dashboard_posts_trend(30);

-- Test get_dashboard_top_districts
SELECT * FROM get_dashboard_top_districts(5);
*/

