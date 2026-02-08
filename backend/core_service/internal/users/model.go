package users

import "time"

type User struct {
	ID              string
	GitHubUsername  string
	ExperienceLevel string
	GitHubToken     string
	CreatedAt       time.Time
}
