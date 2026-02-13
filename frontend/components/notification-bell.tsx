"use client";

import { useNotifications } from "@/contexts/notification-context";
import { Bell } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead, isConnected } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside (simplified for now)
  
  return (
    <div className="relative">
      <button
        onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen && unreadCount > 0) markAllAsRead();
        }}
        className="relative p-2 text-[#8b949e] hover:text-[#c9d1d9] transition-colors rounded-md hover:bg-[#161b22]"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f78166] rounded-full border border-[#0d1117]" />
        )}
        {isConnected && (
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-[#238636] rounded-full border border-[#0d1117]" title="Connected" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-[#30363d] flex justify-between items-center">
              <h3 className="font-semibold text-sm text-[#c9d1d9]">Notifications</h3>
              <button 
                onClick={markAllAsRead}
                className="text-xs text-[#58a6ff] hover:underline"
              >
                Mark all read
              </button>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#8b949e] text-sm">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y divide-[#30363d]">
                  {notifications.map((n, i) => (
                    <div key={i} className="p-3 hover:bg-[#0d1117] transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="textxs font-medium text-[#c9d1d9]">{n.repo}</span>
                        <span className="text-[10px] text-[#8b949e]">
                            {new Date(n.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-[#8b949e]">{n.message}</p>
                      {n.type === 'new_issue' && (
                          <a href={`https://github.com/${n.repo}/issues/${n.issue_number}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#58a6ff] mt-1 block hover:underline">
                              View Issue #{n.issue_number}
                          </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
