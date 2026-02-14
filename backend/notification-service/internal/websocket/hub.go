package websocket

import (
	"log"
	"sync"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// UserID -> Client mapping for targeted notifications
	userClients map[string][]*Client

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	// Targeted notification channel
	SendToUser chan NotificationMessage

	mu sync.RWMutex
}

type NotificationMessage struct {
	UserID  string `json:"user_id"`
	Message []byte `json:"message"`
}

func NewHub() *Hub {
	return &Hub{
		broadcast:   make(chan []byte),
		register:    make(chan *Client),
		unregister:  make(chan *Client),
		clients:     make(map[*Client]bool),
		userClients: make(map[string][]*Client),
		SendToUser:  make(chan NotificationMessage),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.userClients[client.UserID] = append(h.userClients[client.UserID], client)
			log.Printf("Hub: Client registered. UserID: %s. Total clients for user: %d", client.UserID, len(h.userClients[client.UserID]))
			h.mu.Unlock()

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.Send)
				// Remove from userClients map
				clients := h.userClients[client.UserID]
				for i, c := range clients {
					if c == client {
						h.userClients[client.UserID] = append(clients[:i], clients[i+1:]...)
						break
					}
				}
				log.Printf("Hub: Client unregistered. UserID: %s. Remaining clients for user: %d", client.UserID, len(h.userClients[client.UserID]))
			}
			h.mu.Unlock()

		case message := <-h.broadcast:
			// Broadcast to everyone (maybe not needed for this feature but good to have)
			h.mu.RLock()
			for client := range h.clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.clients, client)
				}
			}
			h.mu.RUnlock()

		case notif := <-h.SendToUser:
			h.mu.RLock()
			if clients, ok := h.userClients[notif.UserID]; ok {
				log.Printf("Hub: Sending message to user %s (Clients: %d)", notif.UserID, len(clients))
				for _, client := range clients {
					select {
					case client.Send <- notif.Message:
						log.Printf("Hub: Sent to client %p", client)
					default:
						// Handle slow client?
						log.Printf("Hub: Failed to send to client %p (buffer full?)", client)
					}
				}
			} else {
				log.Printf("Hub: User %s not connected. Message dropped.", notif.UserID)
			}
			h.mu.RUnlock()
		}
	}
}
