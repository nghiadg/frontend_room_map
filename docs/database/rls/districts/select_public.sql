-- ============================================================================
-- RLS Policy: Allow public read for districts table
-- Table: districts
-- Operation: SELECT
-- Access: Public (anon + authenticated)
-- ============================================================================

DROP POLICY IF EXISTS "districts_select_public" ON public.districts;

CREATE POLICY "districts_select_public"
ON public.districts
FOR SELECT
TO public
USING (true);
