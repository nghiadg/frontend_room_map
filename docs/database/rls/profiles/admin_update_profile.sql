-- ============================================================================
-- RLS Policy: Allow admin to update any profile
-- Table: profiles
-- Operation: UPDATE
-- Access: Admin users can update any profile (for lock/unlock feature)
-- ============================================================================

-- Uses JWT custom claims (user_role) to avoid infinite recursion
-- JWT claims are set by custom_access_token_hook function
-- The hook sets user_role directly in claims (not in user_metadata)

DROP POLICY IF EXISTS "profiles_admin_update" ON public.profiles;

CREATE POLICY "profiles_admin_update"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  -- Check user_role from JWT claims (set by custom_access_token_hook)
  (auth.jwt() ->> 'user_role') = 'admin'
)
WITH CHECK (
  (auth.jwt() ->> 'user_role') = 'admin'
);

-- ============================================================================
-- Verification: Check policies on profiles table
-- ============================================================================
/*
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles';
*/
