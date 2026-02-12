"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./auth-context";

type Notification = {
  type: string;
  repo: string;
  issue_number: number;
  message: string;
  timestamp: Date;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
  isConnected: boolean;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAllAsRead: () => {},
  isConnected: false,
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) {
        if (socket) {
            socket.close();
            setSocket(null);
        }
        return;
    }

    // Connect to Notification Service
    // Ensure we use the correct ID field. The User type in auth-context typically has 'id'.
    // Assuming auth-context exposes user.id. 
    // If not, we need to check auth-context. 
    // For now, let's assume user object has an ID or we use username if ID is missing (but database uses ID).
    
    // In auth-context.tsx, User type usually has login/name but maybe not database ID if it comes from GitHub directly.
    // However, our backend uses the user_id from the token (which is usually the github ID).
    // Let's rely on what's available. 
    
    // Actually, looking at previous steps, the user object in auth-context seems to come from /auth/me or similar.
    // Let's try to connect with user.id.
    
    const userId = (user as any).id || (user as any).login;

    if (!userId) return;

    const wsUrl = `ws://localhost:8084/ws?user_id=${userId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to notification service");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newNotification: Notification = {
          ...data,
          timestamp: new Date(),
        };
        setNotifications((prev) => [newNotification, ...prev]);
        
        // Show browser toast/notification if supported
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`New Update in ${data.repo}`, {
                body: data.message,
            });
        }
      } catch (err) {
        console.error("Failed to parse notification", err);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from notification service");
      setIsConnected(false);
      // Reconnect logic could go here
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [user]);

  const markAllAsRead = () => {
    // In a real app, we might send an API call to mark as read in DB.
    // For MVP, just clearing local state or marking visually.
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.length,
        markAllAsRead,
        isConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
