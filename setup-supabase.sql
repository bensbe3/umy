-- ============================================
-- Quick Setup: Supabase Database Schema
-- Simple Users Table (synced with auth.users)
-- ============================================

-- ============================================
-- 1. Users Table (synced with auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  role TEXT NOT NULL CHECK (role IN ('editor', 'super_admin')),
  commissions_role TEXT CHECK (commissions_role IN ('ir', 'mp', 'sd', 'full')),
  UNIQUE(id)
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_commissions_role ON users(commissions_role);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Super admins can manage all users" ON users;

CREATE POLICY "Users can read their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Allow users to create their own profile (first-time setup)
CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Super admins can manage all users"
  ON users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
      AND (users.commissions_role = 'full' OR users.commissions_role IS NULL)
    )
  );

-- ============================================
-- 2. DecryptMundi Articles
-- ============================================
CREATE TABLE IF NOT EXISTS decryptmundi_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decryptmundi_status ON decryptmundi_articles(status);
CREATE INDEX IF NOT EXISTS idx_decryptmundi_published ON decryptmundi_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_decryptmundi_slug ON decryptmundi_articles(slug);
CREATE INDEX IF NOT EXISTS idx_decryptmundi_author ON decryptmundi_articles(author_id);

ALTER TABLE decryptmundi_articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read published articles" ON decryptmundi_articles;
DROP POLICY IF EXISTS "Editors can create articles" ON decryptmundi_articles;
DROP POLICY IF EXISTS "Authors can update their own articles, super admins can update all" ON decryptmundi_articles;
DROP POLICY IF EXISTS "Authors can delete their own articles, super admins can delete all" ON decryptmundi_articles;

CREATE POLICY "Public can read published articles"
  ON decryptmundi_articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Editors can create articles"
  ON decryptmundi_articles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'editor'
    )
  );

CREATE POLICY "Authors can update their own articles, super admins can update all"
  ON decryptmundi_articles FOR UPDATE
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
      AND (users.commissions_role = 'full' OR users.commissions_role IS NULL)
    )
  );

CREATE POLICY "Authors can delete their own articles, super admins can delete all"
  ON decryptmundi_articles FOR DELETE
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
      AND (users.commissions_role = 'full' OR users.commissions_role IS NULL)
    )
  );

-- ============================================
-- 3. Commission Actualités
-- ============================================
CREATE TABLE IF NOT EXISTS commission_actualites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id TEXT NOT NULL CHECK (commission_id IN ('ir', 'mp', 'sd')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_actualites_commission ON commission_actualites(commission_id);
CREATE INDEX IF NOT EXISTS idx_actualites_status ON commission_actualites(status);
CREATE INDEX IF NOT EXISTS idx_actualites_published ON commission_actualites(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_actualites_author ON commission_actualites(author_id);

ALTER TABLE commission_actualites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read published actualites" ON commission_actualites;
DROP POLICY IF EXISTS "Super admins can manage actualites based on commissions_role" ON commission_actualites;

CREATE POLICY "Public can read published actualites"
  ON commission_actualites FOR SELECT
  USING (status = 'published');

CREATE POLICY "Super admins can manage actualites based on commissions_role"
  ON commission_actualites FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
      AND (
        users.commissions_role = 'full' OR
        users.commissions_role = commission_actualites.commission_id
      )
    )
  );

-- ============================================
-- 4. Contact Form Submissions
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  interest TEXT,
  organization TEXT,
  linkedin TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at DESC);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Super admins with full access can view contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON contact_submissions;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Super admins with full access can view contact submissions"
  ON contact_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
      AND users.commissions_role = 'full'
    )
  );

-- ============================================
-- 5. Update Triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_decryptmundi_updated_at
  BEFORE UPDATE ON decryptmundi_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actualites_updated_at
  BEFORE UPDATE ON commission_actualites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
