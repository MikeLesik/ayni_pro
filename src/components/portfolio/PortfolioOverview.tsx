import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';
import { Info, Wallet } from 'lucide-react';
import type { PortfolioSummary } from '@/types/portfolio';

interface PortfolioOverviewProps {
  summary: PortfolioSummary;
  onWithdraw?: (defaultTab?: 'paxg' | 'ayni') => void;
  onReinvest?: () => void;
  onStake?: () => void;
  onSellAyni?: () => void;
  className?: string;
}

const MIN_PARTICIPATION_USD = 100;

export function PortfolioOverview({
  summary,
  onWithdraw,
  onReinvest,
  onStake,
  onSellAyni,
  className,
}: PortfolioOverviewProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const hasClaimable = summary.claimablePaxg > 0;
  const hasAccruing = summary.accruingUsd > 0;
  const hasFreeBalance = summary.availableAyni > 0;
  const freeBalanceUsd = summary.availableBalance;
  const canActivate = freeBalanceUsd >= MIN_PARTICIPATION_USD;
  const neededForMin = MIN_PARTICIPATION_USD - freeBalanceUsd;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Row 1: Position Value + Free Balance (if exists) */}
      <div className="flex flex-col gap-2 lg:flex-row lg:gap-3">
        {/* Position Value card */}
        <Card variant="stat" padding="p-3" className="flex-1">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">
              {t('portfolio.overview.portfolioValue')}
            </p>
            <p className="font-display text-display-hero-mobile md:text-display-hero text-text-primary leading-none">
              <CountUpNumber value={summary.positionsValue} prefix="$" />
            </p>
          </div>
          <p className="mt-1.5 text-body-sm text-text-secondary">
            {t('portfolio.overview.activePositions', {
              count: summary.activeCount,
              s: summary.activeCount !== 1 ? 's' : '',
            })}
          </p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-body-sm text-success flex items-center gap-1">
              <span>
                {t('portfolio.overview.allTimeEarned')}{' '}
                {formatCurrency(summary.totalAccruedUsd ?? summary.totalDistributed)}
                {summary.positionsValue > 0 && (
                  <span className="text-text-muted ml-1">
                    (+
                    {(
                      ((summary.totalAccruedUsd ?? summary.totalDistributed) /
                        summary.positionsValue) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                )}
              </span>
              <Tooltip content={t('portfolio.overview.allTimeEarnedTooltip')}>
                <button
                  type="button"
                  className="text-text-muted hover:text-text-secondary transition-colors flex-shrink-0"
                >
                  <Info size={11} />
                </button>
              </Tooltip>
            </p>
            {summary.nextPayoutDate && (
              <p className="text-body-sm text-text-muted">
                {t('portfolio.overview.availableAfter', {
                  date: formatDate(summary.nextPayoutDate),
                })}
              </p>
            )}
          </div>
        </Card>

        {/* Free Balance card — only when user has unstaked AYNI */}
        {hasFreeBalance && (
          <Card variant="stat" padding="p-3" className="flex-1">
            <div className="flex items-center gap-1.5">
              <Wallet size={14} className="text-text-muted" />
              <p className="text-xs text-text-muted uppercase tracking-wider">
                {t('portfolio.freeBalance.title')}
              </p>
            </div>
            <p className="mt-1 text-xl font-semibold text-text-primary">
              {formatCurrency(freeBalanceUsd)}
            </p>
            <p className="text-body-sm text-text-muted">
              {formatNumber(summary.availableAyni, 2)} AYNI
            </p>
            <div className="flex gap-1.5 flex-wrap mt-2">
              {canActivate ? (
                <Button variant="primary" size="sm" onClick={onStake}>
                  {t('portfolio.freeBalance.activateButton')}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    navigate(`/participate?topup=${Math.ceil(neededForMin)}&activate=0`)
                  }
                >
                  {t('portfolio.freeBalance.topUpLink')}
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={() => onWithdraw?.('ayni')}>
                {t('portfolio.freeBalance.withdrawButton')}
              </Button>
              <Tooltip content={t('portfolio.freeBalance.sellButtonTooltip')}>
                <Button variant="secondary" size="sm" onClick={onSellAyni}>
                  {t('portfolio.freeBalance.sellButton')}
                </Button>
              </Tooltip>
            </div>

            {/* Status hint */}
            <div className="mt-2">
              {canActivate ? (
                <Tooltip content={t('portfolio.freeBalance.readyToActivateTooltip')}>
                  <span>
                    <Badge status="active" label={t('portfolio.freeBalance.readyToActivate')} />
                  </span>
                </Tooltip>
              ) : (
                <p className="text-xs text-text-muted">
                  {t('portfolio.freeBalance.topUpHint', { amount: formatCurrency(neededForMin) })}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* If no free balance, keep the Available+Accruing card in the same row */}
        {!hasFreeBalance && (
          <Card variant="stat" padding="p-3" className="flex-1">
            {/* Available to Withdraw */}
            <div className="flex items-center gap-1">
              <p className="text-xs text-text-muted uppercase tracking-wider">
                {t('portfolio.overview.available')}
              </p>
              <Tooltip content={t('portfolio.overview.goldRewardsTooltip')}>
                <button
                  type="button"
                  className="text-text-muted hover:text-text-secondary transition-colors"
                >
                  <Info size={11} />
                </button>
              </Tooltip>
            </div>
            <p
              className={cn(
                'mt-0.5 text-xl font-semibold',
                hasClaimable ? 'text-text-primary' : 'text-text-muted',
              )}
            >
              {hasClaimable ? formatCurrency(summary.claimableUsd) : '$0.00'}
            </p>
            <p className="text-body-sm text-text-muted">
              {hasClaimable
                ? `${summary.claimablePaxg.toFixed(4)} PAXG`
                : summary.nextPayoutDate
                  ? t('portfolio.overview.quarterlyPayoutInfo', {
                      date: formatDate(summary.nextPayoutDate),
                      amount: formatCurrency(summary.accruingUsd),
                    })
                  : t('portfolio.overview.availableEmpty')}
            </p>
            <div className="flex gap-1.5 flex-wrap mt-2">
              {hasClaimable ? (
                <>
                  <Button variant="secondary" size="sm" onClick={() => onWithdraw?.('paxg')}>
                    {t('portfolio.overview.withdraw')}
                  </Button>
                  <Tooltip content={t('portfolio.overview.reinvestTooltip')}>
                    <Button variant="secondary" size="sm" onClick={onReinvest}>
                      {t('portfolio.overview.reinvest')}
                    </Button>
                  </Tooltip>
                </>
              ) : (
                <Tooltip
                  content={t('portfolio.overview.noWithdrawTooltip', {
                    date: summary.nextPayoutDate ? formatDate(summary.nextPayoutDate) : '—',
                  })}
                >
                  <div className="flex gap-1.5">
                    <Button variant="secondary" size="sm" disabled>
                      {t('portfolio.overview.withdraw')}
                    </Button>
                    <Button variant="secondary" size="sm" disabled>
                      {t('portfolio.overview.reinvest')}
                    </Button>
                  </div>
                </Tooltip>
              )}
            </div>

            <hr className="my-2 border-border-light" />

            {/* Accruing This Quarter */}
            <div className="flex items-center gap-1">
              <p className="text-xs text-text-muted uppercase tracking-wider">
                {t('portfolio.overview.accruingThisQuarter')}
              </p>
              <Tooltip content={t('home.statsSandwich.thisQuarterTooltip')}>
                <button
                  type="button"
                  className="text-text-muted hover:text-text-secondary transition-colors"
                >
                  <Info size={11} />
                </button>
              </Tooltip>
            </div>
            <p
              className={cn(
                'mt-0.5 text-xl font-semibold',
                hasAccruing ? 'text-gold-dark' : 'text-text-muted',
              )}
            >
              {formatCurrency(summary.accruingUsd)}
            </p>
            <p className="text-body-sm text-text-muted">
              {summary.accruingPaxg.toFixed(4)} PAXG
              {summary.nextPayoutDate && (
                <>
                  {' '}
                  &middot;{' '}
                  {t('portfolio.overview.availableAfter', {
                    date: formatDate(summary.nextPayoutDate),
                  })}
                </>
              )}
            </p>
            <div className="mt-2">
              <Button variant="secondary" size="sm" onClick={() => navigate('/participate')}>
                {t('portfolio.overview.invest')}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Row 2: Available + Accruing (full width) — only when free balance card takes the right slot */}
      {hasFreeBalance && (
        <Card variant="stat" padding="p-3">
          {/* Available to Withdraw */}
          <div className="flex items-center gap-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">
              {t('portfolio.overview.available')}
            </p>
            <Tooltip content={t('portfolio.overview.goldRewardsTooltip')}>
              <button
                type="button"
                className="text-text-muted hover:text-text-secondary transition-colors"
              >
                <Info size={11} />
              </button>
            </Tooltip>
          </div>
          <p
            className={cn(
              'mt-0.5 text-xl font-semibold',
              hasClaimable ? 'text-text-primary' : 'text-text-muted',
            )}
          >
            {hasClaimable ? formatCurrency(summary.claimableUsd) : '$0.00'}
          </p>
          <p className="text-body-sm text-text-muted">
            {hasClaimable
              ? `${summary.claimablePaxg.toFixed(4)} PAXG`
              : summary.nextPayoutDate
                ? t('portfolio.overview.quarterlyPayoutInfo', {
                    date: formatDate(summary.nextPayoutDate),
                    amount: formatCurrency(summary.accruingUsd),
                  })
                : t('portfolio.overview.availableEmpty')}
          </p>
          <div className="flex gap-1.5 flex-wrap mt-2">
            {hasClaimable ? (
              <>
                <Button variant="secondary" size="sm" onClick={() => onWithdraw?.('paxg')}>
                  {t('portfolio.overview.withdraw')}
                </Button>
                <Tooltip content={t('portfolio.overview.reinvestTooltip')}>
                  <Button variant="secondary" size="sm" onClick={onReinvest}>
                    {t('portfolio.overview.reinvest')}
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Tooltip
                content={t('portfolio.overview.noWithdrawTooltip', {
                  date: summary.nextPayoutDate ? formatDate(summary.nextPayoutDate) : '—',
                })}
              >
                <div className="flex gap-1.5">
                  <Button variant="secondary" size="sm" disabled>
                    {t('portfolio.overview.withdraw')}
                  </Button>
                  <Button variant="secondary" size="sm" disabled>
                    {t('portfolio.overview.reinvest')}
                  </Button>
                </div>
              </Tooltip>
            )}
          </div>

          <hr className="my-2 border-border-light" />

          {/* Accruing This Quarter */}
          <div className="flex items-center gap-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">
              {t('portfolio.overview.accruingThisQuarter')}
            </p>
            <Tooltip content={t('home.statsSandwich.thisQuarterTooltip')}>
              <button
                type="button"
                className="text-text-muted hover:text-text-secondary transition-colors"
              >
                <Info size={11} />
              </button>
            </Tooltip>
          </div>
          <p
            className={cn(
              'mt-0.5 text-xl font-semibold',
              hasAccruing ? 'text-gold-dark' : 'text-text-muted',
            )}
          >
            {formatCurrency(summary.accruingUsd)}
          </p>
          <p className="text-body-sm text-text-muted">
            {summary.accruingPaxg.toFixed(4)} PAXG
            {summary.nextPayoutDate && (
              <>
                {' '}
                &middot;{' '}
                {t('portfolio.overview.availableAfter', {
                  date: formatDate(summary.nextPayoutDate),
                })}
              </>
            )}
          </p>
          <div className="mt-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/participate')}>
              {t('portfolio.overview.invest')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
