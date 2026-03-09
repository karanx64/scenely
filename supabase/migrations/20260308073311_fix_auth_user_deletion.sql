-- Drop the old trigger and function if they exist
DROP TRIGGER IF EXISTS on_profile_deleted ON users;
DROP FUNCTION IF EXISTS delete_auth_user();

-- Create function with proper permissions to delete from auth schema
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete from auth.users (this runs with elevated privileges)
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.handle_user_delete() TO authenticated;

-- Create trigger
CREATE TRIGGER on_user_profile_deleted
  BEFORE DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_delete();

-- Also ensure the service_role can execute this
GRANT EXECUTE ON FUNCTION public.handle_user_delete() TO service_role;