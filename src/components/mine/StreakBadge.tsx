import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useMineStore } from '@/stores/mineStore';
import { useSimulationStore } from '@/stores/simulation';
import { useTranslation } from '@/i18n';

/* ── Types ─────────────────────────────────────────────────── */

type FlameTier = 'none' | 'small' | 'medium' | 'large' | 'blazing';

interface StreakBadgeProps {
  /** Override streak value. If omitted, reads from useMineStore. */
  streak?: number;
  /** 'sm' for inline use in ClaimButton, 'md' (default) for headers */
  size?: 'sm' | 'md';
  className?: string;
}

/* ── Tier helpers ──────────────────────────────────────────── */

function getFlameTier(streak: number): FlameTier {
  if (streak < 2) return 'none';
  if (streak <= 6) return 'small';
  if (streak <= 13) return 'medium';
  if (streak <= 29) return 'large';
  return 'blazing';
}

const tierConfig = {
  none: {
    iconSize: { sm: 14, md: 16 },
    fill: false,
    colorClass: 'text-text-muted',
    glowClass: '',
    emberCount: 0,
    flickerSpeed: '',
    badgeBg: 'bg-warning/10 border-warning/20',
    textColor: 'text-warning',
  },
  small: {
    iconSize: { sm: 14, md: 18 },
    fill: false,
    colorClass: 'text-warning',
    glowClass: '',
    emberCount: 0,
    flickerSpeed: 'animate-[flame-flicker_0.8s_ease-in-out_infinite]',
    badgeBg: 'bg-warning/10 border-warning/20',
    textColor: 'text-warning',
  },
  medium: {
    iconSize: { sm: 16, md: 22 },
    fill: true,
    colorClass: 'text-warning',
    glowClass: 'drop-shadow-[0_0_6px_rgba(212,146,10,0.35)]',
    emberCount: 0,
    flickerSpeed: 'animate-[flame-flicker_0.6s_ease-in-out_infinite]',
    badgeBg: 'bg-warning/10 border-warning/20',
    textColor: 'text-warning',
  },
  large: {
    iconSize: { sm: 18, md: 26 },
    fill: true,
    colorClass: 'text-orange-500',
    glowClass: 'drop-shadow-[0_0_10px_rgba(234,88,12,0.4)]',
    emberCount: 3,
    flickerSpeed: 'animate-[flame-flicker_0.5s_ease-in-out_infinite]',
    badgeBg: 'bg-orange-500/10 border-orange-500/20',
    textColor: 'text-orange-500',
  },
  blazing: {
    iconSize: { sm: 20, md: 30 },
    fill: true,
    colorClass: 'text-red-500',
    glowClass: 'drop-shadow-[0_0_16px_rgba(220,38,38,0.5)]',
    emberCount: 6,
    flickerSpeed: 'animate-[flame-flicker_0.4s_ease-in-out_infinite]',
    badgeBg: 'bg-red-500/10 border-red-500/20',
    textColor: 'text-red-500',
  },
} as const;

/* ── Component ─────────────────────────────────────────────── */

export function StreakBadge({ streak, size = 'md', className }: StreakBadgeProps) {
  const claimDates = useMineStore((s) => s.claimDates);
  const simulationDate = useSimulationStore((s) => s.simulationDate);

  const computedStreak = useMemo(() => {
    const today = simulationDate.split('T')[0]!;
    const dates = new Set(claimDates);
    let count = 0;
    const d = new Date(today + 'T00:00:00Z');
    while (dates.has(d.toISOString().split('T')[0]!)) {
      count++;
      d.setUTCDate(d.getUTCDate() - 1);
    }
    return count;
  }, [claimDates, simulationDate]);

  const streakDays = streak ?? computedStreak;
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  const tier = getFlameTier(streakDays);
  const config = tierConfig[tier];
  const iconSz = config.iconSize[size];

  /* ── Detect streak increase for burst animation ─────────── */
  const prevStreakRef = useRef(streakDays);
  const [justClaimed, setJustClaimed] = useState(false);

  useEffect(() => {
    if (streakDays > prevStreakRef.current && !reducedMotion) {
      setJustClaimed(true);
      const timer = setTimeout(() => setJustClaimed(false), 600);
      prevStreakRef.current = streakDays;
      return () => clearTimeout(timer);
    }
    prevStreakRef.current = streakDays;
  }, [streakDays, reducedMotion]);

  if (tier === 'none') return null;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full shrink-0 border',
        size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1.5',
        config.badgeBg,
        className,
      )}
      aria-label={t('mine.streak.ariaLabel', { days: streakDays })}
    >
      {/* Flame icon with spring sizing + burst on claim */}
      <motion.div
        className="relative flex items-center justify-center"
        animate={justClaimed ? { scale: [1, 1.4, 1] } : { scale: 1 }}
        transition={
          justClaimed
            ? { duration: 0.6, type: 'spring', stiffness: 200, damping: 10 }
            : { type: 'spring', stiffness: 300, damping: 20 }
        }
      >
        {/* Blazing glow background */}
        {tier === 'blazing' && !reducedMotion && (
          <div
            className="absolute inset-[-4px] rounded-full opacity-25 pointer-events-none blur-sm"
            style={{
              background: 'radial-gradient(circle, #FF6B35 0%, #FFD700 50%, transparent 80%)',
            }}
          />
        )}

        <Flame
          size={iconSz}
          className={cn(config.colorClass, config.glowClass, !reducedMotion && config.flickerSpeed)}
          fill={config.fill ? 'currentColor' : 'none'}
        />

        {/* Ember particles for large & blazing tiers */}
        {config.emberCount > 0 && !reducedMotion && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 pointer-events-none">
            {Array.from({ length: config.emberCount }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'absolute rounded-full animate-[ember-float_1.2s_ease-out_infinite]',
                  tier === 'blazing' ? 'bg-red-400' : 'bg-orange-400',
                )}
                style={{
                  width: 3,
                  height: 3,
                  left: `${(i - config.emberCount / 2) * 5}px`,
                  animationDelay: `${i * 0.25}s`,
                  opacity: 0.8 - i * 0.08,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Streak count */}
      <span
        className={cn(
          'font-semibold tabular-nums',
          size === 'sm' ? 'text-[11px]' : 'text-xs',
          config.textColor,
        )}
      >
        {streakDays}
      </span>
    </div>
  );
}
