-- Step 1: Drop the foreign key constraint
ALTER TABLE user_preferences DROP CONSTRAINT IF EXISTS fk_user;

-- Step 2: Change user_preferences.user_id from UUID to TEXT
ALTER TABLE user_preferences ALTER COLUMN user_id TYPE TEXT;

-- Step 3: Change users.id from UUID to TEXT  
ALTER TABLE users ALTER COLUMN id TYPE TEXT;

-- Step 4: Recreate the foreign key constraint
ALTER TABLE user_preferences 
    ADD CONSTRAINT fk_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE;
