import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useSimulationStore } from '@/stores/simulation';
import { useTranslation } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { calculateDailyReward } from '@/lib/rewardEngine';
import { daysBetween } from '@/lib/dateUtils';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/cn';
import { Gem, X } from 'lucide-react';

interface DemoPositionCardProps {
  className?: string;
}

const DEMO_AMOUNT_USD = 100;
const DEMO_TERM_MONTHS = 12;
const DEMO_DAYS = 7;

export function DemoPositionCard({ className }: DemoPositionCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { demoPositionCreated, demoPositionCreatedAt, demoPositionDismissed, dismissDemoPosition } =
    useOnboardingStore();
  const simulationDate = useSimulationStore((s) => s.simulationDate);
  const prices = useSimulationStore((s) => s.prices);

  if (!demoPositionCreated || !demoPositionCreatedAt || demoPositionDismissed) return null;

  const daysElapsed = Math.min(DEMO_DAYS, Math.max(0, daysBetween(demoPositionCreatedAt, simulationDate)));
  const isComplete = daysElapsed >= DEMO_DAYS;

  const tokensAmount = DEMO_AMOUNT_USD / prices.ayniUsd;
  const daily = calculateDailyReward(
    tokensAmount,
    DEMO_AMOUNT_USD,
    DEMO_TERM_MONTHS,
    prices.goldPerGram,
    prices.paxgUsd,
  );
  const totalAccrued = daily.netRewardUsd * daysElapsed;
  const totalGrams = daily.netRewardGrams * daysElapsed;
  const progressPercent = (daysElapsed / DEMO_DAYS) * 100;

  return (
    <Card
      variant="stat"
      padding="p-4"
      className={cn('relative border border-primary/30', className)}
    >
      {/* Dismiss */}
      <button
        onClick={dismissDemoPosition}
        className="absolute right-3 top-3 text-text-muted hover:text-text-primary transition-colors"
        aria-label={t('common.close')}
      >
        <X size={16} />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2 pr-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light">
          <Gem size={14} className="text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary">
          {t('demo.position.title')}
        </h3>
        <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
          {t('demo.position.badge')}
        </span>
      </div>

      {!isComplete ? (
        <>
          <p className="text-xs text-text-secondary mb-2">
            {t('demo.position.dayProgress', { day: daysElapsed, total: DEMO_DAYS })}
          </p>
          <ProgressBar percent={progressPercent} height={5} />
          {daysElapsed > 0 && (
            <p className="mt-2 font-display text-lg text-primary">
              {t('demo.position.earned', {
                amount: formatCurrency(totalAccrued),
                grams: totalGrams.toFixed(4) + 'g',
              })}
            </p>
          )}
        </>
      ) : (
        <>
          <p className="text-sm text-text-primary font-medium mb-3">
            {t('demo.position.complete', { amount: formatCurrency(totalAccrued) })}
          </p>
          <Button
            variant="gold-cta"
            size="md"
            fullWidth
            onClick={() => navigate('/participate')}
          >
            {t('demo.position.cta')}
          </Button>
        </>
      )}
    </Card>
  );
}
