-- ============================================================================
-- RLS Policy: Allow owners to read all their post terms
-- Table: post_terms
-- Operation: SELECT
-- Access: Authenticated - post owner can see their post terms (any status)
-- Purpose: Allow owners to see terms when editing their posts
-- ============================================================================

DROP POLICY IF EXISTS "post_terms_select_own" ON public.post_terms;

CREATE POLICY "post_terms_select_own"
ON public.post_terms
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
