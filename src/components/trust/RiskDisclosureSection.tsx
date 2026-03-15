import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n';

const riskRows: { risk: TranslationKey; desc: TranslationKey; mit: TranslationKey }[] = [
  {
    risk: 'trust.risks.miningOutput',
    desc: 'trust.risks.miningOutputDesc',
    mit: 'trust.risks.miningOutputMit',
  },
  {
    risk: 'trust.risks.goldPrice',
    desc: 'trust.risks.goldPriceDesc',
    mit: 'trust.risks.goldPriceMit',
  },
  {
    risk: 'trust.risks.tokenPrice',
    desc: 'trust.risks.tokenPriceDesc',
    mit: 'trust.risks.tokenPriceMit',
  },
  {
    risk: 'trust.risks.regulatory',
    desc: 'trust.risks.regulatoryDesc',
    mit: 'trust.risks.regulatoryMit',
  },
  {
    risk: 'trust.risks.operational',
    desc: 'trust.risks.operationalDesc',
    mit: 'trust.risks.operationalMit',
  },
  {
    risk: 'trust.risks.liquidity',
    desc: 'trust.risks.liquidityDesc',
    mit: 'trust.risks.liquidityMit',
  },
];

export function RiskDisclosureSection() {
  const { t } = useTranslation();

  return (
    <section id="disclosures" className="scroll-mt-24">
      <h2 className="font-display text-xl md:text-2xl text-text-primary mb-4">
        {t('trust.risks.title')}
      </h2>

      <Card variant="stat" className="p-5 overflow-hidden">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm min-w-[540px]">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left text-text-muted font-medium text-xs uppercase tracking-wider pb-2 pr-4">
                  {t('trust.risks.riskColumn')}
                </th>
                <th className="text-left text-text-muted font-medium text-xs uppercase tracking-wider pb-2 pr-4">
                  {t('trust.risks.descriptionColumn')}
                </th>
                <th className="text-left text-text-muted font-medium text-xs uppercase tracking-wider pb-2">
                  {t('trust.risks.mitigationColumn')}
                </th>
              </tr>
            </thead>
            <tbody>
              {riskRows.map((r, i) => (
                <tr key={i} className="border-b border-border-light last:border-0">
                  <td className="py-3 pr-4 text-text-primary font-medium align-top">{t(r.risk)}</td>
                  <td className="py-3 pr-4 text-text-secondary align-top">{t(r.desc)}</td>
                  <td className="py-3 text-text-secondary align-top">{t(r.mit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-text-muted mt-4 pt-4 border-t border-border-light leading-relaxed max-w-prose">
          {t('trust.risks.disclaimer')}
        </p>
      </Card>
    </section>
  );
}
