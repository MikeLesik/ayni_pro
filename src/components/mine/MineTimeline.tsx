import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/formatters';
import { useTranslation } from '@/i18n';
import { useMineStore } from '@/stores/mineStore';
import type { TranslationKey } from '@/i18n';

export function MineTimeline() {
  const { t } = useTranslation();
  const timelineEvents = useMineStore((s) => s.timelineEvents);

  if (timelineEvents.length === 0) return null;

  const events = timelineEvents.map((event) => {
    const isFuture = event.type === 'future_goal';
    const isAchievement = event.type === 'achievement';

    let title: string;
    if (isFuture) {
      title = t('mine.timeline.nextLevel', { name: event.title });
    } else if (isAchievement) {
      // event.title is an i18n key from achievementDefs
      title = t(event.title as TranslationKey);
    } else if (event.type === 'payout') {
      title = t('mine.timeline.payoutReceived');
    } else if (event.type === 'level_up') {
      title = t('mine.timeline.levelUp' as TranslationKey);
    } else {
      title = t('mine.timeline.positionCreated');
    }

    return {
      title,
      date: isFuture ? t('mine.timeline.goal') : formatDate(event.timestamp),
      type: isFuture
        ? ('future' as const)
        : isAchievement
          ? ('milestone' as const)
          : ('past' as const),
    };
  });

  return (
    <div>
      <h3 className="text-lg font-semibold text-text-primary mb-3">{t('mine.timeline.title')}</h3>

      <div className="relative pl-5">
        {/* Vertical line */}
        <div className="absolute left-[3px] top-1 bottom-1 w-px bg-border-light" />

        <div className="flex flex-col gap-3">
          {events.map((event, i) => (
            <div key={i} className="relative flex items-start gap-2.5">
              {/* Dot */}
              <div
                className={cn(
                  'absolute -left-5 top-1.5 w-2 h-2 rounded-full border-[1.5px]',
                  event.type === 'past' && 'bg-primary border-primary',
                  event.type === 'milestone' && 'bg-primary border-primary',
                  event.type === 'future' && 'bg-transparent border-primary border-dashed',
                )}
              />

              {/* Content */}
              <div>
                <p
                  className={cn(
                    'text-sm',
                    event.type === 'future' ? 'text-primary font-medium' : 'text-text-primary',
                  )}
                >
                  {event.title}
                </p>
                <p className="text-xs text-text-muted">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
