import * as Tooltip from '@radix-ui/react-tooltip';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SellerRatingProps {
  completionRate: number;
  totalDeals: number;
  kycLevel: 'standard' | 'enhanced';
  className?: string;
}

export function SellerRating({
  completionRate,
  totalDeals,
  kycLevel,
  className,
}: SellerRatingProps) {
  const isEnhanced = kycLevel === 'enhanced';
  const completedDeals = Math.round((completionRate / 100) * totalDeals);

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className={cn('inline-flex items-center gap-1.5 text-sm', className)}>
            {/* KYC Badge */}
            {isEnhanced ? (
              <ShieldCheck size={16} className="shrink-0 text-gold-dark" />
            ) : (
              <CheckCircle size={16} className="shrink-0 text-success" />
            )}

            {/* Deal stats */}
            {totalDeals === 0 ? (
              <span className="text-text-secondary">Новый участник</span>
            ) : (
              <span className="text-text-secondary">
                Завершил{' '}
                <span className="font-semibold text-text-primary">
                  {completedDeals}/{totalDeals}
                </span>{' '}
                сделок
              </span>
            )}
          </div>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            className={cn(
              'rounded-lg bg-surface-card px-3 py-2 text-xs text-text-secondary',
              'shadow-md border border-border',
              'animate-in fade-in-0 zoom-in-95',
            )}
          >
            Все участники прошли верификацию KYC
            <Tooltip.Arrow className="fill-surface-card" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
