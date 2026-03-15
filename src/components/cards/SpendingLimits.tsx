import { ProgressBar } from '@/components/ui/ProgressBar';
import { useCardStore, useCardTier } from '@/stores/cardStore';
import { getCardPrivileges, getNextCardUpgrade } from '@/lib/cardConfig';
import { useTranslation } from '@/i18n';

export function SpendingLimits() {
  const { t } = useTranslation();
  const dailySpent = useCardStore((s) => s.dailySpent);
  const monthlySpent = useCardStore((s) => s.monthlySpent);
  const monthlyToppedUp = useCardStore((s) => s.monthlyToppedUp);
  const tier = useCardTier();
  const privileges = getCardPrivileges(tier);
  const nextUpgrade = getNextCardUpgrade(tier);

  const limits = [
    {
      label: t('card.limits.dailySpending'),
      used: dailySpent,
      max: privileges.dailySpendLimit,
    },
    {
      label: t('card.limits.dailyAtm'),
      used: 0,
      max: privileges.dailyAtmLimit,
    },
    {
      label: t('card.limits.monthlySpending'),
      used: monthlySpent,
      max: privileges.monthlySpendLimit,
    },
    {
      label: t('card.limits.monthlyTopup'),
      used: monthlyToppedUp,
      max: privileges.monthlyTopUpLimit,
    },
  ];

  return (
    <div className="bg-surface-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <h4 className="font-display text-base text-text-primary">{t('card.limits.title')}</h4>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: getTierBadgeBg(tier), color: getTierBadgeColor(tier) }}
        >
          {tier}
        </span>
      </div>

      <div className="space-y-4">
        {limits.map((limit) => {
          const percent = limit.max > 0 ? Math.min(100, (limit.used / limit.max) * 100) : 0;
          const remaining = Math.max(0, limit.max - limit.used);

          return (
            <div key={limit.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text-secondary">{limit.label}</span>
                <span className="text-xs text-text-muted tabular-nums">
                  {formatEur(limit.used)} / {formatEur(limit.max)}
                </span>
              </div>
              <ProgressBar percent={percent} height={6} />
              <p className="text-xs text-text-muted mt-0.5">
                {t('card.limits.remaining', { amount: formatEur(remaining) })}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-text-muted mt-4">
        {t('card.limits.resetNote')}
      </p>

      {nextUpgrade && (
        <div className="mt-4 pt-4 border-t border-border-light">
          <p className="text-xs text-text-secondary">
            {t('card.limits.upgradeFor', { tier: nextUpgrade.tier.charAt(0).toUpperCase() + nextUpgrade.tier.slice(1) })}
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            {t('card.limits.upgradeDetails', {
              monthly: formatEur(getCardPrivileges(nextUpgrade.tier).monthlySpendLimit),
              daily: formatEur(getCardPrivileges(nextUpgrade.tier).dailySpendLimit),
            })}
            {getCardPrivileges(nextUpgrade.tier).cashbackPercent > 0
              ? t('card.limits.upgradeCashback', { percent: getCardPrivileges(nextUpgrade.tier).cashbackPercent })
              : ''}
          </p>
        </div>
      )}
    </div>
  );
}

function formatEur(amount: number): string {
  if (amount >= 1000) {
    return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `€${amount.toFixed(2)}`;
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
