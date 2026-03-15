import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/i18n';
import { formatInteger } from '@/lib/formatters';

const ALLOCATION_DATA = [
  { key: 'sales', percent: 50, tokens: 403_225_806, color: '#1B3A4B' },
  { key: 'reserve', percent: 20, tokens: 161_290_323, color: '#3A8CC0' },
  { key: 'team', percent: 20, tokens: 161_290_323, color: '#C9A84C' },
  { key: 'advisor', percent: 5, tokens: 40_322_581, color: '#6B6B6B' },
  { key: 'community', percent: 5, tokens: 40_322_581, color: '#9B9B9B' },
];

function formatNumberSpaced(n: number): string {
  return formatInteger(n).replace(/[,.\s]/g, ' ').trim();
}

export function HeroSection() {
  const { t } = useTranslation();

  const allocationKeys = {
    sales: t('tokenomics.allocation.sales'),
    reserve: t('tokenomics.allocation.reserve'),
    team: t('tokenomics.allocation.team'),
    advisor: t('tokenomics.allocation.advisor'),
    community: t('tokenomics.allocation.community'),
  } as const;

  const params = [
    { label: t('tokenomics.hero.paramToken'), value: t('tokenomics.hero.paramTokenValue') },
    { label: t('tokenomics.hero.paramTicker'), value: t('tokenomics.hero.paramTickerValue') },
    { label: t('tokenomics.hero.paramStandard'), value: t('tokenomics.hero.paramStandardValue') },
    { label: t('tokenomics.hero.paramSupply'), value: t('tokenomics.hero.paramSupplyValue') },
  ];

  return (
    <div className="bg-surface-card rounded-2xl border border-border shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-[32px] text-text-primary">
            {t('tokenomics.hero.title')}
          </h2>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            {t('tokenomics.hero.subtitle')}
          </p>
          <div className="mt-5 space-y-2">
            {params.map((p) => (
              <div key={p.label} className="flex gap-2">
                <span className="text-[13px] text-text-muted">{p.label}</span>
                <span className="text-sm font-semibold text-text-primary">{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-[200px] h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ALLOCATION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="100%"
                  dataKey="percent"
                  stroke="var(--color-surface-card)"
                  strokeWidth={2}
                >
                  {ALLOCATION_DATA.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-1.5 w-full">
            {ALLOCATION_DATA.map((entry) => (
              <div key={entry.key} className="flex items-center gap-2 text-[13px]">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-text-secondary">
                  {allocationKeys[entry.key as keyof typeof allocationKeys]}
                </span>
                <span className="text-text-primary font-semibold ml-auto tabular-nums">
                  {entry.percent}%
                </span>
                <span className="text-text-muted tabular-nums">{formatNumberSpaced(entry.tokens)}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-text-muted italic mt-3 text-center">
            {t('tokenomics.hero.vestingNote')}
          </p>
        </div>
      </div>
    </div>
  );
}
