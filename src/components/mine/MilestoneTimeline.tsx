import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/formatters';
import { useTranslation } from '@/i18n';
import { useMineStore } from '@/stores/mineStore';
import type { MineTimelineEvent } from '@/types/mine';
import type { TranslationKey } from '@/i18n';

export interface MilestoneTimelineProps {
  events?: MineTimelineEvent[];
  className?: string;
}

type MilestoneStatus = 'completed' | 'current' | 'future';

interface ProcessedMilestone {
  id: string;
  type: MineTimelineEvent['type'];
  title: string;
  date: string;
  status: MilestoneStatus;
  isMajor: boolean;
}

// ── Marker ──────────────────────────────────────────────────

function MilestoneMarker({ status, isMajor }: { status: MilestoneStatus; isMajor: boolean }) {
  const reducedMotion = useReducedMotion();
  const majorCls = 'w-4 h-4 md:w-5 md:h-5';
  const minorCls = 'w-2.5 h-2.5 md:w-3 md:h-3';
  const sizeCls = isMajor ? majorCls : minorCls;

  if (status === 'completed') {
    return (
      <div className={cn('rounded-full bg-gold flex items-center justify-center', sizeCls)}>
        {isMajor && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>
    );
  }

  if (status === 'current') {
    return (
      <div className="relative flex items-center justify-center">
        {!reducedMotion && (
          <motion.div
            className={cn('absolute rounded-full border-2 border-gold', sizeCls)}
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <div className={cn('rounded-full border-2 border-gold bg-gold/20', sizeCls)} />
      </div>
    );
  }

  // future
  return <div className={cn('rounded-full border-2 border-dashed border-text-muted', sizeCls)} />;
}

// ── Main Component ──────────────────────────────────────────

export function MilestoneTimeline({ events: eventsProp, className }: MilestoneTimelineProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const storeEvents = useMineStore((s) => s.timelineEvents);
  const rawEvents = eventsProp ?? storeEvents;

  // Process events into milestones
  const milestones: ProcessedMilestone[] = rawEvents.map((event) => {
    const isFuture = event.type === 'future_goal';
    const isMajor = ['level_up', 'achievement', 'payout', 'future_goal'].includes(event.type);

    let title: string;
    if (isFuture) {
      title = t('mine.timeline.nextLevel', { name: event.title });
    } else if (event.type === 'achievement') {
      title = t(event.title as TranslationKey);
    } else if (event.type === 'payout') {
      title = t('mine.timeline.payoutReceived');
    } else {
      title = t('mine.timeline.positionCreated');
    }

    return {
      id: event.id,
      type: event.type,
      title,
      date: isFuture ? '' : formatDate(event.timestamp),
      status: isFuture ? ('future' as const) : ('completed' as const),
      isMajor,
    };
  });

  // Mark the first non-future event as "current"
  const currentIdx = milestones.findIndex((m) => m.status !== 'future');
  if (currentIdx >= 0) {
    milestones[currentIdx]!.status = 'current';
  }

  // ── Progress line height ──────────────────────────────

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [progressHeight, setProgressHeight] = useState(0);

  const setNodeRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      nodeRefs.current[i] = el;
    },
    [],
  );

  useEffect(() => {
    if (!containerRef.current || currentIdx < 0) return;

    const measure = () => {
      const container = containerRef.current;
      const node = nodeRefs.current[currentIdx];
      if (!container || !node) return;

      const containerTop = container.getBoundingClientRect().top;
      const nodeTop = node.getBoundingClientRect().top;
      setProgressHeight(nodeTop - containerTop + 10);
    };

    // Measure after layout paint
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [milestones.length, currentIdx]);

  if (milestones.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {t('mine.milestone.title' as any) || 'Your Journey'}
      </h3>

      <div ref={containerRef} className="relative pl-6">
        {/* Background line (full height, gray) */}
        <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-border-light" />

        {/* Animated progress line (gold) */}
        {progressHeight > 0 && (
          <motion.div
            className="absolute left-[9px] top-0 w-0.5 origin-top"
            style={{
              background:
                'linear-gradient(180deg, var(--color-gold) 0%, var(--color-gold-mid) 100%)',
            }}
            initial={reducedMotion ? { height: progressHeight } : { height: 0 }}
            animate={{ height: progressHeight }}
            transition={
              reducedMotion ? { duration: 0 } : { duration: 1.2, ease: 'easeOut', delay: 0.3 }
            }
          />
        )}

        {/* Milestone nodes */}
        <div className="flex flex-col gap-4">
          {milestones.map((m, i) => (
            <div key={m.id} ref={setNodeRef(i)} className="relative flex items-start gap-3">
              {/* Marker */}
              <div className="absolute -left-6 top-0.5 flex items-center justify-center">
                <MilestoneMarker status={m.status} isMajor={m.isMajor} />
              </div>

              {/* Content */}
              <div className={cn('flex-1 min-w-0', m.status === 'future' && 'opacity-50')}>
                <p
                  className={cn(
                    'text-sm',
                    m.status === 'future'
                      ? 'text-text-muted italic'
                      : m.status === 'current'
                        ? 'text-primary font-medium'
                        : 'text-text-primary',
                    m.isMajor && m.status !== 'future' && 'font-medium',
                  )}
                >
                  {m.title}
                </p>
                {m.date && <p className="text-xs text-text-muted mt-0.5">{m.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
