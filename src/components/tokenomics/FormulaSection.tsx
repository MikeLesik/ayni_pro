import { cn } from '@/lib/cn';
import { Accordion } from '@/components/ui/Accordion';
import { useTranslation } from '@/i18n';

const FEE_TABLE = [
  { level: '$100', rates: ['70%', '55%', '50%', '45%', '40%'] },
  { level: '$1,000', rates: ['70%', '50%', '45%', '40%', '35%'] },
  { level: '$5,000', rates: ['70%', '45%', '40%', '35%', '30%'] },
  { level: '$10,000', rates: ['\u2014', '40%', '35%', '30%', '27%'] },
  { level: '$100,000', rates: ['\u2014', '35%', '30%', '27%', '25%'] },
  { level: '$1,000,000', rates: ['\u2014', '30%', '27%', '25%', '20%'] },
];

export function FormulaSection() {
  const { t } = useTranslation();

  const feeTermColumns = [
    t('tokenomics.fee.col1mo'),
    t('tokenomics.fee.col12mo'),
    t('tokenomics.fee.col24mo'),
    t('tokenomics.fee.col36mo'),
    t('tokenomics.fee.col48mo'),
  ];

  const accordionItems = [
    {
      id: 'production',
      title: t('tokenomics.formula.block1Title'),
      content: (
        <div className="space-y-3">
          <p className="font-mono text-sm text-text-primary bg-surface-secondary rounded-lg p-3">
            {t('tokenomics.formula.block1Formula')}
          </p>
          <div className="space-y-1">
            {[
              {
                label: t('tokenomics.formula.block1ParamCapacity'),
                value: t('tokenomics.formula.block1ParamCapacityValue'),
              },
              {
                label: t('tokenomics.formula.block1ParamGold'),
                value: t('tokenomics.formula.block1ParamGoldValue'),
              },
              {
                label: t('tokenomics.formula.block1ParamHours'),
                value: t('tokenomics.formula.block1ParamHoursValue'),
              },
            ].map((p) => (
              <div key={p.label} className="flex justify-between text-sm">
                <span className="text-text-secondary">{p.label}</span>
                <span className="text-text-primary font-semibold">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'costs',
      title: t('tokenomics.formula.block2Title'),
      content: (
        <div className="space-y-3">
          <p className="font-mono text-sm text-text-primary bg-surface-secondary rounded-lg p-3">
            {t('tokenomics.formula.block2Formula')}
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">{t('tokenomics.formula.block2ParamOpex')}</span>
            <span className="text-text-primary font-semibold">
              {t('tokenomics.formula.block2ParamOpexValue')}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'successfee',
      title: t('tokenomics.formula.block3Title'),
      content: (
        <div className="space-y-4">
          <p className="font-mono text-sm text-text-primary bg-surface-secondary rounded-lg p-3">
            {t('tokenomics.formula.block3Formula')}
          </p>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-[13px] border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-primary text-text-on-primary text-xs font-semibold">
                  <th className="text-left px-3 py-2">{t('tokenomics.fee.levelLabel')}</th>
                  {feeTermColumns.map((col) => (
                    <th key={col} className="text-right px-3 py-2">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEE_TABLE.map((row, i) => (
                  <tr
                    key={row.level}
                    className={cn(
                      'border-b border-border',
                      i % 2 === 0 ? 'bg-surface-card' : 'bg-surface-secondary',
                    )}
                  >
                    <td className="px-3 py-2 text-text-secondary font-medium">{row.level}</td>
                    {row.rates.map((rate, j) => (
                      <td key={j} className="px-3 py-2 text-right text-text-secondary tabular-nums">
                        {rate}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[13px] text-text-secondary">{t('tokenomics.formula.block3Note')}</p>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="font-display text-[28px] text-text-primary mb-2">
        {t('tokenomics.formula.sectionTitle')}
      </h2>
      <p className="text-sm text-text-secondary mb-6">{t('tokenomics.formula.subtitle')}</p>

      <div className="bg-surface-secondary rounded-xl p-5 mb-6">
        <p className="font-mono text-sm text-text-primary">{t('tokenomics.formula.formula')}</p>
      </div>

      <Accordion items={accordionItems} allowMultiple />
    </div>
  );
}
