import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { useTranslation } from '@/i18n';

export function TrustFaq() {
  const { t } = useTranslation();

  const faqItems: AccordionItem[] = [
    { id: 'licensed', title: t('trust.faq.q1.title'), content: t('trust.faq.q1.content') },
    { id: 'verified', title: t('trust.faq.q2.title'), content: t('trust.faq.q2.content') },
    { id: 'gold-potential', title: t('trust.faq.q3.title'), content: t('trust.faq.q3.content') },
    { id: 'report', title: t('trust.faq.q4.title'), content: t('trust.faq.q4.content') },
    { id: 'on-chain', title: t('trust.faq.q5.title'), content: t('trust.faq.q5.content') },
    { id: 'blockchain', title: t('trust.faq.q6.title'), content: t('trust.faq.q6.content') },
    { id: 'contract-address', title: t('trust.faq.q7.title'), content: t('trust.faq.q7.content') },
    { id: 'environment', title: t('trust.faq.q8.title'), content: t('trust.faq.q8.content') },
    { id: 'legal-entities', title: t('trust.faq.q9.title'), content: t('trust.faq.q9.content') },
  ];

  return (
    <section id="trust-faq" className="scroll-mt-24">
      <h2 className="font-display text-xl md:text-2xl text-text-primary mb-4">
        {t('trust.faq.title')}
      </h2>
      <Accordion items={faqItems} />
    </section>
  );
}
