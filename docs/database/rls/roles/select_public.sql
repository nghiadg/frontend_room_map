-- ============================================================================
-- RLS Policy: Allow public read for roles table
-- Table: roles
-- Operation: SELECT
-- Access: Public (anon + authenticated)
-- ============================================================================

DROP POLICY IF EXISTS "roles_select_public" ON public.roles;

CREATE POLICY "roles_select_public"
ON public.roles
FOR SELECT
TO public
USING (true);
