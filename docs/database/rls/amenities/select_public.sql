-- ============================================================================
-- RLS Policy: Allow public read for amenities table
-- Table: amenities
-- Operation: SELECT
-- Access: Public (anon + authenticated)
-- ============================================================================

DROP POLICY IF EXISTS "amenities_select_public" ON public.amenities;

CREATE POLICY "amenities_select_public"
ON public.amenities
FOR SELECT
TO public
USING (true);
