-- ============================================================================
-- RLS Policy: Allow users to read their own profile
-- Table: profiles
-- Operation: SELECT
-- Access: Authenticated users can read their own profile
-- ============================================================================

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;

CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
