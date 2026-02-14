package users

import "time"

type User struct {
	ID              string
	GitHubUsername  string
	Email           string
	ExperienceLevel string
	GitHubToken     string
	CreatedAt       time.Time
}
