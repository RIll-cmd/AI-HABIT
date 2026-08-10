import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationCategory = "ALL" | "AIRA BRIEFINGS" | "WORKOUTS" | "HABITS" | "TOWER / SYSTEM";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  message: string;
  timestamp: number;
  isRead: boolean;
}

interface NotificationStore {
  notifications: AppNotification[];
  addNotification: (category: NotificationCategory, message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearLogs: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      addNotification: (category, message) => {
        const newNotification: AppNotification = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          category,
          message,
          timestamp: Date.now(),
          isRead: false,
        };
        
        set((state) => ({
          // Keep the latest 100 notifications to prevent storage bloat
          notifications: [newNotification, ...state.notifications].slice(0, 100),
        }));
      },
      
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),
        
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),
        
      clearLogs: () => set({ notifications: [] }),
      
      getUnreadCount: () => get().notifications.filter((n) => !n.isRead).length,
    }),
    {
      name: "ascend-notifications-storage",
    }
  )
);
