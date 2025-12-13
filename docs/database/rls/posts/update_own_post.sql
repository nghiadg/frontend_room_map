-- ============================================================================
-- RLS Policy: Allow authenticated users to update their own posts
-- Table: posts
-- Operation: UPDATE
-- Access: Authenticated - owner can update their posts
-- Purpose: Edit post, toggle visibility, mark as rented, soft delete
-- ============================================================================

DROP POLICY IF EXISTS "posts_update_own" ON public.posts;

CREATE POLICY "posts_update_own"
ON public.posts
FOR UPDATE
TO authenticated
USING (
  created_by IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  created_by IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);
