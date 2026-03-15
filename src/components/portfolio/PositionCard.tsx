import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ExternalLink, Info, Store } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency, formatDate, formatNumber, formatInteger } from '@/lib/formatters';
import { cn } from '@/lib/cn';
import { useUiStore } from '@/stores/uiStore';
import { useCancelPosition } from '@/hooks/usePortfolio';
import { useTranslation } from '@/i18n';
import { Tooltip } from '@/components/ui/Tooltip';
import type { Position } from '@/types/portfolio';

interface PositionCardProps {
  position: Position;
  index?: number;
  className?: string;
}

export function PositionCard({ position, className }: PositionCardProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const advancedView = useUiStore((s) => s.advancedView);
  const cancelMutation = useCancelPosition();
  const { t } = useTranslation();

  const handleCancel = () => {
    cancelMutation.mutate(position.id, {
      onSuccess: () => setCancelOpen(false),
    });
  };

  return (
    <>
      <Card variant="position" className={cn(className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              {t('portfolio.positionCard.positionTitleFallback', {
                number: position.positionNumber,
              })}
            </h3>
            <p className="text-body-sm text-text-muted">
              {t('portfolio.positionCard.termAndEnd', {
                termMonths: position.termMonths,
                date: formatDate(position.endDate),
              })}
            </p>
          </div>
          <Badge
            status={position.status === 'active' ? 'active' : 'pending'}
            className="text-xs px-2 py-0.5"
          />
        </div>

        {/* Stats row — inline */}
        <div className="mt-2 flex flex-wrap gap-4">
          <div>
            <p className="text-body-sm text-text-muted">{t('portfolio.positionCard.invested')}</p>
            <p className="text-base font-semibold text-text-primary">
              {formatCurrency(position.participatedAmount)}
            </p>
          </div>
          <div>
            <p className="text-body-sm text-text-muted flex items-center gap-1">
              <Tooltip content={t('portfolio.positionCard.lockedTooltip')}>
                <span className="flex items-center gap-1 cursor-help">
                  {t('portfolio.positionCard.holding')}
                  <Info size={11} />
                </span>
              </Tooltip>
            </p>
            <p className="text-base font-semibold text-text-primary">
              {formatNumber(position.ayniAmount)} AYNI
            </p>
          </div>
          {Math.abs(position.currentValueUsd - position.participatedAmount) >= 0.01 && (
            <div>
              <p className="text-body-sm text-text-muted">
                {t('portfolio.positionCard.currentValue')}
              </p>
              <p className="text-base font-semibold text-text-primary">
                {formatCurrency(position.currentValueUsd)}
              </p>
            </div>
          )}
          <div>
            <p className="text-body-sm text-text-muted">{t('portfolio.positionCard.earned')}</p>
            <p className="text-base font-semibold text-success">
              {formatCurrency(position.distributedAmount)}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-2">
          <ProgressBar percent={position.progressPercent} height={4} />
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-xs text-text-secondary">
              {t('portfolio.positionCard.percentComplete', { percent: position.progressPercent })}
            </span>
            <span className="text-xs text-text-muted">
              {t('portfolio.positionCard.monthsRemaining', { months: position.monthsRemaining })}
            </span>
          </div>
        </div>

        {/* Payout with progress bar */}
        {position.nextPayoutDate && position.nextPayoutEstimate != null && (
          <div className="mt-1.5">
            <p className="text-xs text-text-secondary">
              {t('portfolio.positionCard.nextPayout', {
                date: formatDate(position.nextPayoutDate),
                amount: formatCurrency(position.nextPayoutEstimate),
              })}
            </p>
          </div>
        )}

        {/* Advanced details */}
        {advancedView && expanded && (
          <div className="mt-1.5 space-y-1 rounded-lg bg-surface-secondary p-3">
            <p className="text-mono-sm text-text-muted">
              {t('portfolio.positionCard.wallet')} {position.walletAddress}
            </p>
            <p className="text-mono-sm text-text-muted">
              AYNI: {formatInteger(position.ayniAmount)} &middot; PAXG: {position.paxgAmount}
            </p>
            <p className="text-mono-sm text-text-muted">
              {t('portfolio.positionCard.contract')} {position.contractAddress}
            </p>
          </div>
        )}

        {/* Expand toggle */}
        <div className="mt-1.5 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setExpanded(!expanded)}
            rightIcon={
              <ChevronDown
                size={14}
                className={cn('transition-transform duration-200', expanded && 'rotate-180')}
              />
            }
          >
            {expanded ? t('portfolio.positionCard.collapse') : t('portfolio.positionCard.expand')}
          </Button>
        </div>

        {/* Expanded section */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {/* After unlock info */}
              <div className="border-t border-border-light pt-3">
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-1.5">
                  {t('portfolio.positionCard.afterUnlock')}
                </p>
                <p className="text-body-sm text-text-secondary">
                  {t('portfolio.positionCard.afterUnlockDescription', {
                    amount: formatNumber(position.ayniAmount),
                  })}
                </p>
              </div>

              {/* Sell hint */}
              <div className="border-t border-border-light pt-3 mt-3">
                <p className="text-xs text-text-muted mb-2">
                  {t('portfolio.positionCard.sellHint')}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      navigate(`/participate/marketplace/create?positionId=${position.id}`)
                    }
                    rightIcon={<Store size={14} />}
                  >
                    {t('portfolio.positionCard.sellOnMarketplace')}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setCancelOpen(true)}>
                    {t('portfolio.positionCard.cancelPosition')}
                  </Button>
                  {advancedView && (
                    <Button variant="ghost" size="sm" rightIcon={<ExternalLink size={14} />}>
                      {t('portfolio.positionCard.viewOnChain')}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Cancel confirmation modal */}
      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title={t('portfolio.positionCard.cancelModalTitle')}
      >
        <p className="text-body-md text-text-secondary">
          {t('portfolio.positionCard.cancelWarning')}
        </p>

        {/* Penalty calculation */}
        <div className="mt-3 rounded-lg bg-surface-secondary p-3 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-text-muted">
              {t('portfolio.positionCard.cancelCurrentValue')}
            </span>
            <span className="text-text-primary tabular-nums">
              {formatNumber(position.ayniAmount)} AYNI
            </span>
          </div>
          <div className="flex justify-between text-error">
            <span>{t('portfolio.positionCard.cancelPenaltyFee')}</span>
            <span className="tabular-nums">−{formatNumber(position.ayniAmount * 0.05)} AYNI</span>
          </div>
          <hr className="border-border-light" />
          <div className="flex justify-between font-medium">
            <span className="text-text-secondary">
              {t('portfolio.positionCard.cancelYouReceive')}
            </span>
            <span className="text-text-primary tabular-nums">
              {formatNumber(position.ayniAmount * 0.95)} AYNI
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs text-text-muted">
          {t('portfolio.positionCard.cancelLossDistributions')}
        </p>

        <div className="mt-4 flex gap-3">
          <Button variant="secondary" onClick={() => setCancelOpen(false)} className="flex-1">
            {t('portfolio.positionCard.keepPosition')}
          </Button>
          <Button
            variant="danger"
            onClick={handleCancel}
            loading={cancelMutation.isPending}
            className="flex-1"
          >
            {t('portfolio.positionCard.confirmCancel')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
