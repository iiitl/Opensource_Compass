package watchlist

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type NotificationServiceNotifier struct {
	ServiceURL string
}

func NewNotifier(serviceURL string) *NotificationServiceNotifier {
	return &NotificationServiceNotifier{
		ServiceURL: serviceURL,
	}
}

func (n *NotificationServiceNotifier) NotifyUser(userID string, payload interface{}) error {
	url := fmt.Sprintf("%s/notify?user_id=%s", n.ServiceURL, userID)

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal notification payload: %w", err)
	}

	log.Printf("Notifier: Sending notification to %s with payload: %s", url, string(body))
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return fmt.Errorf("failed to send notification: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Notifier: Failed to send notification. Status: %d", resp.StatusCode)
		return fmt.Errorf("notification service returned non-200 status: %d", resp.StatusCode)
	}

	log.Println("Notifier: Notification sent successfully")
	return nil
}
