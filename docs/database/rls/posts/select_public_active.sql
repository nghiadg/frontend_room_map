-- ============================================================================
-- RLS Policy: Allow public read for active and rented posts
-- Table: posts
-- Operation: SELECT
-- Access: Public (anon + authenticated) - only active/rented posts
-- Purpose: Map view, post detail page for non-deleted posts
-- ============================================================================

DROP POLICY IF EXISTS "posts_select_public_active" ON public.posts;

CREATE POLICY "posts_select_public_active"
ON public.posts
FOR SELECT
TO public
USING (status IN ('active', 'rented'));
