import { useState } from 'react';
import { motion } from 'framer-motion';
import { Snowflake, Wallet, Eye, EyeOff, Settings, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Modal } from '@/components/ui/Modal';
import { useCardStore, useCardTier } from '@/stores/cardStore';
import { getCardPrivileges } from '@/lib/cardConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation } from '@/i18n';
import { TopUpModal } from './TopUpModal';
import { TransactionList } from './TransactionList';
import { SpendingLimits } from './SpendingLimits';
import { TierUpgradeBanner } from './TierUpgradeBanner';
import { PhysicalCardSection } from './PhysicalCardSection';

export function CardDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const lifecycle = useCardStore((s) => s.lifecycle);
  const virtualCard = useCardStore((s) => s.virtualCard);
  const cardBalance = useCardStore((s) => s.cardBalance);
  const monthlySpent = useCardStore((s) => s.monthlySpent);
  const transactions = useCardStore((s) => s.transactions);
  const cardDetailsRevealed = useCardStore((s) => s.cardDetailsRevealed);
  const freezeCard = useCardStore((s) => s.freezeCard);
  const unfreezeCard = useCardStore((s) => s.unfreezeCard);
  const revealDetails = useCardStore((s) => s.revealDetails);
  const hideDetails = useCardStore((s) => s.hideDetails);

  const tier = useCardTier();
  const privileges = getCardPrivileges(tier);
  const isFrozen = lifecycle === 'frozen';

  const spendPercent = privileges.monthlySpendLimit > 0
    ? Math.min(100, (monthlySpent / privileges.monthlySpendLimit) * 100)
    : 0;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Card Visual */}
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={() => {
          if (cardDetailsRevealed) hideDetails();
          else revealDetails();
        }}
        className="cursor-pointer"
      >
        <GoldCardVisual
          card={virtualCard}
          gradient={privileges.cardGradient}
          tierLabel={privileges.cardLabel}
          showDetails={cardDetailsRevealed}
          isFrozen={isFrozen}
        />
      </motion.div>

      {/* Balance */}
      <div className="text-center mt-6">
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
          {t('card.dashboard.balance')}
        </span>
        <div className="font-display text-[40px] text-text-primary mt-1 tabular-nums">
          €{cardBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        {/* Spending bar */}
        <div className="max-w-xs mx-auto mt-2">
          <ProgressBar percent={spendPercent} height={4} />
          <p className="text-xs text-text-muted mt-1">
            {t('card.dashboard.ofMonth', { spent: monthlySpent.toLocaleString('en-US', { maximumFractionDigits: 0 }), limit: privileges.monthlySpendLimit.toLocaleString() })}
          </p>
        </div>

        <Button
          variant="gold-cta"
          size="md"
          className="mt-4"
          onClick={() => setTopUpOpen(true)}
          disabled={isFrozen}
        >
          {t('card.dashboard.topUp')}
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
        <QuickAction
          icon={<Snowflake size={18} />}
          label={isFrozen ? t('card.dashboard.unfreeze') : t('card.dashboard.freeze')}
          onClick={isFrozen ? unfreezeCard : freezeCard}
          active={isFrozen}
        />
        <QuickAction
          icon={cardDetailsRevealed ? <EyeOff size={18} /> : <Eye size={18} />}
          label={t('card.dashboard.details')}
          onClick={() => {
            if (cardDetailsRevealed) hideDetails();
            else {
              setDetailsOpen(true);
              revealDetails();
            }
          }}
        />
        <QuickAction
          icon={<Wallet size={18} />}
          label={t('card.dashboard.wallet')}
          onClick={() => {}}
        />
        <QuickAction
          icon={<Settings size={18} />}
          label={t('card.dashboard.settings')}
          onClick={() => navigate('/settings/card-settings')}
        />
        <QuickAction
          icon={<BarChart3 size={18} />}
          label={t('card.dashboard.limits')}
          onClick={() => setLimitsOpen(true)}
        />
      </div>

      {/* Frozen Banner */}
      {isFrozen && (
        <Card variant="stat" className="!border-warning/30 bg-warning-light">
          <div className="flex items-center gap-3">
            <Snowflake size={20} className="text-warning shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-primary">{t('card.dashboard.frozenTitle')}</p>
              <p className="text-xs text-text-muted">
                {t('card.dashboard.frozenDesc')}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Transactions */}
      <div className="mt-8">
        <TransactionList transactions={transactions} />
      </div>

      {/* Tier Upgrade Banner */}
      <TierUpgradeBanner />

      {/* Physical Card Section */}
      <PhysicalCardSection />

      {/* Modals */}
      <TopUpModal open={topUpOpen} onClose={() => setTopUpOpen(false)} />

      <Modal
        open={limitsOpen}
        onClose={() => setLimitsOpen(false)}
        title={t('card.dashboard.spendingLimits')}
      >
        <SpendingLimits />
      </Modal>

      <Modal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          hideDetails();
        }}
        title={t('card.dashboard.details')}
      >
        {virtualCard && (
          <div className="space-y-4">
            <DetailRow label={t('card.dashboard.cardNumber')} value={virtualCard.number} mono />
            <DetailRow label={t('card.dashboard.expiry')} value={virtualCard.expiry} mono />
            <DetailRow label={t('card.dashboard.cvv')} value={virtualCard.cvv} mono />
            <DetailRow label={t('card.dashboard.cardholder')} value={virtualCard.holderName} />
            <p className="text-[11px] text-text-muted mt-4">
              {t('card.dashboard.detailsAutoHide')}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── Card Visual ────────────────────────────────────────────────────────

function GoldCardVisual({
  card,
  gradient,
  tierLabel,
  showDetails,
  isFrozen,
}: {
  card: { number: string; last4: string; expiry: string; holderName: string } | null;
  gradient: string;
  tierLabel: string;
  showDetails: boolean;
  isFrozen: boolean;
}) {
  return (
    <div
      className="relative w-full max-w-[380px] mx-auto aspect-[1.586/1] rounded-2xl overflow-hidden shadow-lg select-none"
      style={{
        background: gradient,
        filter: isFrozen ? 'saturate(0.3) brightness(0.9)' : undefined,
      }}
    >
      {/* Shimmer */}
      {!isFrozen && (
        <div
          className="absolute inset-0 animate-gold-shimmer pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
          }}
        />
      )}

      {/* AYNI branding */}
      <div className="absolute top-5 left-6">
        <span className="text-white font-display text-xl tracking-wide">AYNI</span>
        <span className="text-white/60 text-[11px] block -mt-0.5">Gold Card</span>
      </div>

      {/* Visa logo */}
      <div className="absolute top-5 right-6">
        <span className="text-white/80 font-bold text-xl italic tracking-wider">VISA</span>
      </div>

      {/* Tier badge */}
      {tierLabel && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2">
          <span className="text-white/70 text-[10px] font-semibold uppercase tracking-widest">
            {tierLabel}
          </span>
        </div>
      )}

      {/* Chip */}
      <div
        className="absolute top-[40%] left-6 w-11 h-8 rounded-md"
        style={{
          background: isFrozen
            ? 'linear-gradient(135deg, #ddd 0%, #aaa 50%, #ddd 100%)'
            : 'linear-gradient(135deg, #f5efd7 0%, #c9a84c 50%, #f5efd7 100%)',
          border: '1px solid rgba(255,255,255,0.3)',
        }}
      />

      {/* Card number */}
      <div className="absolute bottom-12 left-6">
        <span className="text-white/80 font-mono text-sm tracking-[0.2em]">
          {showDetails && card
            ? card.number
            : `•••• •••• •••• ${card?.last4 ?? '••••'}`}
        </span>
      </div>

      {/* Holder + expiry */}
      <div className="absolute bottom-5 left-6 flex items-center gap-6">
        <span className="text-white/80 font-mono text-xs">
          {card?.holderName ?? ''}
        </span>
      </div>
      <div className="absolute bottom-5 right-6">
        <div>
          <span className="text-white/50 text-[9px] uppercase tracking-wider block">Expires</span>
          <span className="text-white/80 font-mono text-xs">
            {showDetails && card ? card.expiry : '••/••'}
          </span>
        </div>
      </div>

      {/* Frozen overlay */}
      {isFrozen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="text-white/30 text-4xl font-bold tracking-widest rotate-[-30deg]">
            FROZEN
          </span>
        </div>
      )}
    </div>
  );
}

// ── Quick Action ───────────────────────────────────────────────────────

function QuickAction({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 min-w-[64px] flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl
        border transition-colors duration-150 text-center
        ${
          active
            ? 'border-warning/40 bg-warning-light text-warning'
            : 'border-border bg-surface-card text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
        }
      `}
    >
      {icon}
      <span className="text-[11px] font-medium leading-tight">{label}</span>
    </button>
  );
}

// ── Detail Row ─────────────────────────────────────────────────────────

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-muted">{label}</span>
      <span className={`text-sm text-text-primary font-medium ${mono ? 'font-mono tracking-wider' : ''}`}>
        {value}
      </span>
    </div>
  );
}
