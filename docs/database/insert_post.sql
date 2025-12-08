-- ============================================================================
-- Supabase RPC Function: insert_post
-- Purpose: Create a new post with related amenities, terms, and images in a transaction
-- Usage: Copy entire file and paste into Supabase SQL Editor, then click Run
-- ============================================================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS insert_post(
  TEXT, TEXT, BIGINT, DOUBLE PRECISION, TEXT, TEXT, TEXT, TEXT,
  DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION,
  DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION,
  TEXT, TEXT, BIGINT, BIGINT, BIGINT[], BIGINT[], TEXT[]
);

CREATE OR REPLACE FUNCTION insert_post(
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
  _created_by BIGINT,
  _updated_by BIGINT,
  _amenity_ids BIGINT[] DEFAULT ARRAY[]::BIGINT[],
  _term_ids BIGINT[] DEFAULT ARRAY[]::BIGINT[],
  _images TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS BIGINT
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_post_id BIGINT;
BEGIN
  -- =========================================================================
  -- Step 1: Insert the main post record
  -- =========================================================================
  INSERT INTO posts (
    title,
    description,
    property_type_id,
    area,
    province_code,
    district_code,
    ward_code,
    address,
    lat,
    lng,
    price,
    deposit,
    electricity_bill,
    water_bill,
    internet_bill,
    other_bill,
    water_bill_unit,
    internet_bill_unit,
    created_by,
    updated_by,
    created_at,
    updated_at
  ) VALUES (
    _title,
    _description,
    _property_type_id,
    _area,
    _province_code,
    _district_code,
    _ward_code,
    _address,
    _lat,
    _lng,
    _price,
    _deposit,
    _electricity_bill,
    _water_bill,
    _internet_bill,
    COALESCE(_other_bill, 0),
    _water_bill_unit,
    _internet_bill_unit,
    _created_by,
    _updated_by,
    NOW(),
    NOW()
  )
  RETURNING id INTO new_post_id;

  -- =========================================================================
  -- Step 2: Bulk insert post amenities (optimized: single INSERT)
  -- =========================================================================
  IF _amenity_ids IS NOT NULL AND array_length(_amenity_ids, 1) > 0 THEN
    INSERT INTO post_amenities (post_id, amenity_id, created_at, updated_at)
    SELECT new_post_id, unnest(_amenity_ids), NOW(), NOW();
  END IF;

  -- =========================================================================
  -- Step 3: Bulk insert post terms (optimized: single INSERT)
  -- =========================================================================
  IF _term_ids IS NOT NULL AND array_length(_term_ids, 1) > 0 THEN
    INSERT INTO post_terms (post_id, term_id, created_at, updated_at)
    SELECT new_post_id, unnest(_term_ids), NOW(), NOW();
  END IF;

  -- =========================================================================
  -- Step 4: Bulk insert post images (optimized: single INSERT)
  -- =========================================================================
  IF _images IS NOT NULL AND array_length(_images, 1) > 0 THEN
    INSERT INTO post_images (post_id, url, created_at, updated_at)
    SELECT new_post_id, unnest(_images), NOW(), NOW();
  END IF;

  RETURN new_post_id;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION insert_post IS 
'Creates a new rental post with all related data in a single transaction.
Inserts into: posts, post_amenities, post_terms, post_images tables.
Returns: The new post ID.
Parameters:
  - Post details: title, description, property_type_id, area, location codes, address, lat/lng
  - Billing: price, deposit, electricity/water/internet/other bills with units
  - Ownership: created_by, updated_by (profile IDs)
  - Relations: amenity_ids, term_ids (arrays of IDs)
  - Media: images (array of image URLs/keys)';

-- ============================================================================
-- Verification Query
-- ============================================================================
/*
SELECT insert_post(
  _title := 'Test Post',
  _description := 'Test description',
  _property_type_id := 1,
  _area := 30.0,
  _province_code := '79',
  _district_code := '760',
  _ward_code := '26734',
  _address := '123 Test Street',
  _lat := 10.762622,
  _lng := 106.660172,
  _price := 5000000,
  _deposit := 5000000,
  _electricity_bill := 3500,
  _water_bill := 100000,
  _internet_bill := 200000,
  _other_bill := 0,
  _water_bill_unit := 'per_person',
  _internet_bill_unit := 'included',
  _created_by := 1,
  _updated_by := 1,
  _amenity_ids := ARRAY[1, 2, 3]::BIGINT[],
  _term_ids := ARRAY[1, 2]::BIGINT[],
  _images := ARRAY['image1.jpg', 'image2.jpg']::TEXT[]
);
*/
