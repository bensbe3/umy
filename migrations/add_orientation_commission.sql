-- Add 'orientation' as a valid commission_id for posts that appear only in News & Actualities (not on commission pages)
-- Run this migration in Supabase SQL Editor

-- Drop existing check constraint
ALTER TABLE commission_actualites DROP CONSTRAINT IF EXISTS commission_actualites_commission_id_check;

-- Add new check constraint including 'orientation'
ALTER TABLE commission_actualites ADD CONSTRAINT commission_actualites_commission_id_check
  CHECK (commission_id IN ('ir', 'mp', 'sd', 'orientation'));

-- RLS: Only super_admins with commissions_role = 'full' can manage orientation posts
-- The existing policy already handles this: users.commissions_role = 'full' OR users.commissions_role = commission_actualites.commission_id
-- For commission_id = 'orientation', only 'full' matches (no user has commissions_role = 'orientation')
