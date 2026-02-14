package watchlist

import (
	"context"
	"core-service/internal/users"
	"fmt"
	"log"
	"os"
	"strconv"

	"gopkg.in/gomail.v2"
)

// EmailNotifier sends email notifications
type EmailNotifier struct {
	userRepo *users.Repository
	smtpHost string
	smtpPort int
	smtpUser string
	smtpPass string
	fromAddr string
}

// NewEmailNotifier creates a new email notifier
func NewEmailNotifier(userRepo *users.Repository) *EmailNotifier {
	port, _ := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if port == 0 {
		port = 587 // default SMTP port
	}

	fromAddr := os.Getenv("SMTP_FROM")
	if fromAddr == "" {
		fromAddr = os.Getenv("SMTP_USER")
	}

	return &EmailNotifier{
		userRepo: userRepo,
		smtpHost: os.Getenv("SMTP_HOST"),
		smtpPort: port,
		smtpUser: os.Getenv("SMTP_USER"),
		smtpPass: os.Getenv("SMTP_PASSWORD"),
		fromAddr: fromAddr,
	}
}

// NotifyUser sends an email notification to the user
func (e *EmailNotifier) NotifyUser(userID string, payload interface{}) error {
	log.Printf("EmailNotifier: NotifyUser called for userID: %s", userID)

	// Skip if SMTP not configured
	if e.smtpHost == "" || e.smtpUser == "" || e.smtpPass == "" {
		log.Printf("EmailNotifier: SMTP not configured (Host: %s, User: %s, Pass set: %v), skipping email notification",
			e.smtpHost, e.smtpUser, e.smtpPass != "")
		return nil
	}

	// Get user email
	user, err := e.userRepo.GetByID(context.Background(), userID)
	if err != nil {
		log.Printf("EmailNotifier: Failed to get user %s: %v", userID, err)
		return fmt.Errorf("failed to get user: %w", err)
	}

	if user.Email == "" {
		log.Printf("EmailNotifier: No email found for user %s (GitHub: %s), skipping", userID, user.GitHubUsername)
		return nil
	}

	log.Printf("EmailNotifier: Found email %s for user %s", user.Email, userID)

	// Parse payload
	data, ok := payload.(map[string]interface{})
	if !ok {
		log.Printf("EmailNotifier: Invalid payload type for user %s", userID)
		return fmt.Errorf("invalid payload type")
	}

	repo, _ := data["repo"].(string)
	issueNumber, _ := data["issue_number"].(int)
	issueTitle, _ := data["issue_title"].(string)
	issueURL, _ := data["issue_url"].(string)

	log.Printf("EmailNotifier: Preparing email for issue #%d in %s", issueNumber, repo)

	// Create email
	m := gomail.NewMessage()
	m.SetHeader("From", e.fromAddr)
	m.SetHeader("To", user.Email)
	m.SetHeader("Subject", fmt.Sprintf("New Issue in %s", repo))

	htmlBody := e.generateHTML(repo, issueNumber, issueTitle, issueURL)
	m.SetBody("text/html", htmlBody)

	// Send email
	log.Printf("EmailNotifier: Dialing SMTP server %s:%d...", e.smtpHost, e.smtpPort)
	d := gomail.NewDialer(e.smtpHost, e.smtpPort, e.smtpUser, e.smtpPass)
	if err := d.DialAndSend(m); err != nil {
		log.Printf("EmailNotifier: Failed to send email to %s: %v", user.Email, err)
		return fmt.Errorf("failed to send email: %w", err)
	}

	log.Printf("EmailNotifier: Email sent successfully to %s for issue #%d in %s", user.Email, issueNumber, repo)
	return nil
}

func (e *EmailNotifier) generateHTML(repo string, issueNumber int, issueTitle, issueURL string) string {
	title := issueTitle
	if title == "" {
		title = fmt.Sprintf("Issue #%d", issueNumber)
	}

	return fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f7f9fc; padding: 30px; border-radius: 0 0 10px 10px; }
        .issue-title { font-size: 20px; font-weight: 600; color: #333; margin: 20px 0; }
        .repo-name { font-size: 14px; opacity: 0.9; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .button:hover { background: #5568d3; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">🔔 New Issue Detected</h1>
            <p class="repo-name" style="margin: 10px 0 0 0;">%s</p>
        </div>
        <div class="content">
            <p>A new issue has been created in one of your watched repositories:</p>
            <div class="issue-title">%s</div>
            <a href="%s" class="button">View Issue on GitHub</a>
            <div class="footer">
                <p>You're receiving this because you're watching this repository on Open Source Compass.</p>
            </div>
        </div>
    </div>
</body>
</html>
`, repo, title, issueURL)
}
