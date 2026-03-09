-- Function to delete auth user when profile is deleted
CREATE OR REPLACE FUNCTION delete_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete the auth user (requires service_role privileges)
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-delete auth user when profile is deleted
CREATE TRIGGER on_profile_deleted
  AFTER DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION delete_auth_user();