-- ============================================================================
-- RLS Policy: Allow owners to read all their own posts (any status)
-- Table: posts
-- Operation: SELECT
-- Access: Authenticated - post owner can see all their posts including hidden
-- Purpose: My Posts page where owners can see hidden/rented posts
-- ============================================================================

DROP POLICY IF EXISTS "posts_select_own_all" ON public.posts;

CREATE POLICY "posts_select_own_all"
ON public.posts
FOR SELECT
TO authenticated
USING (
  created_by IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);
