-- ============================================================================
-- RLS Policy: Allow public read for terms table
-- Table: terms
-- Operation: SELECT
-- Access: Public (anon + authenticated)
-- ============================================================================

DROP POLICY IF EXISTS "terms_select_public" ON public.terms;

CREATE POLICY "terms_select_public"
ON public.terms
FOR SELECT
TO public
USING (true);
