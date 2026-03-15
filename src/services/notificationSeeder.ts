import { useNotificationStore } from '@/stores/notificationStore';

const SEEDED_KEY = 'ayni-notifications-seeded';

/**
 * Seeds initial demo notifications on first app load.
 * Runs once — subsequent loads skip via localStorage flag.
 */
export function seedNotifications(): void {
  if (localStorage.getItem(SEEDED_KEY)) return;

  const { addNotification } = useNotificationStore.getState();

  // Seed in reverse chronological order (oldest first, since addNotification prepends)
  addNotification({
    type: 'welcome',
    message: '',
  });

  // Simulate a past reward
  addNotification({
    type: 'reward_credited',
    message: '',
    params: { amount: '0.0042' },
  });

  // System announcement
  addNotification({
    type: 'system',
    message: '',
    params: { message: 'AYNI Marketplace is live — trade positions peer-to-peer.' },
  });

  localStorage.setItem(SEEDED_KEY, '1');
}
