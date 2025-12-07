-- ============================================================================
-- Supabase RPC Function: get_admin_posts
-- Purpose: Get paginated posts list for admin panel
-- Usage: Copy entire file and paste into Supabase SQL Editor, then click Run
-- ============================================================================

-- First drop the existing function
DROP FUNCTION IF EXISTS get_admin_posts(INTEGER, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS get_admin_posts(INTEGER, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ);

CREATE OR REPLACE FUNCTION get_admin_posts(
  page_number INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 10,
  search_query TEXT DEFAULT '',
  property_type_filter TEXT DEFAULT '',
  status_filter TEXT DEFAULT '',
  sort_by TEXT DEFAULT 'created_at',
  sort_order TEXT DEFAULT 'desc',
  date_from TIMESTAMPTZ DEFAULT NULL,
  date_to TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  address TEXT,
  ward_name TEXT,
  district_name TEXT,
  province_name TEXT,
  price DOUBLE PRECISION,
  area DOUBLE PRECISION,
  property_type_key TEXT,
  property_type_name TEXT,
  is_rented BOOLEAN,
  is_deleted BOOLEAN,
  created_at TIMESTAMPTZ,
  creator_id BIGINT,
  creator_name TEXT,
  creator_email TEXT,
  first_image_url TEXT,
  image_count BIGINT,
  total_count BIGINT
) 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  offset_val INTEGER;
  total BIGINT;
BEGIN
  -- Calculate offset
  offset_val := (page_number - 1) * page_size;
  
  -- Get total count first
  SELECT COUNT(*)
  INTO total
  FROM posts p
  LEFT JOIN property_types pt ON p.property_type_id = pt.id
  WHERE
    (search_query = '' OR p.title ILIKE '%' || search_query || '%' OR p.address ILIKE '%' || search_query || '%')
    AND (property_type_filter = '' OR pt.key = property_type_filter)
    AND (
      status_filter = '' 
      OR (status_filter = 'available' AND p.is_rented = false AND p.is_deleted = false)
      OR (status_filter = 'rented' AND p.is_rented = true AND p.is_deleted = false)
      OR (status_filter = 'deleted' AND p.is_deleted = true)
    )
    AND (date_from IS NULL OR p.created_at >= date_from)
    AND (date_to IS NULL OR p.created_at <= date_to);

  -- Return results with total count
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.address,
    w.name AS ward_name,
    d.name AS district_name,
    prov.name AS province_name,
    p.price,
    p.area,
    pt.key AS property_type_key,
    pt.name AS property_type_name,
    p.is_rented,
    p.is_deleted,
    p.created_at,
    pr.id AS creator_id,
    pr.full_name AS creator_name,
    au.email::TEXT AS creator_email,
    (
      SELECT pi.url 
      FROM post_images pi 
      WHERE pi.post_id = p.id 
      ORDER BY pi.id ASC 
      LIMIT 1
    ) AS first_image_url,
    (
      SELECT COUNT(*) 
      FROM post_images pi 
      WHERE pi.post_id = p.id
    ) AS image_count,
    total AS total_count
  FROM posts p
  LEFT JOIN property_types pt ON p.property_type_id = pt.id
  LEFT JOIN profiles pr ON p.created_by = pr.id
  LEFT JOIN wards w ON p.ward_code = w.code
  LEFT JOIN districts d ON p.district_code = d.code
  LEFT JOIN provinces prov ON p.province_code = prov.code
  LEFT JOIN auth.users au ON pr.user_id = au.id
  WHERE
    (search_query = '' OR p.title ILIKE '%' || search_query || '%' OR p.address ILIKE '%' || search_query || '%')
    AND (property_type_filter = '' OR pt.key = property_type_filter)
    AND (
      status_filter = '' 
      OR (status_filter = 'available' AND p.is_rented = false AND p.is_deleted = false)
      OR (status_filter = 'rented' AND p.is_rented = true AND p.is_deleted = false)
      OR (status_filter = 'deleted' AND p.is_deleted = true)
    )
    AND (date_from IS NULL OR p.created_at >= date_from)
    AND (date_to IS NULL OR p.created_at <= date_to)
  ORDER BY
    CASE WHEN sort_by = 'title' AND sort_order = 'asc' THEN p.title END ASC,
    CASE WHEN sort_by = 'title' AND sort_order = 'desc' THEN p.title END DESC,
    CASE WHEN sort_by = 'price' AND sort_order = 'asc' THEN p.price END ASC,
    CASE WHEN sort_by = 'price' AND sort_order = 'desc' THEN p.price END DESC,
    CASE WHEN sort_by = 'created_at' AND sort_order = 'asc' THEN p.created_at END ASC,
    CASE WHEN sort_by = 'created_at' AND sort_order = 'desc' THEN p.created_at END DESC,
    p.created_at DESC -- default fallback
  LIMIT page_size
  OFFSET offset_val;
END;
$$ LANGUAGE plpgsql STABLE;

-- Add comment for documentation
COMMENT ON FUNCTION get_admin_posts IS 
'Returns paginated list of posts for admin panel with property type, creator info, and first image.
Status filter: available, rented, deleted';

-- ============================================================================
-- Verification Query
-- ============================================================================
/*
SELECT * FROM get_admin_posts(
  page_number := 1,
  page_size := 10,
  search_query := '',
  property_type_filter := '',
  status_filter := '',
  sort_by := 'created_at',
  sort_order := 'desc'
);
*/
