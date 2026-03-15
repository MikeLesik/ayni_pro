import { useNavigate } from 'react-router-dom';
import type { DailyReward } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { useUiStore } from '@/stores/uiStore';
import { useTranslation } from '@/i18n';
import {
  formatCurrency,
  formatDate,
  formatGrams,
  formatNumber,
  formatPrice,
} from '@/lib/formatters';
import { ValueFlowTooltip } from '@/components/ui/ValueFlowTooltip';
import { Button } from '@/components/ui/Button';
import { Info } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DailyBreakdownProps {
  dailyRewards: DailyReward[];
  totalParticipatedAyni?: number;
  ayniPrice?: number;
  goldRewardsPaxg?: number;
  /** When true, renders without its own Card wrapper (used inside ChartJournalBlock) */
  embedded?: boolean;
  className?: string;
}

export function DailyBreakdown({
  dailyRewards,
  totalParticipatedAyni,
  ayniPrice,
  goldRewardsPaxg,
  embedded,
  className,
}: DailyBreakdownProps) {
  const advancedView = useUiStore((s) => s.advancedView);
  const miningDetailsExpanded = useUiStore((s) => s.miningDetailsExpanded);
  const toggleMiningDetails = useUiStore((s) => s.toggleMiningDetails);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const showDetails = miningDetailsExpanded;
  const showAyniBlock = advancedView || miningDetailsExpanded;

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-text-primary">
            {t('home.dailyBreakdown.title')}
          </h3>
          <Tooltip content={t('home.dailyBreakdown.tooltip')}>
            <button
              type="button"
              className="text-text-muted hover:text-text-secondary transition-colors"
              aria-label={t('home.dailyBreakdown.infoAriaLabel')}
            >
              <Info size={14} />
            </button>
          </Tooltip>
        </div>
        <Button variant="text" onClick={toggleMiningDetails} className="text-xs">
          {miningDetailsExpanded
            ? t('home.dailyBreakdown.hideDetails')
            : t('home.dailyBreakdown.showDetails')}
        </Button>
      </div>

      {/* AYNI balance block (visible when advancedView OR miningDetailsExpanded) */}
      {showAyniBlock &&
        totalParticipatedAyni != null &&
        ayniPrice != null &&
        goldRewardsPaxg != null && (
          <div className="mt-2 rounded-lg bg-surface-secondary p-3 space-y-0">
            <div className="flex items-center justify-between text-xs min-h-[28px]">
              <span className="flex items-center gap-1 text-text-muted">
                {t('home.dailyBreakdown.ayniBalance')}
                <ValueFlowTooltip />
              </span>
              <span className="text-text-primary font-medium tabular-nums">
                {formatNumber(totalParticipatedAyni)} AYNI
              </span>
            </div>
            <div className="flex items-center justify-between text-xs min-h-[28px]">
              <span className="text-text-muted">{t('home.dailyBreakdown.ayniPrice')}</span>
              <span className="text-text-primary font-medium tabular-nums">
                {formatPrice(ayniPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs min-h-[28px]">
              <span className="flex items-center gap-1 text-text-muted">
                {t('home.dailyBreakdown.goldRewards')}
                <ValueFlowTooltip />
              </span>
              <span className="text-text-primary font-medium tabular-nums">
                {goldRewardsPaxg.toFixed(5)} PAXG
              </span>
            </div>
          </div>
        )}

      {/* Table */}
      <div className="-mx-3 px-3 overflow-x-auto mt-2 sm:mx-0 sm:px-0">
        <table className={cn('w-full text-left', showDetails && 'min-w-[580px]')}>
          <thead>
            <tr>
              <th className="text-xs text-text-muted uppercase tracking-wide py-1.5 pr-3 font-medium whitespace-nowrap">
                {t('home.dailyBreakdown.date')}
              </th>
              <th className="text-xs text-text-muted uppercase tracking-wide py-1.5 pr-3 font-medium whitespace-nowrap">
                {t('home.dailyBreakdown.earned')}
              </th>
              {showDetails && (
                <>
                  <th className="text-xs text-text-muted uppercase tracking-wide py-1.5 pr-3 font-medium whitespace-nowrap">
                    <Tooltip content={t('home.dailyBreakdown.goldTooltip')}>
                      <span className="inline-flex items-center gap-0.5 cursor-help">
                        {t('home.dailyBreakdown.gold')}
                        <Info size={10} className="opacity-50" />
                      </span>
                    </Tooltip>
                  </th>
                  <th className="text-xs text-text-muted uppercase tracking-wide py-1.5 pr-3 font-medium whitespace-nowrap">
                    <Tooltip content={t('home.dailyBreakdown.costsTooltip')}>
                      <span className="inline-flex items-center gap-0.5 cursor-help">
                        {t('home.dailyBreakdown.costs')}
                        <Info size={10} className="opacity-50" />
                      </span>
                    </Tooltip>
                  </th>
                  <th className="text-xs text-text-muted uppercase tracking-wide py-1.5 pr-3 font-medium whitespace-nowrap">
                    <Tooltip content={t('home.dailyBreakdown.feeTooltip')}>
                      <span className="inline-flex items-center gap-0.5 cursor-help">
                        {t('home.dailyBreakdown.fee')}
                        <Info size={10} className="opacity-50" />
                      </span>
                    </Tooltip>
                  </th>
                  <th className="text-xs text-text-muted uppercase tracking-wide py-1.5 pr-3 font-medium whitespace-nowrap">
                    <Tooltip content={t('home.dailyBreakdown.netTooltip')}>
                      <span className="inline-flex items-center gap-0.5 cursor-help">
                        {t('home.dailyBreakdown.net')}
                        <Info size={10} className="opacity-50" />
                      </span>
                    </Tooltip>
                  </th>
                  <th className="text-xs text-text-muted uppercase tracking-wide py-1.5 font-medium whitespace-nowrap">
                    {t('home.dailyBreakdown.status')}
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {dailyRewards.map((reward) => (
              <tr key={reward.date} className="border-b border-border-light last:border-0">
                <td className="text-xs text-text-muted py-1.5 pr-3 whitespace-nowrap">
                  {formatDate(reward.date)}
                </td>
                <td className="text-xs font-medium text-text-primary py-1.5 pr-3 tabular-nums whitespace-nowrap">
                  {formatCurrency(reward.netRewardUsd)}
                </td>
                {showDetails && (
                  <>
                    <td className="text-xs text-text-primary py-1.5 pr-3 tabular-nums whitespace-nowrap">
                      {formatGrams(reward.goldMinedGrams)}
                    </td>
                    <td className="text-xs text-text-primary py-1.5 pr-3 tabular-nums whitespace-nowrap">
                      {formatCurrency(reward.extractionCostUsd)}
                    </td>
                    <td className="text-xs text-text-primary py-1.5 pr-3 tabular-nums whitespace-nowrap">
                      {formatCurrency(reward.platformFeeUsd)}
                    </td>
                    <td className="text-xs text-text-primary py-1.5 pr-3 tabular-nums whitespace-nowrap">
                      {formatGrams(reward.netRewardPaxg)}
                    </td>
                    <td className="py-1.5 whitespace-nowrap">
                      <StatusBadge status={reward.status} />
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View all link */}
      <Button
        variant="text"
        onClick={() => navigate('/activity?filter=distributions')}
        className="text-xs mt-2"
      >
        {t('common.viewAll')} &rarr;
      </Button>
    </>
  );

  if (embedded) return <div className={className}>{content}</div>;

  return (
    <Card variant="stat" className={cn('p-4 h-full', className)}>
      {content}
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();

  if (status === 'paid') {
    return (
      <Tooltip content={t('home.dailyBreakdown.statusPaidTooltip')}>
        <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium bg-success-light text-success cursor-help">
          {t('home.dailyBreakdown.statusPaid')}
        </span>
      </Tooltip>
    );
  }

  if (status === 'pending') {
    return (
      <Tooltip content={t('home.dailyBreakdown.statusPendingTooltip')}>
        <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium bg-info-light text-info cursor-help">
          {t('home.dailyBreakdown.statusPending')}
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={t('home.dailyBreakdown.statusAccruingTooltip')}>
      <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium bg-warning-light text-warning cursor-help">
        {t('home.dailyBreakdown.statusAccruing')}
      </span>
    </Tooltip>
  );
}
