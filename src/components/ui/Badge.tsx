import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n';

export type BadgeStatus = 'active' | 'pending' | 'completed' | 'claimed' | 'locked';

export interface BadgeProps {
  status: BadgeStatus;
  label?: string;
  className?: string;
}

const statusStyles: Record<BadgeStatus, string> = {
  active: 'bg-success-light text-success',
  pending: 'bg-warning-light text-warning',
  completed: 'bg-primary-light text-primary',
  claimed: 'bg-gold-light text-gold-dark',
  locked: 'bg-surface-secondary text-text-muted',
};

const statusLabelKeys: Record<BadgeStatus, TranslationKey> = {
  active: 'status.active',
  pending: 'status.pending',
  completed: 'status.completed',
  claimed: 'status.claimed',
  locked: 'status.locked',
};

export function Badge({ status, label, className }: BadgeProps) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status],
        className,
      )}
    >
      {label ?? t(statusLabelKeys[status])}
    </span>
  );
}
