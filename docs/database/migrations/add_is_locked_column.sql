-- Migration: Add is_locked column to profiles table
-- Purpose: Allow admin to lock/unlock users
-- Run this in Supabase Dashboard > SQL Editor

-- Step 1: Add new columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS locked_by BIGINT REFERENCES public.profiles(id);

-- Step 2: Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_locked 
ON public.profiles(is_locked) 
WHERE is_locked = TRUE;

-- Step 3: Add comment for documentation
COMMENT ON COLUMN public.profiles.is_locked IS 'Whether user is locked by admin. Locked users cannot create/edit/delete posts.';
COMMENT ON COLUMN public.profiles.locked_at IS 'Timestamp when user was locked';
COMMENT ON COLUMN public.profiles.locked_by IS 'Profile ID of admin who locked this user';

-- Verify
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('is_locked', 'locked_at', 'locked_by');
