-- ============================================================================
-- Supabase JWT Custom Claims: User Role
-- Purpose: Add user role to JWT token to avoid DB query on every protected route
-- Usage: Copy entire file and paste into Supabase SQL Editor, then click Run
-- 
-- After running this SQL, enable the hook in Supabase Dashboard:
-- Authentication → Hooks → Add hook → PostgreSQL Function → custom_access_token_hook
-- ============================================================================

-- Step 1: Create the function that will inject custom claims into JWT
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claims jsonb;
  user_role text;
  user_profile_id bigint;
BEGIN
  -- Get the current claims from the event
  claims := event->'claims';

  -- Fetch user role from profiles table
  SELECT 
    p.id,
    r.name
  INTO user_profile_id, user_role
  FROM profiles p
  LEFT JOIN roles r ON p.role_id = r.id
  WHERE p.user_id = (event->>'user_id')::uuid
  LIMIT 1;

  -- Add custom claims to the JWT
  -- These will be available in the decoded token
  claims := jsonb_set(claims, '{user_role}', to_jsonb(COALESCE(user_role, 'renter')));
  claims := jsonb_set(claims, '{profile_id}', to_jsonb(user_profile_id));

  -- Update the event with modified claims
  event := jsonb_set(event, '{claims}', claims);

  RETURN event;
END;
$$;

-- Step 2: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;

-- Step 3: Revoke public access for security
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM anon;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.custom_access_token_hook IS 
'Injects user_role and profile_id into JWT access token.
This eliminates the need to query profiles table on every protected route request.
Enable in: Supabase Dashboard → Authentication → Hooks → PostgreSQL Function';

-- ============================================================================
-- After running this SQL, configure the hook in Supabase Dashboard:
-- 
-- 1. Go to: Authentication → Hooks
-- 2. Click "Add hook"
-- 3. Select hook type: "Customize Access Token (JWT)"
-- 4. Select the function: custom_access_token_hook
-- 5. Click "Create hook"
--
-- Test by logging in and checking the JWT at jwt.io
-- You should see user_role and profile_id in the claims
-- ============================================================================
