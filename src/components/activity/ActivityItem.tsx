import { TrendingUp, ArrowUpRight, Download, Bell, CalendarDays } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/formatters';
import type { ActivityEvent, ActivityEventType } from '@/types/activity';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n';

const iconConfig: Record<
  ActivityEventType,
  {
    Icon: typeof TrendingUp;
    bg: string;
    iconColor: string;
  }
> = {
  reward_credited: {
    Icon: TrendingUp,
    bg: 'bg-success-light',
    iconColor: 'text-success',
  },
  participation_confirmed: {
    Icon: ArrowUpRight,
    bg: 'bg-info-light',
    iconColor: 'text-info',
  },
  payout_completed: {
    Icon: Download,
    bg: 'bg-success-light',
    iconColor: 'text-success',
  },
  quarterly_payout: {
    Icon: CalendarDays,
    bg: 'bg-success-light',
    iconColor: 'text-success',
  },
  system_announcement: {
    Icon: Bell,
    bg: 'bg-bg-secondary',
    iconColor: 'text-text-muted',
  },
};

/* Badge color mapping */
const badgeStyles: Record<ActivityEventType, string> = {
  participation_confirmed: 'bg-primary/10 text-primary', // navy / deposit
  payout_completed: 'bg-success/10 text-success', // green / withdrawal
  reward_credited: 'bg-success/10 text-success', // green / reward
  quarterly_payout: 'bg-success/10 text-success', // green / payout
  system_announcement: 'bg-surface-secondary text-text-muted', // grey
};

const badgeLabelKeys: Record<ActivityEventType, TranslationKey> = {
  participation_confirmed: 'activity.badge.deposit',
  payout_completed: 'activity.badge.payout',
  reward_credited: 'activity.badge.reward',
  quarterly_payout: 'activity.badge.payout',
  system_announcement: 'activity.badge.system',
};

function formatTimestamp(iso: string): string {
  return format(parseISO(iso), 'd MMM · HH:mm');
}

function formatAmount(type: ActivityEventType, amount: number): string {
  const abs = Math.abs(amount);
  if (type === 'participation_confirmed') {
    return `−${formatCurrency(abs)}`;
  }
  return `+${formatCurrency(abs)}`;
}

/** Determine amount color: green for incoming, red for outgoing */
function amountColorClass(type: ActivityEventType): string {
  if (type === 'participation_confirmed') return 'text-error';
  return 'text-success';
}

interface ActivityItemProps {
  event: ActivityEvent;
}

export function ActivityItem({ event }: ActivityItemProps) {
  const { t } = useTranslation();
  const config = iconConfig[event.type] ?? iconConfig.system_announcement;
  const { Icon, bg, iconColor } = config;
  const isSystem = event.type === 'system_announcement';

  const displayTitle = event.titleKey
    ? t(event.titleKey as TranslationKey, event.titleVars)
    : event.title;
  const displaySubtitle = event.subtitleKey
    ? t(event.subtitleKey as TranslationKey, event.subtitleVars)
    : event.subtitle;

  return (
    <div
      className={cn(
        'flex items-start gap-3 border-b border-border-light/[0.06]',
        'transition-colors duration-150 hover:bg-bg-primary/50',
        isSystem ? 'py-2.5' : 'py-3',
      )}
    >
      {/* Icon circle */}
      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center rounded-full',
          'w-9 h-9 mt-0.5',
          bg,
        )}
      >
        <Icon size={16} className={iconColor} />
      </div>

      {/* Content — two rows */}
      <div className="flex-1 min-w-0">
        {/* Row 1: title + amount */}
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium text-text-primary truncate leading-tight">
            {displayTitle}
          </p>
          {event.amount != null && (
            <span
              className={cn(
                'shrink-0 text-sm font-semibold tabular-nums',
                amountColorClass(event.type),
              )}
            >
              {formatAmount(event.type, event.amount)}
            </span>
          )}
        </div>

        {/* Row 2: timestamp + badge */}
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-[13px] text-text-muted leading-tight whitespace-nowrap">
            {formatTimestamp(event.timestamp)}
          </span>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
              badgeStyles[event.type] ?? badgeStyles.system_announcement,
            )}
          >
            {t(badgeLabelKeys[event.type] ?? badgeLabelKeys.system_announcement)}
          </span>
        </div>
        {/* Row 3: subtitle (if any) */}
        {displaySubtitle && (
          <p className="text-[13px] text-text-secondary mt-0.5 leading-tight">{displaySubtitle}</p>
        )}
      </div>
    </div>
  );
}
