-- Migration: Add role and status columns to profiles
-- For Supabase Cloud, we use triggers to sync with auth.users.raw_app_meta_data
-- The role/status will be embedded in JWT via app_metadata

-- Add role column to profiles if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'talent' CHECK (role IN ('startup', 'talent'));

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- Comments
COMMENT ON COLUMN profiles.role IS 'User role: startup or talent. Determines which dashboard they can access.';
COMMENT ON COLUMN profiles.status IS 'User status: in_review, accepted, rejected. Only accepted users have full platform access.';

-- ============================================================================
-- IMPORTANT: For Supabase Cloud, you need to manually set app_metadata
-- ============================================================================
-- 
-- Option 1: Use Supabase Dashboard
-- Go to Authentication → Users → Select user → Edit "App Metadata"
-- Add: { "role": "startup", "status": "accepted" }
--
-- Option 2: Use SQL with service_role key (run in Supabase SQL Editor)
-- UPDATE auth.users 
-- SET raw_app_meta_data = raw_app_meta_data || '{"role": "startup", "status": "accepted"}'::jsonb
-- WHERE id = 'user-uuid';
--
-- Option 3: Use Supabase Admin API (in a server-side script)
-- const supabase = createClient(url, serviceRoleKey)
-- await supabase.auth.admin.updateUserById(userId, {
--   app_metadata: { role: 'startup', status: 'accepted' }
-- })
--
-- ============================================================================
-- For automatic sync, create a trigger that calls a Supabase Edge Function
-- or use the following approach with a webhook:
-- ============================================================================

-- Trigger function to notify when profile changes
-- (You'll need to call the Admin API from your application code)
CREATE OR REPLACE FUNCTION handle_profile_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- This trigger can be used to notify your application
  -- to update the user's app_metadata via Admin API
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS on_profile_change ON profiles;
CREATE TRIGGER on_profile_change
AFTER UPDATE OF role, status ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_profile_role_change();
