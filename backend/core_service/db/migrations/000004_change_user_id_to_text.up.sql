DO $$ 
BEGIN 
    -- Step 1: Drop constraint if exists
    ALTER TABLE user_preferences DROP CONSTRAINT IF EXISTS fk_user;

    -- Step 2: Change user_preferences.user_id type if not already TEXT
    IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'user_preferences' AND column_name = 'user_id' LIMIT 1) != 'text' THEN
        ALTER TABLE user_preferences ALTER COLUMN user_id TYPE TEXT;
    END IF;

    -- Step 3: Change users.id type if not already TEXT
    IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id' LIMIT 1) != 'text' THEN
        ALTER TABLE users ALTER COLUMN id TYPE TEXT;
    END IF;

    -- Step 4: Add constraint if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_user' LIMIT 1) THEN
        ALTER TABLE user_preferences 
            ADD CONSTRAINT fk_user 
            FOREIGN KEY (user_id) 
            REFERENCES users(id) 
            ON DELETE CASCADE;
    END IF;
END $$;
