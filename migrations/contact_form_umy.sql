-- ============================================
-- UMY Contact/Application Form Migration
-- Adds new columns for UMY membership application
-- and updates status for candidate classification
-- ============================================

-- Add new columns to contact_submissions (nullable for backward compatibility)
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS cin_number TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS current_occupation TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS other_organization TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS political_party TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS commission_interest TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS commission_motivation TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS position_applying TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS active_membership_acknowledged BOOLEAN;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS previous_experiences TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS additional_info TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- Update status check to include new candidate statuses
-- First drop the existing check constraint
ALTER TABLE contact_submissions DROP CONSTRAINT IF EXISTS contact_submissions_status_check;

-- Add new check constraint with accepted, interesting, weak_candidate
ALTER TABLE contact_submissions ADD CONSTRAINT contact_submissions_status_check
  CHECK (status IN ('new', 'read', 'replied', 'archived', 'accepted', 'interesting', 'weak_candidate'));

-- Add UPDATE policy for super admins (if not exists)
DROP POLICY IF EXISTS "Super admins can update contact submissions" ON contact_submissions;
CREATE POLICY "Super admins can update contact submissions"
  ON contact_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
      AND (users.commissions_role = 'full' OR users.commissions_role IS NULL)
    )
  );
