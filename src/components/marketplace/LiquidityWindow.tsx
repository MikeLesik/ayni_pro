import { useNavigate } from 'react-router-dom';
import { Clock, CalendarCheck } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

/** Quarterly liquidity windows: first 7 days of Mar, Jun, Sep, Dec */
function getQuarterlyWindowDates(year: number): Date[] {
  return [2, 5, 8, 11].map((m) => new Date(year, m, 3)); // months 0-indexed → Mar, Jun, Sep, Dec
}

function getLiquidityWindowStatus() {
  const now = new Date();
  const year = now.getFullYear();
  const windows = [
    ...getQuarterlyWindowDates(year - 1),
    ...getQuarterlyWindowDates(year),
    ...getQuarterlyWindowDates(year + 1),
  ];

  for (const start of windows) {
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    if (now >= start && now < end) {
      return { isOpen: true as const, endsAt: end, nextWindowStart: null };
    }
  }

  // Find next upcoming window
  const next = windows.find((d) => d > now) ?? windows[0];
  return { isOpen: false as const, endsAt: null, nextWindowStart: next };
}

function formatCountdown(target: Date): string {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return '0';
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  return `${days}d ${hours}h`;
}

function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'es' ? 'es-ES' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function LiquidityWindow({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const status = getLiquidityWindowStatus();

  if (status.isOpen) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-xl px-5 py-3.5 shadow-sm',
          'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
          className,
        )}
        style={{ background: 'var(--color-primary)' }}
      >
        {/* Gold accent line at bottom */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: 'var(--color-gold-gradient)' }}
        />

        <div className="flex items-start gap-3 text-white min-w-0">
          <CalendarCheck size={20} className="shrink-0 mt-0.5 opacity-80" />
          <div>
            <h3 className="text-base font-semibold">{t('marketplace.liquidity.openTitle')}</h3>
            <p className="text-body-sm opacity-75 mt-0.5 flex items-center gap-1.5">
              <Clock size={13} className="shrink-0" />
              {t('marketplace.liquidity.countdown', {
                time: formatCountdown(status.endsAt!),
              })}
            </p>
          </div>
        </div>

        <Button
          variant="inverse"
          size="md"
          onClick={() => navigate('/participate/marketplace/create')}
          className="sm:flex-shrink-0 max-sm:w-full"
        >
          {t('marketplace.liquidity.applyCta')}
        </Button>
      </div>
    );
  }

  // Closed state
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl px-5 py-3.5',
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2',
        'border border-border',
        className,
      )}
      style={{ background: 'var(--color-surface-secondary)' }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <CalendarCheck size={20} className="shrink-0 mt-0.5 text-text-muted" />
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            {t('marketplace.liquidity.closedTitle', {
              date: formatDate(status.nextWindowStart!, language),
            })}
          </h3>
          <p className="text-body-sm text-text-secondary mt-0.5">
            {t('marketplace.liquidity.closedSubtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}
