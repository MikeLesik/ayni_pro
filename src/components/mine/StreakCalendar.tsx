import { useMemo } from 'react';
import { cn } from '@/lib/cn';
import { Tooltip } from '@/components/ui/Tooltip';
import { useMineStore } from '@/stores/mineStore';
import { useSimulationStore } from '@/stores/simulation';
import { useTranslation } from '@/i18n';
import { formatDate } from '@/lib/formatters';

export interface StreakCalendarProps {
  claimDates?: string[];
  weeks?: number;
  cellSize?: number;
  cellGap?: number;
  className?: string;
}

interface CalendarDay {
  date: string;
  claimed: boolean;
  isToday: boolean;
  isFuture: boolean;
  intensity: 0 | 1 | 2 | 3 | 4;
}

const intensityCls: Record<number, string> = {
  0: 'bg-surface-secondary',
  1: 'bg-gold/25',
  2: 'bg-gold/50',
  3: 'bg-gold/75',
  4: 'bg-gold',
};

function dateKey(iso: string): string {
  return iso.split('T')[0]!;
}

function prevDay(dayStr: string): string {
  const d = new Date(dayStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0]!;
}

function computeStreakLength(date: string, claimSet: Set<string>): number {
  if (!claimSet.has(date)) return 0;
  let count = 0;
  let check = date;
  while (claimSet.has(check)) {
    count++;
    check = prevDay(check);
  }
  return count;
}

function streakToIntensity(len: number): 0 | 1 | 2 | 3 | 4 {
  if (len === 0) return 0;
  if (len === 1) return 1;
  if (len <= 6) return 2;
  if (len <= 13) return 3;
  return 4;
}

function buildGrid(claimDates: string[], weeks: number, today: string): CalendarDay[] {
  const claimSet = new Set(claimDates);
  const todayDate = new Date(today + 'T00:00:00Z');

  // Find Monday of current week
  const dayOfWeek = todayDate.getUTCDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const currentMonday = new Date(todayDate);
  currentMonday.setUTCDate(currentMonday.getUTCDate() - mondayOffset);

  // Go back (weeks-1) weeks from current Monday
  const startDate = new Date(currentMonday);
  startDate.setUTCDate(startDate.getUTCDate() - (weeks - 1) * 7);

  const days: CalendarDay[] = [];

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(startDate);
      cellDate.setUTCDate(cellDate.getUTCDate() + w * 7 + d);
      const dateStr = cellDate.toISOString().split('T')[0]!;
      const isFuture = dateStr > today;
      const claimed = claimSet.has(dateStr);
      const streakLen = computeStreakLength(dateStr, claimSet);

      days.push({
        date: dateStr,
        claimed,
        isToday: dateStr === today,
        isFuture,
        intensity: isFuture ? 0 : streakToIntensity(streakLen),
      });
    }
  }

  return days;
}

const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

export function StreakCalendar({
  claimDates: claimDatesProp,
  weeks = 14,
  cellSize = 12,
  cellGap = 2,
  className,
}: StreakCalendarProps) {
  const { t } = useTranslation();
  const storeClaimDates = useMineStore((s) => s.claimDates);
  const simDate = useSimulationStore((s) => s.simulationDate);
  const today = dateKey(simDate);
  const claimDates = claimDatesProp ?? storeClaimDates;

  const days = useMemo(() => buildGrid(claimDates, weeks, today), [claimDates, weeks, today]);

  const claimedCount = claimDates.filter((d) => d <= today).length;
  const currentStreak = useMineStore((s) => s.getCurrentStreak());
  const ariaLabel =
    t('mine.calendar.ariaLabel' as any, {
      claimed: String(claimedCount),
      weeks: String(weeks),
      streak: String(currentStreak),
    }) ||
    `Mining activity: ${claimedCount} days claimed in the last ${weeks} weeks. Current streak: ${currentStreak} days.`;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex gap-1">
        {/* Day labels */}
        <div
          className="flex flex-col shrink-0 pr-1"
          style={{
            height: cellSize * 7 + cellGap * 6,
            justifyContent: 'space-between',
          }}
        >
          {DAY_LABELS.map((label, i) => (
            <span
              key={i}
              className="text-[9px] leading-none text-text-muted"
              style={{ height: cellSize, display: 'flex', alignItems: 'center' }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div
            role="img"
            aria-label={ariaLabel}
            className="inline-grid"
            style={{
              gridTemplateRows: `repeat(7, ${cellSize}px)`,
              gridTemplateColumns: `repeat(${weeks}, ${cellSize}px)`,
              gridAutoFlow: 'column',
              gap: cellGap,
            }}
          >
            {days.map((day) => (
              <Tooltip
                key={day.date}
                content={
                  <span>
                    {formatDate(day.date + 'T00:00:00Z')}
                    {' — '}
                    {day.isFuture
                      ? t('mine.calendar.upcoming' as any)
                      : day.claimed
                        ? t('mine.calendar.claimed' as any)
                        : t('mine.calendar.missed' as any)}
                  </span>
                }
                side="top"
              >
                <div
                  className={cn(
                    'rounded-sm transition-colors cursor-default',
                    intensityCls[day.intensity],
                    day.isFuture && 'opacity-30',
                    day.isToday && 'ring-1 ring-primary ring-offset-1 ring-offset-surface-bg',
                  )}
                  style={{ width: cellSize, height: cellSize }}
                />
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      {/* SR-only summary */}
      <p className="sr-only">{ariaLabel}</p>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-1 text-[9px] text-text-muted">
        <span>{t('mine.calendar.less' as any) || 'Less'}</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn('rounded-sm', intensityCls[level])}
            style={{ width: cellSize - 2, height: cellSize - 2 }}
          />
        ))}
        <span>{t('mine.calendar.more' as any) || 'More'}</span>
      </div>
    </div>
  );
}
