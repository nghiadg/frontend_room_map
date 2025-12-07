-- ============================================================================
-- Supabase RPC Function: get_admin_users
-- Purpose: Get paginated users list for admin panel
-- Usage: Copy entire file and paste into Supabase SQL Editor, then click Run
-- ============================================================================

-- First drop the existing function
DROP FUNCTION IF EXISTS get_admin_users(INTEGER, INTEGER, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION get_admin_users(
  page_number INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 10,
  search_query TEXT DEFAULT '',
  role_filter TEXT DEFAULT '',
  sort_by TEXT DEFAULT 'created_at',
  sort_order TEXT DEFAULT 'desc'
)
RETURNS TABLE (
  id BIGINT,
  user_id UUID,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
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
  FROM profiles p
  LEFT JOIN roles r ON p.role_id = r.id
  LEFT JOIN auth.users au ON p.user_id = au.id
  WHERE
    p.deleted_at IS NULL
    AND (search_query = '' OR p.full_name ILIKE '%' || search_query || '%' OR au.email ILIKE '%' || search_query || '%')
    AND (role_filter = '' OR r.name = role_filter);

  -- Return results with total count
  RETURN QUERY
  SELECT
    p.id,
    p.user_id,
    p.full_name,
    au.email::TEXT,
    (au.raw_user_meta_data->>'avatar_url')::TEXT AS avatar_url,
    p.phone_number,
    r.name AS role,
    p.created_at,
    total AS total_count
  FROM profiles p
  LEFT JOIN roles r ON p.role_id = r.id
  LEFT JOIN auth.users au ON p.user_id = au.id
  WHERE
    p.deleted_at IS NULL
    AND (search_query = '' OR p.full_name ILIKE '%' || search_query || '%' OR au.email ILIKE '%' || search_query || '%')
    AND (role_filter = '' OR r.name = role_filter)
  ORDER BY
    CASE WHEN sort_by = 'full_name' AND sort_order = 'asc' THEN p.full_name END ASC,
    CASE WHEN sort_by = 'full_name' AND sort_order = 'desc' THEN p.full_name END DESC,
    CASE WHEN sort_by = 'role' AND sort_order = 'asc' THEN r.name END ASC,
    CASE WHEN sort_by = 'role' AND sort_order = 'desc' THEN r.name END DESC,
    CASE WHEN sort_by = 'created_at' AND sort_order = 'asc' THEN p.created_at END ASC,
    CASE WHEN sort_by = 'created_at' AND sort_order = 'desc' THEN p.created_at END DESC,
    p.created_at DESC -- default fallback
  LIMIT page_size
  OFFSET offset_val;
END;
$$ LANGUAGE plpgsql STABLE;

-- Add comment for documentation
COMMENT ON FUNCTION get_admin_users IS 
'Returns paginated list of users for admin panel with email and avatar from auth.users.
SECURITY DEFINER allows access to auth.users table.';

-- ============================================================================
-- Verification Query
-- ============================================================================
/*
SELECT * FROM get_admin_users(
  page_number := 1,
  page_size := 10,
  search_query := '',
  role_filter := '',
  sort_by := 'created_at',
  sort_order := 'desc'
);
*/
