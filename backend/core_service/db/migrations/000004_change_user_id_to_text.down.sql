-- Step 1: Drop the foreign key constraint
ALTER TABLE user_preferences DROP CONSTRAINT IF EXISTS fk_user;

-- Step 2: Change users.id back to UUID
ALTER TABLE users ALTER COLUMN id TYPE UUID USING id::UUID;

-- Step 3: Change user_preferences.user_id back to UUID
ALTER TABLE user_preferences ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Step 4: Recreate the foreign key constraint
ALTER TABLE user_preferences 
    ADD CONSTRAINT fk_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE;
