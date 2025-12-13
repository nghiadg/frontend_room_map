-- ============================================================================
-- RLS Policy: Allow public read for provinces table
-- Table: provinces
-- Operation: SELECT
-- Access: Public (anon + authenticated)
-- ============================================================================

DROP POLICY IF EXISTS "provinces_select_public" ON public.provinces;

CREATE POLICY "provinces_select_public"
ON public.provinces
FOR SELECT
TO public
USING (true);
