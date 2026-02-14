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
