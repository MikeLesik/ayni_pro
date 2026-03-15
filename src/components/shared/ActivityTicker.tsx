import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useActivityTickerEvents } from '@/hooks/useActivityTicker';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/cn';
import { TrendingUp, Gem, Award } from 'lucide-react';

interface ActivityTickerProps {
  className?: string;
  interval?: number;
}

const iconMap = {
  investment: TrendingUp,
  earning: Gem,
  payout: Award,
} as const;

export function ActivityTicker({ className, interval = 4000 }: ActivityTickerProps) {
  const { t } = useTranslation();
  const events = useActivityTickerEvents();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % events.length);
    }, interval);
    return () => clearInterval(timer);
  }, [events.length, interval]);

  if (events.length === 0) return null;

  const current = events[index % events.length]!;
  const Icon = iconMap[current.type];

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-lg bg-surface-secondary/50 px-4 py-2.5 overflow-hidden',
        className,
      )}
    >
      {/* Live indicator */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-success">
          {t('ticker.live')}
        </span>
      </div>

      <div className="relative flex-1 h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center gap-1.5"
          >
            <Icon size={13} className="shrink-0 text-text-muted" />
            <span className="truncate text-xs text-text-secondary">{current.message}</span>
            <span className="shrink-0 text-[10px] text-text-muted">{current.timeAgo}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
