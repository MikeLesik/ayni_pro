import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { showBrowserNotification } from '@/services/browserNotificationService';
import { useUiStore } from '@/stores/uiStore';

export type NotificationType =
  | 'marketplace_reserved'
  | 'marketplace_completed'
  | 'marketplace_expired'
  | 'marketplace_purchased'
  | 'listing_created'
  | 'listing_cancelled'
  | 'participation_created'
  | 'position_cancelled'
  | 'position_activated'
  | 'reinvest_completed'
  | 'withdraw_completed'
  | 'reward_credited'
  | 'welcome'
  | 'system'
  | 'daily_earnings_summary'
  | 'streak_milestone'
  | 'price_alert';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  /** i18n interpolation params (amount, etc.) */
  params?: Record<string, string | number>;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: AppNotification[];
  /** Add a new notification */
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  /** Mark a single notification as read */
  markAsRead: (id: string) => void;
  /** Mark all notifications as read */
  markAllAsRead: () => void;
  /** Remove a single notification */
  removeNotification: (id: string) => void;
  /** Clear all notifications */
  clearAll: () => void;
}

let counter = 0;

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],

      addNotification: (n) => {
        set((state) => ({
          notifications: [
            {
              ...n,
              id: `notif-${Date.now()}-${++counter}`,
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        }));

        if (useUiStore.getState().browserNotificationsEnabled) {
          showBrowserNotification({
            title: 'AYNI',
            body: n.message || n.type.replace(/_/g, ' '),
            tag: n.type,
            data: { url: '/notifications' },
          });
        }
      },

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: 'ayni-notifications',
      partialize: (state) => ({ notifications: state.notifications }),
    },
  ),
);

/** Selector: count of unread notifications */
export const useUnreadCount = () =>
  useNotificationStore((s) => s.notifications.filter((n) => !n.read).length);
