-- ============================================================================
-- RLS Policy: Allow owners to read all their post images
-- Table: post_images
-- Operation: SELECT
-- Access: Authenticated - post owner can see their post images (any status)
-- Purpose: Allow owners to see images when editing their posts
-- ============================================================================

DROP POLICY IF EXISTS "post_images_select_own" ON public.post_images;

CREATE POLICY "post_images_select_own"
ON public.post_images
FOR SELECT
TO authenticated
USING (
  post_id IN (
    SELECT id FROM public.posts 
    WHERE created_by IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);
