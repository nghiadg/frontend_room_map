-- ============================================================================
-- Supabase RPC Function: update_post
-- Purpose: Update an existing post with related amenities, terms, and images in a transaction
-- Usage: Copy entire file and paste into Supabase SQL Editor, then click Run
-- ============================================================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS update_post(
  BIGINT, TEXT, TEXT, BIGINT, DOUBLE PRECISION, TEXT, TEXT, TEXT, TEXT,
  DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION,
  DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION,
  TEXT, TEXT, BIGINT, BIGINT[], BIGINT[], TEXT[], BIGINT[]
);

CREATE OR REPLACE FUNCTION update_post(
  _id BIGINT,
  _title TEXT,
  _description TEXT,
  _property_type_id BIGINT,
  _area DOUBLE PRECISION,
  _province_code TEXT,
  _district_code TEXT,
  _ward_code TEXT,
  _address TEXT,
  _lat DOUBLE PRECISION,
  _lng DOUBLE PRECISION,
  _price DOUBLE PRECISION,
  _deposit DOUBLE PRECISION,
  _electricity_bill DOUBLE PRECISION,
  _water_bill DOUBLE PRECISION,
  _internet_bill DOUBLE PRECISION,
  _other_bill DOUBLE PRECISION,
  _water_bill_unit TEXT,
  _internet_bill_unit TEXT,
  _updated_by BIGINT,
  _amenity_ids BIGINT[] DEFAULT ARRAY[]::BIGINT[],
  _term_ids BIGINT[] DEFAULT ARRAY[]::BIGINT[],
  _images TEXT[] DEFAULT ARRAY[]::TEXT[],
  _deleted_image_ids BIGINT[] DEFAULT ARRAY[]::BIGINT[]
)
RETURNS BIGINT
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  -- No loop variables needed with bulk operations
BEGIN
  -- =========================================================================
  -- Step 1: Update the main post record
  -- =========================================================================
  UPDATE posts SET
    title = _title,
    description = _description,
    property_type_id = _property_type_id,
    area = _area,
    province_code = _province_code,
    district_code = _district_code,
    ward_code = _ward_code,
    address = _address,
    lat = _lat,
    lng = _lng,
    price = _price,
    deposit = _deposit,
    electricity_bill = _electricity_bill,
    water_bill = _water_bill,
    internet_bill = _internet_bill,
    other_bill = COALESCE(_other_bill, 0),
    water_bill_unit = _water_bill_unit,
    internet_bill_unit = _internet_bill_unit,
    updated_by = _updated_by,
    updated_at = NOW()
  WHERE id = _id;

  -- =========================================================================
  -- Step 2: Replace post amenities (delete all + bulk insert)
  -- =========================================================================
  DELETE FROM post_amenities WHERE post_id = _id;
  
  IF _amenity_ids IS NOT NULL AND array_length(_amenity_ids, 1) > 0 THEN
    INSERT INTO post_amenities (post_id, amenity_id, created_at, updated_at)
    SELECT _id, unnest(_amenity_ids), NOW(), NOW();
  END IF;

  -- =========================================================================
  -- Step 3: Replace post terms (delete all + bulk insert)
  -- =========================================================================
  DELETE FROM post_terms WHERE post_id = _id;
  
  IF _term_ids IS NOT NULL AND array_length(_term_ids, 1) > 0 THEN
    INSERT INTO post_terms (post_id, term_id, created_at, updated_at)
    SELECT _id, unnest(_term_ids), NOW(), NOW();
  END IF;

  -- =========================================================================
  -- Step 4: Delete specified images (optimized: single DELETE with ANY)
  -- =========================================================================
  IF _deleted_image_ids IS NOT NULL AND array_length(_deleted_image_ids, 1) > 0 THEN
    DELETE FROM post_images 
    WHERE id = ANY(_deleted_image_ids) AND post_id = _id;
  END IF;

  -- =========================================================================
  -- Step 5: Bulk insert new images (optimized: single INSERT)
  -- =========================================================================
  IF _images IS NOT NULL AND array_length(_images, 1) > 0 THEN
    INSERT INTO post_images (post_id, url, created_at, updated_at)
    SELECT _id, unnest(_images), NOW(), NOW();
  END IF;

  RETURN _id;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION update_post IS 
'Updates an existing rental post with all related data in a single transaction.
Steps:
  1. Update posts table
  2. Replace all post_amenities (delete + insert)
  3. Replace all post_terms (delete + insert)
  4. Delete specified images from post_images
  5. Insert new images to post_images
Returns: The updated post ID.
Parameters:
  - _id: Post ID to update
  - Post details: title, description, property_type_id, area, location codes, address, lat/lng
  - Billing: price, deposit, electricity/water/internet/other bills with units
  - Ownership: updated_by (profile ID)
  - Relations: amenity_ids, term_ids (arrays of IDs - completely replaced)
  - Media: images (new image URLs/keys), deleted_image_ids (IDs to remove)';

-- ============================================================================
-- Verification Query
-- ============================================================================
/*
SELECT update_post(
  _id := 1,
  _title := 'Updated Post Title',
  _description := 'Updated description',
  _property_type_id := 1,
  _area := 35.0,
  _province_code := '79',
  _district_code := '760',
  _ward_code := '26734',
  _address := '456 Updated Street',
  _lat := 10.762622,
  _lng := 106.660172,
  _price := 6000000,
  _deposit := 6000000,
  _electricity_bill := 3500,
  _water_bill := 100000,
  _internet_bill := 200000,
  _other_bill := 50000,
  _water_bill_unit := 'per_person',
  _internet_bill_unit := 'included',
  _updated_by := 1,
  _amenity_ids := ARRAY[1, 2, 4]::BIGINT[],
  _term_ids := ARRAY[1, 3]::BIGINT[],
  _images := ARRAY['new_image.jpg']::TEXT[],
  _deleted_image_ids := ARRAY[5, 6]::BIGINT[]
);
*/
