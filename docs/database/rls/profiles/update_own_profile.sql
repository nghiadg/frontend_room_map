-- ============================================================================
-- RLS Policy: Allow users to update their own profile
-- Table: profiles
-- Operation: UPDATE
-- Access: Authenticated users can update their own profile
-- ============================================================================

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
