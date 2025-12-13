-- ============================================================================
-- Database Migration: Add expires_at column for auto-expire posts
-- Purpose: Support auto-expire posts after 14 days
-- Usage: Copy entire file and paste into Supabase SQL Editor, then click Run
-- ============================================================================

-- Note: The 'status' column uses TEXT type, not enum.
-- The value 'expired' is just a string, no type modification needed.

-- Step 1: Add expires_at column
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Step 2: Set default value for new posts (14 days from now)
ALTER TABLE posts 
ALTER COLUMN expires_at SET DEFAULT (NOW() + INTERVAL '14 days');

-- Step 3: Backfill existing active posts with expires_at = created_at + 14 days
UPDATE posts 
SET expires_at = created_at + INTERVAL '14 days' 
WHERE expires_at IS NULL 
  AND status = 'active';

-- Step 4: For non-active posts, set expires_at to created_at + 14 days
UPDATE posts 
SET expires_at = created_at + INTERVAL '14 days'
WHERE expires_at IS NULL;

-- Step 5: Create index for efficient cron job queries
CREATE INDEX IF NOT EXISTS idx_posts_expires_at_active 
ON posts(expires_at) 
WHERE status = 'active';

-- ============================================================================
-- Verification Query (run after migration)
-- ============================================================================
/*
-- Check column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'posts' AND column_name = 'expires_at';

-- Check sample data
SELECT id, title, status, created_at, expires_at 
FROM posts 
ORDER BY created_at DESC 
LIMIT 5;
*/

