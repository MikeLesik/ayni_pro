import { cn } from '@/lib/cn';
import { Bell } from 'lucide-react';
import { useTranslation } from '@/i18n';

export interface NotificationBellProps {
  count: number;
  onClick?: () => void;
  className?: string;
}

export function NotificationBell({ count, onClick, className }: NotificationBellProps) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? t('ui.notificationsCount', { count }) : t('ui.notifications')}
      className={cn(
        'relative inline-flex items-center justify-center',
        'min-h-[44px] min-w-[44px]',
        'text-text-secondary hover:text-text-primary',
        'transition-colors duration-200',
        className,
      )}
    >
      <Bell size={20} strokeWidth={1.5} />
      {count > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error" />}
    </button>
  );
}
