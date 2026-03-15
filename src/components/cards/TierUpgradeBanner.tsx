import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useCardTier } from '@/stores/cardStore';
import { getNextCardUpgrade } from '@/lib/cardConfig';
import { useTranslation } from '@/i18n';

export function TierUpgradeBanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tier = useCardTier();
  const nextUpgrade = getNextCardUpgrade(tier);

  if (!nextUpgrade) return null;

  const benefitChips = nextUpgrade.privileges.benefits.slice(0, 3);

  return (
    <div
      className="rounded-xl p-5 mt-6"
      style={{ background: 'var(--color-gold-light)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{getTierIcon(tier)}</span>
        <ArrowRight size={14} className="text-text-muted" />
        <span className="text-lg">{getTierIcon(nextUpgrade.tier)}</span>
      </div>

      <h4 className="font-display text-base text-text-primary mb-1">
        {t('card.upgrade.unlockMore', { tier: nextUpgrade.tier.charAt(0).toUpperCase() + nextUpgrade.tier.slice(1) })}
      </h4>
      <p className="text-sm text-text-secondary mb-3">
        {nextUpgrade.unlockText}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {benefitChips.map((b) => (
          <span
            key={b}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-gold/30 text-text-primary bg-white/60"
          >
            {b}
          </span>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        rightIcon={<ArrowRight size={14} />}
        onClick={() => navigate('/participate')}
      >
        {t('card.upgrade.seeAllTiers')}
      </Button>
    </div>
  );
}

function getTierIcon(tier: string): string {
  switch (tier) {
    case 'explorer': return '\uD83E\uDDED';
    case 'contributor': return '\u26CF\uFE0F';
    case 'operator': return '\u2699\uFE0F';
    case 'principal': return '\uD83D\uDC51';
    default: return '\uD83E\uDDED';
  }
}
