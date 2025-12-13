-- ============================================================================
-- RLS Policy: Allow public read for post terms (active/rented posts only)
-- Table: post_terms
-- Operation: SELECT
-- Access: Public (anon + authenticated) - terms of active/rented posts
-- Purpose: Display terms on post detail pages
-- ============================================================================

DROP POLICY IF EXISTS "post_terms_select_public" ON public.post_terms;

CREATE POLICY "post_terms_select_public"
ON public.post_terms
FOR SELECT
TO public
USING (
  post_id IN (
    SELECT id FROM public.posts WHERE status IN ('active', 'rented')
  )
);
