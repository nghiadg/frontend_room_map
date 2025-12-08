-- ============================================================================
-- Supabase RPC Function: get_user_posts
-- Purpose: Get paginated posts list for user's own posts (My Posts page)
-- Usage: Copy entire file and paste into Supabase SQL Editor, then click Run
-- ============================================================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS get_user_posts(BIGINT, INTEGER, INTEGER, TEXT, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ);

CREATE OR REPLACE FUNCTION get_user_posts(
  _profile_id BIGINT,
  _page_number INTEGER DEFAULT 1,
  _page_size INTEGER DEFAULT 9,
  _search_query TEXT DEFAULT '',
  _status_filter TEXT DEFAULT '',
  _sort_by TEXT DEFAULT 'newest',
  _date_from TIMESTAMPTZ DEFAULT NULL,
  _date_to TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  price DOUBLE PRECISION,
  deposit DOUBLE PRECISION,
  area DOUBLE PRECISION,
  address TEXT,
  created_at TIMESTAMPTZ,
  is_rented BOOLEAN,
  first_image_url TEXT,
  property_type_id BIGINT,
  property_type_name TEXT,
  total_count BIGINT
) 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  offset_val INTEGER;
  safe_page_number INTEGER;
  safe_page_size INTEGER;
BEGIN
  -- Input validation: ensure positive pagination values
  safe_page_number := GREATEST(_page_number, 1);
  safe_page_size := GREATEST(LEAST(_page_size, 100), 1);  -- Clamp between 1-100
  
  -- Calculate offset for pagination
  offset_val := (safe_page_number - 1) * safe_page_size;

  -- Use CTE to avoid WHERE clause duplication (DRY principle)
  RETURN QUERY
  WITH filtered_posts AS (
    SELECT
      p.id,
      p.title,
      p.price,
      p.deposit,
      p.area,
      p.address,
      p.created_at,
      p.is_rented,
      p.property_type_id
    FROM posts p
    WHERE
      p.created_by = _profile_id
      AND p.is_deleted = false
      AND (_search_query = '' OR p.title ILIKE '%' || _search_query || '%' OR p.address ILIKE '%' || _search_query || '%')
      AND (
        _status_filter = '' OR _status_filter = 'all'
        OR (_status_filter = 'active' AND p.is_rented = false)
        OR (_status_filter = 'expired' AND p.is_rented = true)
      )
      AND (_date_from IS NULL OR p.created_at >= _date_from)
      AND (_date_to IS NULL OR p.created_at <= _date_to)
  ),
  counted_posts AS (
    SELECT COUNT(*) AS total FROM filtered_posts
  )
  SELECT
    fp.id,
    fp.title,
    fp.price,
    fp.deposit,
    fp.area,
    fp.address,
    fp.created_at,
    fp.is_rented,
    (
      SELECT pi.url 
      FROM post_images pi 
      WHERE pi.post_id = fp.id 
      ORDER BY pi.id ASC 
      LIMIT 1
    ) AS first_image_url,
    pt.id AS property_type_id,
    pt.name AS property_type_name,
    cp.total AS total_count
  FROM filtered_posts fp
  LEFT JOIN property_types pt ON fp.property_type_id = pt.id
  CROSS JOIN counted_posts cp
  ORDER BY
    CASE WHEN _sort_by = 'newest' THEN fp.created_at END DESC,
    CASE WHEN _sort_by = 'oldest' THEN fp.created_at END ASC,
    CASE WHEN _sort_by = 'price_high' THEN fp.price END DESC,
    CASE WHEN _sort_by = 'price_low' THEN fp.price END ASC,
    fp.created_at DESC -- default fallback
  LIMIT safe_page_size
  OFFSET offset_val;
END;
$$ LANGUAGE plpgsql STABLE;

-- Add comment for documentation
COMMENT ON FUNCTION get_user_posts IS 
'Returns paginated list of posts for user''s My Posts page.
Parameters:
  - _profile_id: User profile ID (required)
  - _page_number: Page number for pagination (default: 1)
  - _page_size: Number of items per page (default: 9)
  - _search_query: Search by title or address
  - _status_filter: all/active/expired
  - _sort_by: newest/oldest/price_high/price_low
  - _date_from: Filter posts created after this date
  - _date_to: Filter posts created before this date';

-- ============================================================================
-- Verification Query
-- ============================================================================
/*
SELECT * FROM get_user_posts(
  _profile_id := 1,
  _page_number := 1,
  _page_size := 9,
  _search_query := '',
  _status_filter := '',
  _sort_by := 'newest',
  _date_from := NULL,
  _date_to := NULL
);
*/
