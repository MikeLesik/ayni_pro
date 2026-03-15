import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  Lock,
  Calendar,
  Coins,
  Timer,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useListingDetail, usePurchaseListing } from '@/hooks/useMarketplace';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { formatCurrency, formatNumber, formatDate, formatGrams } from '@/lib/formatters';
import { cn } from '@/lib/cn';

const COMMISSION_RATE = 0.025;

type PaymentMethod = 'USDC' | 'USDT';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const { data: listing, isLoading, error } = useListingDetail(id!);
  const { purchase, isPurchasing } = usePurchaseListing();

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('USDC');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="pt-4 pb-24 md:pt-6">
        <SkeletonLoader variant="text" width="120px" />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,400px)] gap-6 lg:gap-8">
          <div className="space-y-4">
            <SkeletonLoader variant="heading" />
            <SkeletonLoader variant="card" height="200px" />
            <SkeletonLoader variant="card" height="120px" />
          </div>
          <SkeletonLoader variant="card" height="320px" />
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="pt-4 pb-24 md:pt-6 text-center">
        <p className="text-text-secondary">{t('marketplace.detail.notFound')}</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={() => navigate('/participate/marketplace')}
        >
          {t('marketplace.detail.backToListings')}
        </Button>
      </div>
    );
  }

  const fee = listing.askPriceUsdc * COMMISSION_RATE;
  const total = listing.askPriceUsdc + fee;
  const isDiscount = listing.priceDeviation < 0;
  const isPremium = listing.priceDeviation > 0;
  const deviationSign = listing.priceDeviation > 0 ? '+' : '';

  async function handlePurchase() {
    setPurchaseError(null);
    try {
      await purchase({ id: listing!.id, paymentMethod });
      setShowBuyModal(false);
      setShowSuccessPrompt(true);
    } catch (err) {
      setPurchaseError(err instanceof Error ? err.message : 'Purchase failed');
    }
  }

  return (
    <div className="pt-4 pb-24 md:pt-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/participate/marketplace')}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
      >
        <ArrowLeft size={16} />
        {t('marketplace.detail.backToListings')}
      </button>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,400px)] gap-6 lg:gap-8 items-start">
        {/* ── Left column (60%) ── */}
        <div className="min-w-0">
          {/* Title */}
          <h1 className="font-mono text-number-lg font-semibold text-text-primary leading-tight">
            {formatNumber(listing.ayniAmount, 0)} AYNI
          </h1>

          {/* Price + deviation */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-semibold text-text-primary">
              {formatCurrency(listing.askPriceUsdc)}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                isDiscount && 'bg-success-light text-success',
                isPremium && 'bg-warning-light text-warning',
                !isDiscount && !isPremium && 'bg-surface-secondary text-text-muted',
              )}
            >
              {deviationSign}
              {listing.priceDeviation.toFixed(1)}%
            </span>
          </div>

          {/* Divider */}
          <hr className="border-border-light my-5" />

          {/* Position History */}
          <h2 className="text-heading-3 font-semibold text-text-primary mb-3">
            {t('marketplace.detail.positionHistory')}
          </h2>
          <Card variant="stat" padding="md">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <Calendar size={16} className="shrink-0 text-text-muted mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted">{t('marketplace.detail.stakedSince')}</p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">
                    {formatDate(listing.positionHistory.stakedSince)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Coins size={16} className="shrink-0 text-text-muted mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted">{t('marketplace.detail.quartersPaid')}</p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">
                    {listing.positionHistory.quartersPaid}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Coins size={16} className="shrink-0 text-gold-dark mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted">
                    {t('marketplace.detail.totalPaxgEarned')}
                  </p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">
                    {formatGrams(listing.positionHistory.totalPaxgEarned)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Timer size={16} className="shrink-0 text-text-muted mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted">
                    {t('marketplace.detail.positionDuration')}
                  </p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">
                    {t('marketplace.detail.months', {
                      count: listing.positionHistory.positionDurationMonths,
                    })}
                  </p>
                </div>
              </div>
              {listing.positionType === 'active' &&
                listing.positionHistory.remainingMonths != null && (
                  <div className="flex items-start gap-2.5">
                    <Zap size={16} className="shrink-0 text-success mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted">
                        {t('marketplace.detail.remainingTerm')}
                      </p>
                      <p className="text-sm font-medium text-success mt-0.5">
                        {t('marketplace.detail.months', {
                          count: listing.positionHistory.remainingMonths,
                        })}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </Card>

          {/* Divider */}
          <hr className="border-border-light my-5" />

          {/* Seller info */}
          <h2 className="text-heading-3 font-semibold text-text-primary mb-3">
            {t('marketplace.detail.aboutSeller')}
          </h2>
          <div className="flex items-center gap-3">
            {listing.sellerKycLevel === 'enhanced' ? (
              <div className="flex items-center gap-1.5">
                <Shield size={16} className="text-gold-dark" />
                <Badge status="claimed" label={t('marketplace.detail.kycEnhanced')} />
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-success" />
                <Badge status="active" label={t('marketplace.detail.kycStandard')} />
              </div>
            )}
          </div>
          <div className="mt-2.5 space-y-1">
            <p className="text-sm font-semibold text-text-primary">{listing.sellerName}</p>
            <p className="text-xs text-text-secondary">
              {t('marketplace.detail.completionRate', { rate: listing.sellerCompletionRate })}
              {' · '}
              {t('marketplace.detail.totalDeals', { count: listing.sellerTotalDeals })}
            </p>
          </div>

          {/* Escrow status */}
          <div className="mt-5">
            <EscrowStatusIndicator reducedMotion={!!reducedMotion} t={t} />
          </div>
        </div>

        {/* ── Right column (40%) — purchase card ── */}
        <div className="lg:sticky lg:top-6">
          {/* Active position banner */}
          {listing.positionType === 'active' && listing.positionHistory.remainingMonths != null && (
            <div className="flex items-start gap-2.5 rounded-xl border border-success/20 bg-success-light/50 px-4 py-3 mb-4">
              <Zap size={16} className="shrink-0 text-success mt-0.5" />
              <div>
                <p className="text-sm font-medium text-success">
                  {t('marketplace.detail.activePositionBanner')}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  {t('marketplace.detail.activePositionHint', {
                    months: listing.positionHistory.remainingMonths,
                  })}
                </p>
              </div>
            </div>
          )}

          <Card variant="action" padding="lg">
            <h3 className="text-heading-3 font-semibold text-text-primary">
              {t('marketplace.detail.acquire', { amount: formatNumber(listing.ayniAmount, 0) })}
            </h3>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">{t('marketplace.detail.amount')}</span>
                <span className="font-medium text-text-primary">
                  {formatCurrency(listing.askPriceUsdc)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  {t('marketplace.detail.commission', { rate: '2.5' })}
                </span>
                <span className="font-medium text-text-primary">{formatCurrency(fee)}</span>
              </div>
              <hr className="border-border-light" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">
                  {t('marketplace.detail.total')}
                </span>
                <span className="font-mono text-lg font-semibold text-text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <Button
              variant="gold-cta"
              size="lg"
              fullWidth
              className="mt-5"
              rightIcon={<ArrowRight size={18} />}
              onClick={() => setShowBuyModal(true)}
            >
              {t('marketplace.detail.cta', { total: formatCurrency(total) })}
            </Button>

            <p className="text-xs text-text-muted text-center mt-3 leading-relaxed">
              {t('marketplace.detail.ctaHint')}
            </p>
          </Card>
        </div>
      </div>

      {/* ── Buy Confirm Modal ── */}
      <Modal
        open={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        title={t('marketplace.detail.confirmTitle')}
      >
        {/* Summary */}
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">{t('marketplace.detail.summaryAmount')}</span>
            <span className="font-medium text-text-primary">
              {formatNumber(listing.ayniAmount, 0)} AYNI
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">{t('marketplace.detail.summaryPrice')}</span>
            <span className="font-medium text-text-primary">
              {formatCurrency(listing.askPriceUsdc)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {t('marketplace.detail.commission', { rate: '2.5' })}
            </span>
            <span className="font-medium text-text-primary">{formatCurrency(fee)}</span>
          </div>
          <hr className="border-border-light" />
          <div className="flex justify-between font-semibold">
            <span className="text-text-primary">{t('marketplace.detail.total')}</span>
            <span className="text-text-primary">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="mt-5">
          <p className="text-sm font-medium text-text-primary mb-2">
            {t('marketplace.detail.paymentMethod')}
          </p>
          <div className="flex gap-2">
            {(['USDC', 'USDT'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={cn(
                  'flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                  paymentMethod === method
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-border bg-surface-card text-text-secondary hover:border-border-light',
                )}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {purchaseError && (
          <div className="mt-4 rounded-lg bg-error-light px-4 py-3 text-sm text-error">
            {purchaseError}
          </div>
        )}

        {/* Confirm button */}
        <Button
          variant="gold-cta"
          size="lg"
          fullWidth
          className="mt-5"
          loading={isPurchasing}
          onClick={handlePurchase}
        >
          {t('marketplace.detail.confirmPurchase')}
        </Button>
      </Modal>

      {/* ── Post-buy Success Prompt ── */}
      <Modal
        open={showSuccessPrompt}
        onClose={() => {
          setShowSuccessPrompt(false);
          navigate('/participate/marketplace');
        }}
        title={t('marketplace.detail.successTitle')}
      >
        <p className="text-sm text-text-secondary">
          {t('marketplace.detail.successMessage', { amount: formatNumber(listing.ayniAmount, 0) })}
        </p>

        <div className="flex flex-col gap-2.5 mt-5">
          <Button
            variant="gold-cta"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight size={18} />}
            onClick={() => {
              setShowSuccessPrompt(false);
              navigate('/participate');
            }}
          >
            {t('marketplace.detail.activateNow')}
          </Button>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => {
              setShowSuccessPrompt(false);
              navigate('/participate/marketplace');
            }}
          >
            {t('marketplace.detail.maybeLater')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

/* ── Escrow Status Indicator ── */
function EscrowStatusIndicator({
  reducedMotion,
  t,
}: {
  reducedMotion: boolean;
  t: (key: any, vars?: any) => string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-success-light/50 px-4 py-3">
      <motion.div
        animate={reducedMotion ? undefined : { scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="shrink-0"
      >
        <Lock size={20} className="text-success" />
      </motion.div>
      <div>
        <p className="text-sm font-medium text-success">{t('marketplace.detail.escrowLocked')}</p>
        <p className="text-xs text-text-muted mt-0.5">{t('marketplace.detail.escrowHint')}</p>
      </div>
    </div>
  );
}
