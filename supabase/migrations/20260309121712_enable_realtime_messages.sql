-- Enable Realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Ensure RLS is enabled (should already be, but just in case)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;