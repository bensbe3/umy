-- Add type column to distinguish general contacts vs membership applications
ALTER TABLE contact_submissions
ADD COLUMN IF NOT EXISTS type TEXT
  DEFAULT 'application'
  CHECK (type IN ('application', 'contact'));

CREATE INDEX IF NOT EXISTS idx_contact_type ON contact_submissions(type);

