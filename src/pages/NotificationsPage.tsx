import { Bell } from 'lucide-react';
import { AnimatedPage } from '@/components/ui/AnimatedPage';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNotificationStore, useUnreadCount } from '@/stores/notificationStore';
import {
  typeMessageKey,
  getNotifIcon,
  getNotifColor,
  formatTimeAgo,
} from '@/components/ui/NotificationPanel';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/cn';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const unreadCount = useUnreadCount();

  return (
    <AnimatedPage className="flex flex-col gap-3 max-w-[720px] mx-auto">
      {/* Header */}
      <div className="pt-1 md:pt-6 flex items-center justify-between">
        <h1 className="font-display text-xl md:text-2xl text-text-primary">
          {t('notifications.title')}
          {unreadCount > 0 && (
            <span className="ml-2 text-base font-medium text-text-muted">({unreadCount})</span>
          )}
        </h1>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              {t('notifications.markAllRead')}
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              {t('notifications.clearAll')}
            </Button>
          )}
        </div>
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <EmptyState
          illustration={<Bell size={48} className="text-text-muted" />}
          title={t('notifications.empty')}
        />
      ) : (
        <ul className="rounded-xl border border-border-light bg-surface-card overflow-hidden">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={cn(
                'flex items-start gap-3 px-4 py-3',
                'border-b border-border-light last:border-b-0',
                'transition-colors',
                !notif.read && 'bg-primary/[0.04]',
              )}
            >
              <div
                className={cn(
                  'shrink-0 mt-0.5 flex items-center justify-center',
                  'w-8 h-8 rounded-full',
                  getNotifColor(notif.type),
                )}
              >
                {getNotifIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] leading-snug text-text-primary">
                  {t(typeMessageKey[notif.type] as Parameters<typeof t>[0], notif.params)}
                </p>
                <span className="text-xs text-text-muted mt-0.5 block">
                  {formatTimeAgo(notif.createdAt)}
                </span>
              </div>

              {!notif.read && (
                <button
                  type="button"
                  onClick={() => markAsRead(notif.id)}
                  className="shrink-0 mt-1.5 h-2 w-2 rounded-full bg-primary hover:bg-primary-dark transition-colors"
                  aria-label={t('notifications.markRead')}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </AnimatedPage>
  );
}
