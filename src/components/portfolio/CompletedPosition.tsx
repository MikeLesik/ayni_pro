import { useNavigate } from 'react-router-dom';
import { ArrowRight, Store } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatNumber, formatInteger } from '@/lib/formatters';
import { cn } from '@/lib/cn';
import { useUiStore } from '@/stores/uiStore';
import { useTranslation } from '@/i18n';

import type { Position } from '@/types/portfolio';

interface CompletedPositionProps {
  position: Position;
  index?: number;
  onSellAyni?: (position: Position) => void;
  onWithdraw?: () => void;
  className?: string;
}

export function CompletedPosition({
  position,
  onSellAyni,
  onWithdraw,
  className,
}: CompletedPositionProps) {
  const navigate = useNavigate();
  const advancedView = useUiStore((s) => s.advancedView);
  const { t } = useTranslation();

  return (
    <Card variant="position" className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-heading-4 text-text-primary">
          {t('portfolio.completedPosition.positionTitle', { number: position.positionNumber })}
        </h3>
        <Badge status="completed" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
        <div>
          <p className="text-label-sm text-text-muted">
            {t('portfolio.completedPosition.invested')}
          </p>
          <p className="text-number-md text-text-primary">
            {formatCurrency(position.participatedAmount)}
          </p>
        </div>
        <div>
          <p className="text-label-sm text-text-muted">
            {t('portfolio.completedPosition.returned')}
          </p>
          <p className="text-number-md text-text-primary">
            {formatNumber(position.ayniAmount)} AYNI
          </p>
        </div>
        <div>
          <p className="text-label-sm text-text-muted">{t('portfolio.completedPosition.earned')}</p>
          <p className="text-number-md text-success">
            {formatCurrency(position.distributedAmount)}
          </p>
        </div>
        <div>
          <p className="text-label-sm text-text-muted">
            {t('portfolio.completedPosition.claimed')}
          </p>
          <p className="text-number-md text-text-primary">
            {formatCurrency(position.claimedAmount ?? 0)}
          </p>
        </div>
      </div>

      {/* What's next? */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-2">
          {t('portfolio.completedPosition.whatsNext')}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/participate')}
            rightIcon={<ArrowRight size={14} />}
          >
            {t('portfolio.completedPosition.restake')}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onSellAyni?.(position)}>
            {t('portfolio.completedPosition.sellAyni')}
          </Button>
          <Button variant="ghost" size="sm" onClick={onWithdraw}>
            {t('portfolio.completedPosition.withdraw')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/participate/marketplace/create?positionId=${position.id}`)}
            rightIcon={<Store size={14} />}
          >
            {t('portfolio.completedPosition.listOnMarketplace')}
          </Button>
        </div>
      </div>

      {/* Advanced details */}
      {advancedView && (
        <div className="space-y-1 rounded-lg bg-surface-secondary p-3">
          <p className="text-mono-sm text-text-muted">
            {t('portfolio.completedPosition.wallet')} {position.walletAddress}
          </p>
          <p className="text-mono-sm text-text-muted">
            AYNI: {formatInteger(position.ayniAmount)} &middot; PAXG: {position.paxgAmount}
          </p>
          <p className="text-mono-sm text-text-muted">
            {t('portfolio.completedPosition.contract')} {position.contractAddress}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-border-light pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/positions/${position.id}`)}
          rightIcon={<ArrowRight size={14} />}
        >
          {t('portfolio.completedPosition.viewDetails')}
        </Button>
      </div>
    </Card>
  );
}
