/**
 * Browser Notification API wrapper.
 * Uses ServiceWorkerRegistration.showNotification() when available,
 * falls back to new Notification().
 */

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission !== 'default') return Notification.permission;
  return Notification.requestPermission();
}

export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

export interface BrowserNotificationPayload {
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  data?: Record<string, unknown>;
}

export async function showBrowserNotification(payload: BrowserNotificationPayload): Promise<void> {
  if (Notification.permission !== 'granted') return;

  const options: NotificationOptions = {
    body: payload.body,
    icon: payload.icon ?? '/icons/icon-192.png',
    tag: payload.tag,
    data: payload.data ?? {},
  };

  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg) {
      await reg.showNotification(payload.title, options);
      return;
    }
  } catch {
    // SW not available, fall through
  }

  new Notification(payload.title, options);
}
