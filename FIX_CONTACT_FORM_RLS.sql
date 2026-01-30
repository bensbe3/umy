-- ============================================
-- FIX CONTACT FORM RLS - Allow Anonymous Inserts
-- ============================================
-- This ensures anyone can submit the contact form without authentication

-- Drop all existing policies on contact_submissions
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Public can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Anonymous can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Super admins with full access can view contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON contact_submissions;

-- Allow ANYONE (including anonymous users) to INSERT
-- 'TO public' includes both authenticated and anonymous users
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow super admins to view all submissions
CREATE POLICY "Super admins can view contact submissions"
  ON contact_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
      AND (users.commissions_role = 'full' OR users.commissions_role IS NULL)
    )
  );

-- Verify the table exists and RLS is enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'contact_submissions'
  ) THEN
    RAISE EXCEPTION 'Table contact_submissions does not exist. Please run setup-supabase.sql first.';
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Display current policies (for verification)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'contact_submissions';
