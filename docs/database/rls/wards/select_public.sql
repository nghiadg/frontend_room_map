-- ============================================================================
-- RLS Policy: Allow public read for wards table
-- Table: wards
-- Operation: SELECT
-- Access: Public (anon + authenticated)
-- ============================================================================

DROP POLICY IF EXISTS "wards_select_public" ON public.wards;

CREATE POLICY "wards_select_public"
ON public.wards
FOR SELECT
TO public
USING (true);
