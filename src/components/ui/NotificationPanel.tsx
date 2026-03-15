import { useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import {
  Store,
  X,
  Check,
  Plus,
  XCircle,
  Coins,
  ArrowDownToLine,
  Gift,
  Sparkles,
  Info,
  Bell,
} from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useNotificationStore, type NotificationType } from '@/stores/notificationStore';

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

/** Translation key for each notification type */
const typeMessageKey: Record<NotificationType, string> = {
  marketplace_reserved: 'notifications.marketplace_reserved',
  marketplace_completed: 'notifications.marketplace_completed',
  marketplace_expired: 'notifications.marketplace_expired',
  marketplace_purchased: 'notifications.marketplace_purchased',
  listing_created: 'notifications.listing_created',
  listing_cancelled: 'notifications.listing_cancelled',
  participation_created: 'notifications.participation_created',
  position_cancelled: 'notifications.position_cancelled',
  position_activated: 'notifications.position_activated',
  reinvest_completed: 'notifications.reinvest_completed',
  withdraw_completed: 'notifications.withdraw_completed',
  reward_credited: 'notifications.reward_credited',
  welcome: 'notifications.welcome',
  system: 'notifications.system',
  daily_earnings_summary: 'notifications.daily_earnings_summary',
  streak_milestone: 'notifications.streak_milestone',
  price_alert: 'notifications.price_alert',
};

function getNotifIcon(type: NotificationType) {
  switch (type) {
    case 'marketplace_completed':
    case 'reinvest_completed':
      return <Check size={16} strokeWidth={2} />;
    case 'marketplace_purchased':
    case 'listing_created':
      return <Plus size={16} strokeWidth={2} />;
    case 'marketplace_expired':
    case 'listing_cancelled':
    case 'position_cancelled':
      return <XCircle size={16} strokeWidth={1.5} />;
    case 'position_activated':
      return <Coins size={16} strokeWidth={1.5} />;
    case 'withdraw_completed':
      return <ArrowDownToLine size={16} strokeWidth={1.5} />;
    case 'reward_credited':
      return <Gift size={16} strokeWidth={1.5} />;
    case 'welcome':
      return <Sparkles size={16} strokeWidth={1.5} />;
    case 'system':
      return <Info size={16} strokeWidth={1.5} />;
    case 'marketplace_reserved':
    default:
      return <Store size={16} strokeWidth={1.5} />;
  }
}

function getNotifColor(type: NotificationType): string {
  switch (type) {
    case 'marketplace_completed':
    case 'reinvest_completed':
    case 'participation_created':
    case 'position_activated':
    case 'reward_credited':
      return 'bg-success/10 text-success';
    case 'marketplace_expired':
    case 'listing_cancelled':
    case 'position_cancelled':
      return 'bg-warning/10 text-warning';
    case 'withdraw_completed':
      return 'bg-info/10 text-info';
    case 'welcome':
      return 'bg-gold/10 text-gold';
    default:
      return 'bg-primary/10 text-primary';
  }
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={t('ui.notifications')}
      className={cn(
        'absolute right-0 top-full mt-2 z-[200]',
        'w-[360px] max-h-[480px]',
        'bg-surface-elevated rounded-xl',
        'border border-border-light',
        'shadow-xl',
        'flex flex-col',
        'overflow-hidden',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
        <h3 className="text-sm font-semibold text-text-primary">
          {t('ui.notifications')}
          {unreadCount > 0 && (
            <span className="ml-2 text-xs font-medium text-text-muted">({unreadCount})</span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary-dark transition-colors"
            >
              {t('notifications.markAllRead')}
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-text-muted hover:text-error transition-colors"
            >
              {t('notifications.clearAll')}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary transition-colors"
            aria-label={t('ui.close')}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <Bell size={32} strokeWidth={1.2} className="mb-3 opacity-40" />
            <p className="text-sm">{t('notifications.empty')}</p>
          </div>
        ) : (
          <ul>
            {notifications.map((notif) => (
              <li
                key={notif.id}
                role="button"
                tabIndex={0}
                onClick={() => !notif.read && markAsRead(notif.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !notif.read) markAsRead(notif.id);
                }}
                className={cn(
                  'flex items-start gap-3 px-4 py-3',
                  'border-b border-border-light last:border-b-0',
                  'transition-colors',
                  !notif.read
                    ? 'bg-primary/[0.04] cursor-pointer hover:bg-primary/[0.08]'
                    : 'opacity-60',
                )}
              >
                {/* Unread dot */}
                <div className="shrink-0 w-2 flex items-center pt-2.5">
                  {!notif.read && <span className="block h-2 w-2 rounded-full bg-primary" />}
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    'shrink-0 mt-0.5 flex items-center justify-center',
                    'w-8 h-8 rounded-full',
                    getNotifColor(notif.type),
                  )}
                >
                  {getNotifIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-snug text-text-primary">
                    {t(typeMessageKey[notif.type] as Parameters<typeof t>[0], notif.params)}
                  </p>
                  <span className="text-xs text-text-muted mt-0.5 block">
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export { typeMessageKey, getNotifIcon, getNotifColor, formatTimeAgo };
