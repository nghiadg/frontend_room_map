-- ============================================================================
-- Supabase RPC Function: admin_delete_post
-- Purpose: Soft delete a post with reason (admin only)
-- Usage: Copy entire file and paste into Supabase SQL Editor, then click Run
-- Note: Uses 'status' field with value 'deleted' instead of is_deleted boolean
-- ============================================================================

-- First drop the existing function
DROP FUNCTION IF EXISTS admin_delete_post(BIGINT, TEXT, BIGINT);

CREATE OR REPLACE FUNCTION admin_delete_post(
  p_post_id BIGINT,
  p_reason TEXT,
  p_admin_id BIGINT
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_exists BOOLEAN;
BEGIN
  -- Check if post exists and is not already deleted
  SELECT EXISTS(
    SELECT 1 FROM posts 
    WHERE id = p_post_id AND status != 'deleted'
  ) INTO v_post_exists;

  IF NOT v_post_exists THEN
    RAISE EXCEPTION 'Post not found or already deleted';
  END IF;

  -- Soft delete the post with reason
  UPDATE posts
  SET 
    status = 'deleted',
    deleted_reason = p_reason,
    deleted_by = p_admin_id,
    deleted_at = now(),
    updated_at = now()
  WHERE id = p_post_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION admin_delete_post IS 
'Soft deletes a post with a reason. Sets status to deleted, preserves all data.
Returns true on success, raises exception if post not found.';

-- ============================================================================
-- Verification Query
-- ============================================================================
/*
-- Test: Delete post with id 1
SELECT admin_delete_post(
  p_post_id := 1,
  p_reason := 'Vi phạm quy định đăng tin',
  p_admin_id := 1
);

-- Verify: Check post was deleted
SELECT id, title, status, deleted_reason, deleted_by, deleted_at
FROM posts 
WHERE id = 1;
*/

