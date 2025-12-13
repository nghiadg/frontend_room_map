-- ============================================================================
-- RLS Policy: Allow public read for post amenities (active/rented posts only)
-- Table: post_amenities
-- Operation: SELECT
-- Access: Public (anon + authenticated) - amenities of active/rented posts
-- Purpose: Display amenities on post detail pages
-- ============================================================================

DROP POLICY IF EXISTS "post_amenities_select_public" ON public.post_amenities;

CREATE POLICY "post_amenities_select_public"
ON public.post_amenities
FOR SELECT
TO public
USING (
  post_id IN (
    SELECT id FROM public.posts WHERE status IN ('active', 'rented')
  )
);
