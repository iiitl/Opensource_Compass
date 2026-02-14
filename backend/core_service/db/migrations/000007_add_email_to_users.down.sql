-- Remove email column from users table
ALTER TABLE users DROP COLUMN IF EXISTS email;

-- Drop index
DROP INDEX IF EXISTS idx_users_email;
