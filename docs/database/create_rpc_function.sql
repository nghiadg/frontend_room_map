-- ============================================================================
-- Supabase RPC Function: get_posts_by_map_bounds
-- Purpose: Filter posts by map bounds and all filters at database level
-- Usage: Copy entire file and paste into Supabase SQL Editor, then click Run
-- ============================================================================

CREATE OR REPLACE FUNCTION get_posts_by_map_bounds(
  ne_lat DOUBLE PRECISION,
  ne_lng DOUBLE PRECISION,
  sw_lat DOUBLE PRECISION,
  sw_lng DOUBLE PRECISION,
  min_price DOUBLE PRECISION DEFAULT NULL,
  max_price DOUBLE PRECISION DEFAULT NULL,
  min_area DOUBLE PRECISION DEFAULT NULL,
  max_area DOUBLE PRECISION DEFAULT NULL,
  property_type_ids BIGINT[] DEFAULT NULL,
  amenity_ids BIGINT[] DEFAULT NULL,
  posts_limit INTEGER DEFAULT 500
)
RETURNS TABLE (
  id BIGINT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  price DOUBLE PRECISION,
  title TEXT,
  area DOUBLE PRECISION,
  property_type_id BIGINT
) AS $$
BEGIN
  -- If amenity filter is provided, use JOIN to filter posts with ALL amenities
  IF amenity_ids IS NOT NULL AND array_length(amenity_ids, 1) > 0 THEN
    RETURN QUERY
    SELECT DISTINCT
      p.id,
      p.lat,
      p.lng,
      p.price,
      p.title,
      p.area,
      p.property_type_id
    FROM posts p
    INNER JOIN post_amenities pa ON p.id = pa.post_id
    WHERE
      p.status = 'active'
      AND p.lat >= sw_lat
      AND p.lat <= ne_lat
      AND (
        (sw_lng <= ne_lng AND p.lng >= sw_lng AND p.lng <= ne_lng)
        OR (sw_lng > ne_lng AND (p.lng >= sw_lng OR p.lng <= ne_lng))
      )
      AND (min_price IS NULL OR p.price >= min_price)
      AND (max_price IS NULL OR p.price <= max_price)
      AND (min_area IS NULL OR p.area >= min_area)
      AND (max_area IS NULL OR p.area <= max_area)
      AND (property_type_ids IS NULL OR p.property_type_id = ANY(property_type_ids))
      AND pa.amenity_id = ANY(amenity_ids)
    GROUP BY p.id, p.lat, p.lng, p.price, p.title, p.area, p.property_type_id
    HAVING COUNT(DISTINCT pa.amenity_id) = array_length(amenity_ids, 1)
    LIMIT posts_limit;
  
  -- Without amenity filter, simple query without JOIN
  ELSE
    RETURN QUERY
    SELECT
      p.id,
      p.lat,
      p.lng,
      p.price,
      p.title,
      p.area,
      p.property_type_id
    FROM posts p
    WHERE
      p.status = 'active'
      AND p.lat >= sw_lat
      AND p.lat <= ne_lat
      AND (
        (sw_lng <= ne_lng AND p.lng >= sw_lng AND p.lng <= ne_lng)
        OR (sw_lng > ne_lng AND (p.lng >= sw_lng OR p.lng <= ne_lng))
      )
      AND (min_price IS NULL OR p.price >= min_price)
      AND (max_price IS NULL OR p.price <= max_price)
      AND (min_area IS NULL OR p.area >= min_area)
      AND (max_area IS NULL OR p.area <= max_area)
      AND (property_type_ids IS NULL OR p.property_type_id = ANY(property_type_ids))
    LIMIT posts_limit;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- Add comment for documentation
COMMENT ON FUNCTION get_posts_by_map_bounds IS 
'Filters posts by map bounds and all filter criteria at database level.
All filtering happens in SQL for optimal performance.
When amenity_ids is provided, returns only posts with ALL specified amenities.
NULL parameters are treated as no filter for that criterion.';

-- ============================================================================
-- Verification Query (Optional - uncomment to test)
-- ============================================================================
/*
SELECT * FROM get_posts_by_map_bounds(
  ne_lat := 21.0,
  ne_lng := 106.0,
  sw_lat := 20.0,
  sw_lng := 105.0,
  min_price := 1000000,
  max_price := 10000000,
  amenity_ids := ARRAY[1, 2]
);
*/
