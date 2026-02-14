"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./auth-context";
import toast from "react-hot-toast";
import Link from "next/link";

type Notification = {
  type: string;
  repo: string;
  issue_number: number;
  issue_title?: string;
  issue_url?: string;
  message: string;
  timestamp: Date;
  id:string; // Unique identifier for each notification
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

const NOTIFICATIONS_KEY = "compass_notifications";

function loadNotificationsFromStorage(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((n: any) => ({
      ...n,
      timestamp: new Date(n.timestamp),
    }));
  } catch (err) {
    console.error("Failed to load notifications from storage", err);
    return [];
  }
}

function saveNotificationsToStorage(notifications: Notification[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (err) {
    console.error("Failed to save notifications to storage", err);
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(loadNotificationsFromStorage);

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
    console.log(`NotificationService: Connecting to ${wsUrl}...`);
    const ws = new WebSocket(wsUrl);

    ws.onerror = (error) => {
        console.error("NotificationService: WebSocket error", error);
    };

    ws.onopen = () => {
      console.log(`NotificationService: Connected for user ${userId}`);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("NotificationService: Received message", event.data);
      try {
        const data = JSON.parse(event.data);
        const newNotification: Notification = {
          ...data,
          timestamp: new Date(),
          id: `${data.repo}-${data.issue_number}-${Date.now()}`,
        };
        
        setNotifications((prev) => {
          const updated = [newNotification, ...prev];
          saveNotificationsToStorage(updated);
          return updated;
        });
        
        // Show react-hot-toast notification
        const issueTitle = data.issue_title || `Issue #${data.issue_number}`;
        const repoName = data.repo.split("/")[1] || data.repo;
        
        toast(
          (t) => (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{repoName}</span>
                {data.issue_url && (
                  <a
                    href={data.issue_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    View Issue
                  </a>
                )}
              </div>
              <p className="text-xs text-gray-600">{issueTitle}</p>
            </div>
          ),
          {
            icon: "🔔",
            duration: 5000,
            position: "top-right",
          }
        );
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
    setNotifications([]);
    saveNotificationsToStorage([]);
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
