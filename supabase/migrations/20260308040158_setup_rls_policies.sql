-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE views ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS POLICIES
-- ============================================

-- Anyone can view user profiles (public data)
CREATE POLICY "Users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can delete their own account
CREATE POLICY "Users can delete own account"
  ON users FOR DELETE
  USING (auth.uid() = id);

-- ============================================
-- POSTS POLICIES
-- ============================================

-- Anyone can view posts
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- LIKES POLICIES
-- ============================================

-- Anyone can view likes
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  USING (true);

-- Authenticated users can like posts
CREATE POLICY "Authenticated users can like posts"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unlike (delete their own likes)
CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- VIEWS POLICIES
-- ============================================

-- Anyone can view post views count
CREATE POLICY "Views are viewable by everyone"
  ON views FOR SELECT
  USING (true);

-- Authenticated users can track views
CREATE POLICY "Authenticated users can create views"
  ON views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FOLLOWS POLICIES
-- ============================================

-- Anyone can see who follows whom
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  USING (true);

-- Authenticated users can follow others
CREATE POLICY "Authenticated users can follow"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow (delete their own follows)
CREATE POLICY "Users can delete own follows"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================
-- MESSAGES POLICIES
-- ============================================

-- Users can view messages they sent or received
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = recipient_id
  );

-- Authenticated users can send messages
CREATE POLICY "Authenticated users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can delete messages they sent
CREATE POLICY "Users can delete own sent messages"
  ON messages FOR DELETE
  USING (auth.uid() = sender_id);

-- Users can update messages they sent
CREATE POLICY "Users can update own sent messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id);