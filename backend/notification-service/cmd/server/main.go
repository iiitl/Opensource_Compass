package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"notification-service/internal/websocket"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8084" // Default port for notification service
	}

	hub := websocket.NewHub()
	go hub.Run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		websocket.ServeWs(hub, w, r)
	})

	// Internal endpoint to send specific notifications
	// POST /notify?user_id=123
	// Body: JSON payload
	http.HandleFunc("/notify", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Security check: Should be protected by some internal secret
		// secret := r.Header.Get("X-Internal-Secret")
		// if secret != os.Getenv("INTERNAL_SECRET") { ... }

		userID := r.URL.Query().Get("user_id")
		if userID == "" {
			http.Error(w, "user_id query param required", http.StatusBadRequest)
			return
		}

		var payload interface{}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, "Invalid body", http.StatusBadRequest)
			return
		}

		msgBytes, err := json.Marshal(payload)
		if err != nil {
			http.Error(w, "Failed to marshal payload", http.StatusInternalServerError)
			return
		}

		hub.SendToUser <- websocket.NotificationMessage{
			UserID:  userID,
			Message: msgBytes,
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Notification sent"))
	})

	log.Printf("Notification Service running on :%s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
