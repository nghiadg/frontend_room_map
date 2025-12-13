-- ============================================================================
-- RLS Policy: Allow owners to read all their post amenities
-- Table: post_amenities
-- Operation: SELECT
-- Access: Authenticated - post owner can see their post amenities (any status)
-- Purpose: Allow owners to see amenities when editing their posts
-- ============================================================================

DROP POLICY IF EXISTS "post_amenities_select_own" ON public.post_amenities;

CREATE POLICY "post_amenities_select_own"
ON public.post_amenities
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
