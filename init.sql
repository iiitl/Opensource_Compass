CREATE TABLE IF NOT EXISTS user_preferences (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    preference_type VARCHAR(50) NOT NULL,
    value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dummy data for testing
-- User ID "7.3421387e+07" matches the token provided by the user
INSERT INTO user_preferences (id, user_id, preference_type, value) VALUES
('1', '7.3421387e+07', 'language', 'go'),
('2', '7.3421387e+07', 'language', 'python'),
('3', '7.3421387e+07', 'domain', 'backend'),
('4', '7.3421387e+07', 'domain', 'ai');
