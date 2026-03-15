import { Accordion, type AccordionItem } from '@/components/ui/Accordion';
import { useTranslation } from '@/i18n';

export function FaqSection() {
  const { t } = useTranslation();

  // Learning-only FAQs (trust-related questions moved to /trust)
  const faqItems: AccordionItem[] = [
    {
      id: 'what-is-ayni',
      title: t('learn.faq.q1.title'),
      content: t('learn.faq.q1.content'),
    },
    {
      id: 'earnings-calculated',
      title: t('learn.faq.q2.title'),
      content: t('learn.faq.q2.content'),
    },
    {
      id: 'payout-schedule',
      title: t('learn.faq.q3.title'),
      content: t('learn.faq.q3.content'),
    },
    {
      id: 'withdraw-earnings',
      title: t('learn.faq.q5.title'),
      content: t('learn.faq.q5.content'),
    },
    {
      id: 'what-is-paxg',
      title: t('learn.faq.q6.title'),
      content: t('learn.faq.q6.content'),
    },
    {
      id: 'sell-ayni-tokens',
      title: t('learn.faq.q7.title'),
      content: t('learn.faq.q7.content'),
    },
    {
      id: 'ayni-token-price',
      title: t('learn.faq.q8.title'),
      content: t('learn.faq.q8.content'),
    },
  ];

  return (
    <section className="max-w-[720px] mx-auto">
      <h2 className="text-lg font-semibold text-text-primary mb-3">{t('learn.faq.title')}</h2>
      <Accordion items={faqItems} />
    </section>
  );
}
