import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import { formatInteger } from '@/lib/formatters';
import { trustData } from '@/services/mock/data/trust';

export function StabilityFundSection() {
  const { t } = useTranslation();
  const fund = trustData.stabilityFund;

  return (
    <section id="stability-fund" className="scroll-mt-24">
      <h2 className="font-display text-xl md:text-2xl text-text-primary mb-4">
        {t('trust.stabilityFund.title')}
      </h2>

      {fund ? (
        <Card variant="stat" className="p-5">
          <p className="text-sm text-text-secondary mb-4">{t('trust.stabilityFund.description')}</p>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-text-muted">{t('trust.stabilityFund.fundSize')}:</span>
              <span className="text-text-primary font-semibold">${formatInteger(fund.size)}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-muted">{t('trust.stabilityFund.source')}:</span>
              <span className="text-text-primary">{t('trust.stabilityFund.sourceValue')}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-muted">{t('trust.stabilityFund.purpose')}:</span>
              <span className="text-text-primary">{t('trust.stabilityFund.purposeValue')}</span>
            </div>
          </div>
          <a
            href={fund.walletUrl}
            className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:underline"
          >
            {t('trust.stabilityFund.viewOnChain')}
            <ExternalLink size={14} />
          </a>
        </Card>
      ) : null}
    </section>
  );
}
