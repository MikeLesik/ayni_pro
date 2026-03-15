import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle, Clock, Shield, Zap } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';
import type { MarketplaceListing } from '@/types/marketplace';
import { Badge } from '@/components/ui/Badge';

interface ListingCardProps {
  listing: MarketplaceListing;
  onClick: () => void;
}

/** Map listing status → Badge status */
const statusBadgeMap: Record<
  MarketplaceListing['status'],
  { status: 'active' | 'pending' | 'completed' | 'locked'; labelKey: string }
> = {
  active: { status: 'active', labelKey: 'marketplace.listing.statusActive' },
  reserved: { status: 'pending', labelKey: 'marketplace.listing.statusReserved' },
  completed: { status: 'completed', labelKey: 'marketplace.listing.statusCompleted' },
  expired: { status: 'locked', labelKey: 'marketplace.listing.statusExpired' },
  cancelled: { status: 'locked', labelKey: 'marketplace.listing.statusCancelled' },
};

function daysUntil(isoDate: string): number {
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  const badge = statusBadgeMap[listing.status];
  const daysLeft = daysUntil(listing.expiresAt);
  const isDiscount = listing.priceDeviation < 0;
  const isPremium = listing.priceDeviation > 0;

  const deviationLabel = isDiscount
    ? t('marketplace.listing.discount')
    : isPremium
      ? t('marketplace.listing.premium')
      : t('marketplace.listing.atMarket');

  const deviationSign = listing.priceDeviation > 0 ? '+' : '';

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'bg-surface-card border border-border rounded-xl shadow-sm',
        'cursor-pointer transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
      )}
      whileHover={reducedMotion ? undefined : { y: -2, boxShadow: 'var(--shadow-md)' }}
      whileTap={reducedMotion ? undefined : { scale: 0.995 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* ── Header: KYC badge + Seller + Status ── */}
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-2 min-w-0">
          {listing.sellerKycLevel === 'enhanced' ? (
            <Shield size={16} className="shrink-0 text-gold-dark" />
          ) : (
            <CheckCircle size={16} className="shrink-0 text-success" />
          )}
          <span className="text-sm font-semibold text-text-primary truncate">
            {listing.sellerName}
          </span>
        </div>
        <Badge
          status={badge.status}
          label={t(badge.labelKey as any)}
          className="text-xs shrink-0 ml-2"
        />
      </div>

      {/* ── Price block ── */}
      <div className="px-4 pt-3">
        <p className="font-mono text-lg font-semibold text-text-primary leading-tight">
          {formatNumber(listing.ayniAmount, 0)} AYNI
        </p>

        <div className="flex items-baseline justify-between mt-1">
          <p className="text-base font-semibold text-text-primary">
            {formatCurrency(listing.askPriceUsdc)} USDC
          </p>

          <div className="text-right">
            <span
              className={cn(
                'text-sm font-semibold',
                isDiscount && 'text-success',
                isPremium && 'text-warning',
                !isDiscount && !isPremium && 'text-text-muted',
              )}
            >
              [{deviationSign}
              {listing.priceDeviation.toFixed(1)}%]
            </span>
            <p
              className={cn(
                'text-xs',
                isDiscount && 'text-success',
                isPremium && 'text-warning',
                !isDiscount && !isPremium && 'text-text-muted',
              )}
            >
              {deviationLabel}
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer: position history + expiry ── */}
      <div className="border-t border-border-light mt-3 px-4 py-3 flex flex-col gap-1.5">
        {listing.positionType === 'active' && listing.positionHistory.remainingMonths != null && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-success">
            <Zap size={13} className="shrink-0" />
            <span>
              {t('marketplace.listing.activePosition')} &middot;{' '}
              {t('marketplace.listing.remainingTerm', {
                months: listing.positionHistory.remainingMonths,
              })}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Clock size={13} className="shrink-0 text-text-muted" />
          <span>
            {t('marketplace.listing.positionAge', {
              months: listing.positionHistory.positionDurationMonths,
            })}{' '}
            &middot;{' '}
            {t('marketplace.listing.payouts', {
              count: listing.positionHistory.quartersPaid,
            })}
          </span>
        </div>
        <div className="text-xs text-text-muted">
          {t('marketplace.listing.expires', { days: daysLeft })}
        </div>
      </div>
    </motion.div>
  );
}
