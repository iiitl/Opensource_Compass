-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    github_username TEXT,
    experience_level TEXT,
    github_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id VARCHAR(255) PRIMARY KEY,
    user_id TEXT NOT NULL,
    preference_type VARCHAR(50) NOT NULL,
    value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dummy data for testing (optional - can be removed for production)
-- INSERT INTO user_preferences (id, user_id, preference_type, value) VALUES
-- ('550e8400-e29b-41d4-a716-446655440001', '73421387', 'language', 'go'),
-- ('550e8400-e29b-41d4-a716-446655440002', '73421387', 'language', 'python'),
-- ('550e8400-e29b-41d4-a716-446655440003', '73421387', 'domain', 'backend'),
-- ('550e8400-e29b-41d4-a716-446655440004', '73421387', 'domain', 'ai');
-- Create watched_repos table
CREATE TABLE IF NOT EXISTS watched_repos (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    repo_owner VARCHAR(255) NOT NULL,
    repo_name VARCHAR(255) NOT NULL,
    last_checked_at TIMESTAMP WITH TIME ZONE,
    latest_issue_number INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, repo_owner, repo_name)
);
