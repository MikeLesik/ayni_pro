import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Modal } from '@/components/ui/Modal';
import { useCardStore, useCardTier } from '@/stores/cardStore';
import { getCardPrivileges } from '@/lib/cardConfig';
import { useTranslation } from '@/i18n';
import { TierCardComparison } from './TierCardComparison';

export function CardSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);

  const contactless = useCardStore((s) => s.contactlessEnabled);
  const online = useCardStore((s) => s.onlinePaymentsEnabled);
  const atm = useCardStore((s) => s.atmEnabled);
  const notifications = useCardStore((s) => s.spendingNotifications);
  const autoTopUp = useCardStore((s) => s.autoTopUp);
  const toggleSetting = useCardStore((s) => s.toggleCardSetting);
  const setAutoTopUp = useCardStore((s) => s.setAutoTopUp);
  const setLifecycle = useCardStore((s) => s.setLifecycle);
  const resetAll = useCardStore((s) => s.resetAll);

  const tier = useCardTier();
  const privileges = getCardPrivileges(tier);

  return (
    <div className="max-w-lg mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/settings/cards')}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        {t('card.settings.back')}
      </button>

      <h2 className="font-display text-heading-2 text-text-primary mb-6">
        {t('card.settings.title')}
      </h2>

      {/* Payment Controls */}
      <Card variant="stat" className="!p-0 rounded-xl overflow-hidden">
        <SettingToggle
          label={t('card.settings.contactless')}
          value={contactless}
          onChange={() => toggleSetting('contactlessEnabled')}
        />
        <SettingToggle
          label={t('card.settings.online')}
          value={online}
          onChange={() => toggleSetting('onlinePaymentsEnabled')}
        />
        <SettingToggle
          label={t('card.settings.atm')}
          value={atm}
          onChange={() => toggleSetting('atmEnabled')}
        />
        <SettingToggle
          label={t('card.settings.notifications')}
          value={notifications}
          onChange={() => toggleSetting('spendingNotifications')}
          isLast
        />
      </Card>

      {/* Auto Top-Up */}
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mt-6 mb-2 px-1">
        {t('card.settings.autoTopup')}
      </h3>
      <Card variant="stat" className="!p-0 rounded-xl overflow-hidden">
        <SettingToggle
          label={t('card.settings.autoTopupEnable')}
          value={autoTopUp.enabled}
          onChange={() => setAutoTopUp({ enabled: !autoTopUp.enabled })}
          isLast={!autoTopUp.enabled}
        />
        {autoTopUp.enabled && (
          <div className="px-4 pb-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-text-muted mb-1 block">
                {t('card.settings.autoTopupThreshold')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">€</span>
                <input
                  type="number"
                  value={autoTopUp.threshold}
                  onChange={(e) => setAutoTopUp({ threshold: Math.max(50, Number(e.target.value)) })}
                  min={50}
                  max={1000}
                  className="w-full h-10 pl-8 pr-4 rounded-lg border border-border bg-surface-card text-text-primary text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-text-muted mb-1 block">
                {t('card.settings.autoTopupAmount')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">€</span>
                <input
                  type="number"
                  value={autoTopUp.amount}
                  onChange={(e) => setAutoTopUp({ amount: Math.max(50, Number(e.target.value)) })}
                  min={50}
                  className="w-full h-10 pl-8 pr-4 rounded-lg border border-border bg-surface-card text-text-primary text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <p className="text-[11px] text-text-muted mt-1">
                {t('card.settings.autoTopupSource')}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Limits */}
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mt-6 mb-2 px-1">
        {t('card.settings.yourLimits')}
      </h3>
      <Card variant="stat" className="rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-display text-base text-text-primary">
            {t('card.settings.tierLimits', { tier: tier.charAt(0).toUpperCase() + tier.slice(1) })}
          </span>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: getTierBadgeBg(tier), color: getTierBadgeColor(tier) }}
          >
            {tier}
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <LimitRow label={t('card.limits.dailySpending')} value={`€${privileges.dailySpendLimit.toLocaleString()}`} />
          <LimitRow label={t('card.limits.dailyAtm')} value={`€${privileges.dailyAtmLimit.toLocaleString()}`} />
          <LimitRow label={t('card.limits.monthlySpending')} value={`€${privileges.monthlySpendLimit.toLocaleString()}`} />
          <LimitRow label={t('card.limits.monthlyTopup')} value={`€${privileges.monthlyTopUpLimit.toLocaleString()}`} />
        </div>
        <button
          onClick={() => setComparisonOpen(true)}
          className="text-xs text-primary hover:underline mt-3 block"
        >
          {t('card.settings.compareTiers')}
        </button>
      </Card>

      {/* Card Management */}
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mt-8 mb-2 px-1">
        {t('card.settings.management')}
      </h3>
      <div className="space-y-3">
        <Button variant="ghost" fullWidth onClick={() => setReplaceOpen(true)}>
          {t('card.settings.replace')}
        </Button>
        <p className="text-xs text-text-muted px-1 -mt-1">
          {t('card.settings.replaceDesc')}
        </p>

        <Button variant="danger" fullWidth onClick={() => setCloseOpen(true)}>
          {t('card.settings.close')}
        </Button>
        <p className="text-xs text-text-muted px-1 -mt-1">
          {t('card.settings.closeDesc')}
        </p>
      </div>

      {/* Modals */}
      <TierCardComparison open={comparisonOpen} onClose={() => setComparisonOpen(false)} />

      <Modal open={replaceOpen} onClose={() => setReplaceOpen(false)} title={t('card.settings.replace')}>
        <p className="text-sm text-text-secondary mb-6">
          {t('card.settings.replaceConfirm')}
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setReplaceOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              setLifecycle('card_issuing');
              setReplaceOpen(false);
            }}
          >
            {t('card.settings.replace')}
          </Button>
        </div>
      </Modal>

      <Modal open={closeOpen} onClose={() => setCloseOpen(false)} title={t('card.settings.close')}>
        <p className="text-sm text-text-secondary mb-6">
          {t('card.settings.closeConfirm')}
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setCloseOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              resetAll();
              setCloseOpen(false);
              navigate('/settings/cards');
            }}
          >
            {t('card.settings.close')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────

function SettingToggle({
  label,
  value,
  onChange,
  isLast,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${
        !isLast ? 'border-b border-border-light' : ''
      }`}
    >
      <span className="text-sm text-text-primary">{label}</span>
      <Toggle checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function LimitRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary font-medium tabular-nums">{value}</span>
    </div>
  );
}

function getTierBadgeBg(tier: string): string {
  switch (tier) {
    case 'contributor': return '#F5EFD7';
    case 'operator': return '#E8F5EC';
    case 'principal': return '#E8F0F4';
    default: return '#F4F3EF';
  }
}

function getTierBadgeColor(tier: string): string {
  switch (tier) {
    case 'contributor': return '#8B6914';
    case 'operator': return '#1A5C32';
    case 'principal': return '#1B3A4B';
    default: return '#6B6B6B';
  }
}
