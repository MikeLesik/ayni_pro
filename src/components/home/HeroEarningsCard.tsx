import { useNavigate } from 'react-router-dom';
import type {
  DashboardDistributions,
  DashboardNextPayout,
  DashboardQuarterlyInfo,
} from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { useIsDark } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { Button } from '@/components/ui/Button';
import { Shield, Info } from 'lucide-react';
import { cn } from '@/lib/cn';

interface HeroEarningsCardProps {
  distributions: DashboardDistributions;
  nextPayout: DashboardNextPayout;
  quarterly?: DashboardQuarterlyInfo;
  isPremium?: boolean;
  className?: string;
}

export function HeroEarningsCard({
  distributions,
  nextPayout,
  quarterly,
  isPremium = false,
  className,
}: HeroEarningsCardProps) {
  const isDark = useIsDark();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const premiumDark = isPremium && isDark;

  const hasHadPayout = quarterly?.hasHadPayout ?? false;
  const totalLabel = hasHadPayout
    ? t('home.heroCard.totalEarned')
    : t('home.heroCard.totalAccrued');

  const nearPayout = nextPayout.progressPercent >= 80;

  const ringNode = (size: number, sw: number, showDays = true) => (
    <ProgressRing
      size={size}
      strokeWidth={sw}
      percent={nextPayout.progressPercent}
      color={nearPayout ? 'var(--color-gold)' : undefined}
      centerContent={
        <div className="text-center">
          <div
            className={cn(
              'font-sans font-bold leading-none',
              size >= 60 ? 'text-lg' : 'text-sm',
              premiumDark && 'text-white',
            )}
          >
            {nextPayout.daysRemaining}
          </div>
          {showDays && (
            <div
              className={cn(
                'text-[10px] leading-tight mt-0.5',
                premiumDark ? 'text-white/50' : 'text-text-muted',
              )}
            >
              {t('home.heroCard.daysLabel')}
            </div>
          )}
        </div>
      }
    />
  );

  return (
    <Card
      variant={isDark ? 'glass' : 'stat'}
      className={cn('px-4 py-3 overflow-hidden', premiumDark && 'text-white border-0', className)}
      style={premiumDark ? { background: 'linear-gradient(135deg, #1B3A4B, #0F2533)' } : undefined}
    >
      {/* Main layout: left content + right ring centered over full card height */}
      <div className="flex justify-between gap-3">
        {/* Left column: all text content */}
        <div className="min-w-0">
          <div
            className={cn(
              'text-[11px] uppercase tracking-wider font-medium flex items-center gap-1',
              premiumDark ? 'text-white/60' : 'text-text-muted',
            )}
          >
            {totalLabel}
            <Tooltip content={t('home.heroCard.totalAccruedTooltip')}>
              <button
                type="button"
                className={cn(
                  'transition-colors',
                  premiumDark
                    ? 'text-white/40 hover:text-white/60'
                    : 'text-text-muted hover:text-text-secondary',
                )}
              >
                <Info size={12} />
              </button>
            </Tooltip>
          </div>

          <div
            className={cn(
              'font-display text-[48px] md:text-display-hero font-bold leading-none tracking-tight mt-1',
              premiumDark ? 'text-white' : 'text-text-primary',
            )}
          >
            <CountUpNumber value={distributions.totalDistributed} prefix="$" />
          </div>

          <p className={cn('text-xs mt-1', premiumDark ? 'text-white/50' : 'text-text-muted')}>
            {t('home.heroCard.sinceYouStarted')} &middot; {formatDate(distributions.startDate)}
          </p>

          {/* Daily badge + trust */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                premiumDark ? 'bg-white/10 text-emerald-300' : 'bg-success-light text-success',
              )}
            >
              +{formatCurrency(distributions.todayDistribution)} {t('common.today')} &middot; &uarr;{' '}
              {t('home.heroCard.earningDaily')}
            </span>

            <Button
              variant="text"
              onClick={() => navigate('/trust')}
              className={cn(
                'flex items-center gap-1 text-xs',
                premiumDark
                  ? 'text-white/40 hover:text-white/60'
                  : 'text-text-muted hover:text-text-secondary',
              )}
            >
              <Shield size={11} />
              <span>{t('home.heroCard.backedByMining')}</span>
            </Button>
          </div>
        </div>

        {/* Right column: ring + payout hint, centered vertically */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="md:hidden">{ringNode(65, 3)}</div>
          <div className="hidden md:block">{ringNode(68, 3.5)}</div>
          <div
            className={cn(
              'text-[10px] leading-tight mt-1 text-center',
              premiumDark ? 'text-white/40' : 'text-text-muted',
            )}
          >
            <div>{t('home.heroCard.daysToPayoutShort')}</div>
            <div>{formatDate(nextPayout.date)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
