import { useMemo } from 'react';
import { ActivityItem } from './ActivityItem';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/formatters';
import { useTranslation } from '@/i18n';
import type { ActivityEvent } from '@/types/activity';

interface ActivityGroupProps {
  label: string;
  events: ActivityEvent[];
  isFirst?: boolean;
}

export function ActivityGroup({ label, events, isFirst }: ActivityGroupProps) {
  const { t } = useTranslation();

  const { income, expense } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const e of events) {
      if (e.amount == null) continue;
      if (e.type === 'participation_confirmed') {
        exp += Math.abs(e.amount);
      } else {
        inc += Math.abs(e.amount);
      }
    }
    return { income: inc, expense: exp };
  }, [events]);

  const hasAmounts = income > 0 || expense > 0;

  return (
    <div>
      <p
        className={cn(
          'text-xs uppercase tracking-wide text-text-muted mb-1.5',
          isFirst ? 'mt-0' : 'mt-4',
        )}
      >
        {label}
      </p>
      {events.map((event) => (
        <ActivityItem key={event.id} event={event} />
      ))}
      {hasAmounts && (
        <p className="text-[13px] text-text-muted mt-1.5 text-right tabular-nums">
          {t('activity.group.subtotal', {
            income: formatCurrency(income),
            expense: formatCurrency(expense),
          })}
        </p>
      )}
    </div>
  );
}
