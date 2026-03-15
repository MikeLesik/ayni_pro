import { Mountain, ShieldCheck, Building2, Truck, type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import { useIsDark } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';
import type { TranslationKey } from '@/i18n/en';

interface TrustCard {
  icon: LucideIcon;
  titleKey: TranslationKey;
  textKey: TranslationKey;
  links: { labelKey: TranslationKey; href: string }[];
}

const trustCards: TrustCard[] = [
  {
    icon: Mountain,
    titleKey: 'learn.trust.miningPartner.title',
    textKey: 'learn.trust.miningPartner.text',
    links: [{ labelKey: 'learn.trust.miningPartner.cta', href: '#' }],
  },
  {
    icon: ShieldCheck,
    titleKey: 'learn.trust.audits.title',
    textKey: 'learn.trust.audits.text',
    links: [
      { labelKey: 'learn.trust.audits.ctaPeckshield', href: '#' },
      { labelKey: 'learn.trust.audits.ctaCertik', href: '#' },
    ],
  },
  {
    icon: Building2,
    titleKey: 'learn.trust.legal.title',
    textKey: 'learn.trust.legal.text',
    links: [{ labelKey: 'learn.trust.legal.cta', href: '/terms' }],
  },
  {
    icon: Truck,
    titleKey: 'learn.trust.equipment.title',
    textKey: 'learn.trust.equipment.text',
    links: [{ labelKey: 'learn.trust.equipment.cta', href: '#' }],
  },
];

export function TrustSection() {
  const { t } = useTranslation();
  const isDark = useIsDark();

  return (
    <section id="trust" className="scroll-mt-24">
      <h2 className="text-lg font-semibold text-text-primary mb-3">
        {t('learn.trust.sectionTitle')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {trustCards.map((card) => (
          <Card key={card.titleKey} variant="stat" className="p-4">
            <div
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center mb-3',
                isDark ? 'bg-primary/15' : 'bg-primary/10',
              )}
            >
              <card.icon size={20} className="text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">{t(card.titleKey)}</h3>
            <p className="text-body-sm text-text-secondary mt-1 leading-relaxed">
              {t(card.textKey)}
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              {card.links.map((link) => (
                <a
                  key={link.labelKey}
                  href={link.href}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  {t(link.labelKey)} &rarr;
                </a>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
