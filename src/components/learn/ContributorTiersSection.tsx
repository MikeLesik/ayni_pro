import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Compass,
  Pickaxe,
  Settings,
  Crown,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { TierCard } from '@/components/ui/TierCard';
import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { cn } from '@/lib/cn';
import { formatInteger } from '@/lib/formatters';
import { TIER_CONFIG } from '@/lib/tierConfig';
import { TIER_ORDER } from '@/types/tier';
import { useTierData } from '@/hooks/useTierData';
import { useTranslation, type TranslationKey } from '@/i18n';
import type { LucideIcon } from 'lucide-react';

const TIER_ICONS: Record<string, LucideIcon> = {
  Compass,
  Pickaxe,
  Settings,
  Crown,
};

export function ContributorTiersSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { tierData } = useTierData();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const faqItems: AccordionItem[] = [
    {
      id: 'how-determined',
      title: t('contributorTiers.faq.howDetermined.title'),
      content: t('contributorTiers.faq.howDetermined.content'),
    },
    {
      id: 'lose-tier',
      title: t('contributorTiers.faq.loseTier.title'),
      content: t('contributorTiers.faq.loseTier.content'),
    },
    {
      id: 'what-is-mining-power',
      title: t('contributorTiers.faq.whatIsMiningPower.title'),
      content: t('contributorTiers.faq.whatIsMiningPower.content'),
    },
    {
      id: 'when-update',
      title: t('contributorTiers.faq.whenUpdate.title'),
      content: t('contributorTiers.faq.whenUpdate.content'),
    },
  ];

  return (
    <section>
      {/* Entry card in the tutorial list */}
      <Card
        variant="stat"
        hoverable
        className="cursor-pointer !p-0 overflow-hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="bg-gradient-to-br from-[#F5EFD7] to-[#E8F0F4] flex items-center justify-center h-32 rounded-t-[16px]">
          <Award className="w-8 h-8 text-primary" />
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-text-primary">
                {t('contributorTiers.title')}
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">{t('contributorTiers.subtitle')}</p>
            </div>
            {isExpanded ? (
              <ChevronUp size={16} className="text-text-muted shrink-0" />
            ) : (
              <ChevronDown size={16} className="text-text-muted shrink-0" />
            )}
          </div>
        </div>
      </Card>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4 space-y-6">
          {/* Block 1 — Personal status */}
          {tierData && (
            <div>
              <TierCard tierData={tierData} variant="compact" />
              <button
                type="button"
                className="text-[13px] text-primary mt-2 hover:underline"
                onClick={() => navigate('/positions')}
              >
                {t('contributorTiers.seeFullStatus')}
              </button>
            </div>
          )}

          {/* Block 2 — How Tiers Work */}
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              {t('contributorTiers.howTiersWork')}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t('contributorTiers.howTiersWorkP1')}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mt-3">
              {t('contributorTiers.howTiersWorkP2')}
            </p>
          </div>

          {/* Block 3 — Tier cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TIER_ORDER.map((tierLevel) => {
              const cfg = TIER_CONFIG[tierLevel];
              const Icon = TIER_ICONS[cfg.iconName] ?? Compass;
              const isCurrent = tierData?.currentTier === tierLevel;

              return (
                <div
                  key={tierLevel}
                  className={cn('rounded-2xl p-5')}
                  style={{
                    borderLeft: `4px solid ${cfg.colorBorder}`,
                    backgroundColor: cfg.colorBadgeBg,
                    boxShadow: isCurrent ? `0 0 0 2px #C9A84C` : undefined,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} style={{ color: cfg.colorBorder }} />
                    <span className="text-sm font-semibold" style={{ color: cfg.colorBorder }}>
                      {t(cfg.label as TranslationKey)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mb-3">
                    {cfg.minAYNI > 0
                      ? t('contributorTiers.tierRequirements', {
                          ayni: formatInteger(cfg.minAYNI),
                          months: cfg.minMonths,
                        })
                      : t('contributorTiers.noMinRequirements')}
                  </p>
                  <div className="space-y-1.5">
                    {cfg.perks.map((perk) => (
                      <div key={perk} className="flex items-start gap-1.5">
                        <CheckCircle size={12} className="text-success shrink-0 mt-0.5" />
                        <span className="text-xs text-text-secondary">
                          {t(perk as TranslationKey)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Block 4 — FAQ */}
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              {t('contributorTiers.faqTitle')}
            </h2>
            <Accordion items={faqItems} />
          </div>
        </div>
      )}
    </section>
  );
}
