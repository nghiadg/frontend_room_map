-- ============================================================================
-- Supabase RPC Functions: Dashboard Statistics
-- Purpose: Get statistics for admin dashboard
-- Usage: Copy entire file and paste into Supabase SQL Editor, then click Run
-- ============================================================================

-- ============================================================================
-- RPC 1: get_dashboard_overview
-- Returns basic statistics for stats cards
-- ============================================================================
CREATE OR REPLACE FUNCTION get_dashboard_overview()
RETURNS JSON
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN json_build_object(
    'total_posts', (SELECT COUNT(*) FROM posts WHERE is_deleted = false),
    'available_posts', (SELECT COUNT(*) FROM posts WHERE is_rented = false AND is_deleted = false),
    'rented_posts', (SELECT COUNT(*) FROM posts WHERE is_rented = true AND is_deleted = false),
    'deleted_posts', (SELECT COUNT(*) FROM posts WHERE is_deleted = true),
    'total_users', (SELECT COUNT(*) FROM profiles WHERE deleted_at IS NULL),
    'posts_last_30_days', (
      SELECT COUNT(*) FROM posts 
      WHERE created_at >= NOW() - INTERVAL '30 days' AND is_deleted = false
    )
  );
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_dashboard_overview IS 'Returns basic dashboard overview statistics for stats cards.';

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
  LEFT JOIN posts p ON p.property_type_id = pt.id AND p.is_deleted = false
  GROUP BY pt.id, pt.key, pt.name
  ORDER BY pt.order_index;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_dashboard_posts_by_property_type IS 'Returns post distribution by property type for bar chart.';

-- ============================================================================
-- RPC 3: get_dashboard_posts_by_status
-- Returns post distribution by status for pie chart
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
  SELECT 'available'::TEXT as status, COUNT(*)::BIGINT 
  FROM posts WHERE is_rented = false AND is_deleted = false
  UNION ALL
  SELECT 'rented'::TEXT, COUNT(*)::BIGINT 
  FROM posts WHERE is_rented = true AND is_deleted = false
  UNION ALL
  SELECT 'deleted'::TEXT, COUNT(*)::BIGINT 
  FROM posts WHERE is_deleted = true;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_dashboard_posts_by_status IS 'Returns post distribution by status for pie chart.';

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
    AND p.is_deleted = false
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
  WHERE p.is_deleted = false
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
