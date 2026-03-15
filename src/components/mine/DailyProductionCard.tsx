import { useEffect, useRef, useState } from 'react';
import { Gem } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/formatters';
import { useIsDark } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';

interface DailyProductionCardProps {
  goldGrams: number;
  usdValue: number;
  activeDays: number;
  weeklyGrams: number;
  weeklyUsd: number;
}

/** Animates a number from 0 → target over `duration` ms */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - t) * (1 - t);
      setValue(target * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

export function DailyProductionCard({
  goldGrams,
  usdValue,
  activeDays,
  weeklyGrams,
  weeklyUsd,
}: DailyProductionCardProps) {
  const animatedGrams = useCountUp(goldGrams);
  const isDark = useIsDark();
  const { t } = useTranslation();

  return (
    <Card
      variant="action"
      className={cn('p-4', isDark && 'bg-white/[0.06] backdrop-blur-lg border-white/10')}
    >
      <h3 className="text-base font-semibold text-text-primary">{t('mine.production.title')}</h3>

      {/* Central gold display */}
      <div className="flex flex-col items-center mt-2">
        <div className="gold-glow-icon">
          <Gem className="w-6 h-6 text-primary" />
        </div>
        <p className="font-display text-display-hero-mobile md:text-display-hero text-text-primary mt-2">
          {t('mine.production.goldLabel', { grams: animatedGrams.toFixed(4) })}
        </p>
        <p className="text-sm text-primary mt-0.5">≈ {formatCurrency(usdValue)}</p>
      </div>

      {/* Active days badge */}
      {activeDays > 0 && (
        <div className="flex justify-center mt-2">
          <span className="inline-flex items-center gap-1 bg-warning-light text-warning rounded-full px-2 py-0.5 text-xs font-medium">
            {t('mine.production.activeDaysLabel', { days: activeDays })}
          </span>
        </div>
      )}

      {/* Weekly summary */}
      <p className="text-xs text-text-secondary text-center mt-1.5">
        {t('mine.production.weeklyLabel', {
          grams: weeklyGrams.toFixed(3),
          usd: formatCurrency(weeklyUsd),
        })}
      </p>

      {/* Glow animation styles */}
      <style>{`
        .gold-glow-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          animation: primaryGlow 2s ease-in-out infinite;
        }
        @keyframes primaryGlow {
          0%, 100% { filter: drop-shadow(0 0 4px var(--color-primary)); }
          50% { filter: drop-shadow(0 0 12px var(--color-primary)); }
        }
        [data-theme="dark"] .gold-glow-icon {
          animation: primaryGlowBright 2s ease-in-out infinite;
        }
        @keyframes primaryGlowBright {
          0%, 100% { filter: drop-shadow(0 0 6px var(--color-primary)); }
          50% { filter: drop-shadow(0 0 22px var(--color-primary)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gold-glow-icon { animation: none; }
        }
      `}</style>
    </Card>
  );
}
