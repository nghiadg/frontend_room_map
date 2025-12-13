-- ============================================================================
-- Enable Row Level Security for all tables
-- Purpose: Enable RLS on all tables before adding policies
-- Usage: Run this file FIRST before any other RLS policy files
-- ============================================================================

-- Lookup tables (read-only)
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Main tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Junction tables
ALTER TABLE public.post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_terms ENABLE ROW LEVEL SECURITY;
