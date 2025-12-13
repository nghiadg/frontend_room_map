-- ============================================================================
-- RLS Policy: Allow public read for property_types table
-- Table: property_types
-- Operation: SELECT
-- Access: Public (anon + authenticated)
-- ============================================================================

DROP POLICY IF EXISTS "property_types_select_public" ON public.property_types;

CREATE POLICY "property_types_select_public"
ON public.property_types
FOR SELECT
TO public
USING (true);
