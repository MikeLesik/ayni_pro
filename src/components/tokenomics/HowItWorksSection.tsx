import { Pickaxe, Coins, Vote } from 'lucide-react';
import { useTranslation } from '@/i18n';

export function HowItWorksSection() {
  const { t } = useTranslation();

  const cards = [
    {
      icon: Pickaxe,
      title: t('tokenomics.howItWorks.card1Title'),
      text: t('tokenomics.howItWorks.card1Text'),
    },
    {
      icon: Coins,
      title: t('tokenomics.howItWorks.card2Title'),
      text: t('tokenomics.howItWorks.card2Text'),
    },
    {
      icon: Vote,
      title: t('tokenomics.howItWorks.card3Title'),
      text: t('tokenomics.howItWorks.card3Text'),
    },
  ];

  return (
    <div>
      <h2 className="font-display text-[28px] text-text-primary mb-6">
        {t('tokenomics.howItWorks.title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-surface-card rounded-2xl border border-border shadow-sm p-6"
          >
            <card.icon className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-base font-semibold text-text-primary mb-2">{card.title}</h3>
            <p className="text-[13px] text-text-secondary leading-[1.6]">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
