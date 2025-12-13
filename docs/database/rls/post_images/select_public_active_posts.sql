-- ============================================================================
-- RLS Policy: Allow public read for post images (active/rented posts only)
-- Table: post_images
-- Operation: SELECT
-- Access: Public (anon + authenticated) - images of active/rented posts
-- Purpose: Display images on map and post detail pages
-- ============================================================================

DROP POLICY IF EXISTS "post_images_select_public" ON public.post_images;

CREATE POLICY "post_images_select_public"
ON public.post_images
FOR SELECT
TO public
USING (
  post_id IN (
    SELECT id FROM public.posts WHERE status IN ('active', 'rented')
  )
);
