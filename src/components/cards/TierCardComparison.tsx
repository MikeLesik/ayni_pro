import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useCardTier } from '@/stores/cardStore';
import { CARD_PRIVILEGES } from '@/lib/cardConfig';
import type { AyniTier } from '@/lib/cardConfig';
import { useTranslation } from '@/i18n';

interface TierCardComparisonProps {
  open: boolean;
  onClose: () => void;
}

const TIERS: { key: AyniTier; minAyni: number; minMonths: number }[] = [
  { key: 'explorer', minAyni: 0, minMonths: 0 },
  { key: 'contributor', minAyni: 5000, minMonths: 6 },
  { key: 'operator', minAyni: 25000, minMonths: 12 },
  { key: 'principal', minAyni: 100000, minMonths: 24 },
];

function getTierLabel(tier: AyniTier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

export function TierCardComparison({ open, onClose }: TierCardComparisonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentTier = useCardTier();

  const ROWS: { label: string; getValue: (tier: AyniTier) => string }[] = [
    {
      label: t('card.comparison.card'),
      getValue: (ti) => {
        const p = CARD_PRIVILEGES[ti];
        if (p.cardType === 'none') return '—';
        if (p.cardType === 'virtual') return t('card.comparison.virtual');
        const material = p.physicalCardMaterial === 'gold-plated'
          ? t('card.comparison.goldPlated')
          : t('card.comparison.metal');
        return t('card.comparison.virtualPhysical', { material });
      },
    },
    {
      label: t('card.comparison.minAyni'),
      getValue: (ti) => {
        const tier = TIERS.find((x) => x.key === ti)!;
        return tier.minAyni === 0 ? '—' : tier.minAyni.toLocaleString();
      },
    },
    {
      label: t('card.comparison.minTerm'),
      getValue: (ti) => {
        const tier = TIERS.find((x) => x.key === ti)!;
        return tier.minMonths === 0 ? '—' : t('card.comparison.months', { n: tier.minMonths });
      },
    },
    {
      label: t('card.comparison.monthlyLimit'),
      getValue: (ti) => {
        const p = CARD_PRIVILEGES[ti];
        return p.monthlySpendLimit === 0 ? '—' : `€${(p.monthlySpendLimit / 1000).toFixed(0)}K`;
      },
    },
    {
      label: t('card.comparison.dailyLimit'),
      getValue: (ti) => {
        const p = CARD_PRIVILEGES[ti];
        return p.dailySpendLimit === 0 ? '—' : `€${(p.dailySpendLimit / 1000).toFixed(0)}K`;
      },
    },
    {
      label: t('card.comparison.atmDay'),
      getValue: (ti) => {
        const p = CARD_PRIVILEGES[ti];
        return p.dailyAtmLimit === 0 ? '—' : `€${p.dailyAtmLimit.toLocaleString()}`;
      },
    },
    {
      label: t('card.comparison.convFee'),
      getValue: (ti) => {
        const p = CARD_PRIVILEGES[ti];
        return p.conversionFeePercent === 0 ? '—' : `${p.conversionFeePercent}%`;
      },
    },
    {
      label: t('card.comparison.cashback'),
      getValue: (ti) => {
        const p = CARD_PRIVILEGES[ti];
        return p.cashbackPercent === 0 ? '—' : `${p.cashbackPercent}%`;
      },
    },
  ];

  return (
    <Modal open={open} onClose={onClose} title={t('card.comparison.title')}>
      <div className="overflow-x-auto -mx-2">
        {/* Mobile: swipeable cards */}
        <div className="md:hidden flex gap-4 px-2 pb-4 snap-x snap-mandatory overflow-x-auto">
          {TIERS.map((tier) => {
            const priv = CARD_PRIVILEGES[tier.key];
            const isCurrent = tier.key === currentTier;

            return (
              <div
                key={tier.key}
                className={`min-w-[260px] snap-center flex-shrink-0 rounded-xl border-2 p-4 ${
                  isCurrent ? 'border-gold bg-gold-light/20' : 'border-border'
                }`}
              >
                {/* Mini card */}
                <div
                  className="h-16 rounded-lg mb-3 relative overflow-hidden"
                  style={{ background: priv.cardGradient }}
                >
                  <span className="absolute top-2 left-3 text-white/80 font-display text-xs">AYNI</span>
                  <span className="absolute bottom-2 right-3 text-white/60 font-bold text-[10px] italic">VISA</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="font-display text-base text-text-primary">{getTierLabel(tier.key)}</span>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold text-gold bg-gold-light px-2 py-0.5 rounded-full">
                      {t('card.comparison.yourTier')}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  {ROWS.map((row) => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-text-muted">{row.label}</span>
                      <span className="text-text-primary font-medium">{row.getValue(tier.key)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: table */}
        <table className="hidden md:table w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-text-muted font-medium text-xs py-2 pr-4" />
              {TIERS.map((tier) => (
                <th
                  key={tier.key}
                  className={`text-center font-display text-sm py-2 px-2 ${
                    tier.key === currentTier ? 'text-gold' : 'text-text-primary'
                  }`}
                >
                  {getTierLabel(tier.key)}
                  {tier.key === currentTier && (
                    <div className="text-[10px] font-semibold text-gold mt-0.5">{t('card.comparison.yourTier')}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-t border-border-light">
                <td className="text-text-muted text-xs py-2 pr-4">{row.label}</td>
                {TIERS.map((tier) => (
                  <td
                    key={tier.key}
                    className={`text-center py-2 px-2 text-xs ${
                      tier.key === currentTier
                        ? 'bg-gold-light/10 font-medium text-text-primary'
                        : 'text-text-secondary'
                    }`}
                  >
                    {row.getValue(tier.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <Button
          variant="gold-cta"
          rightIcon={<ArrowRight size={14} />}
          onClick={() => {
            onClose();
            navigate('/participate');
          }}
        >
          {t('card.comparison.participate')}
        </Button>
      </div>
    </Modal>
  );
}
