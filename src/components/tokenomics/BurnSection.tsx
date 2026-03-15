import { Flame } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';
import { formatInteger } from '@/lib/formatters';

function formatNumberSpaced(n: number): string {
  return formatInteger(n).replace(/[,.\s]/g, ' ').trim();
}

export function BurnSection() {
  const { t } = useTranslation();

  // TODO: fetch from API
  const totalBurned = 0;
  const lastQuarterBurn = 0;
  const circulatingSupply = 806_451_613;
  const burnHistory: Array<{
    quarter: string;
    date: string;
    volume: number;
    txHash: string;
    supplyAfter: number;
  }> = [];

  const metrics = [
    {
      value: totalBurned,
      label: t('tokenomics.burn.totalBurned'),
      sublabel: t('tokenomics.burn.unit'),
    },
    {
      value: lastQuarterBurn,
      label: t('tokenomics.burn.lastQuarterBurn'),
      sublabel: t('tokenomics.burn.unit'),
    },
    {
      value: circulatingSupply,
      label: t('tokenomics.burn.circulatingSupply'),
      sublabel: t('tokenomics.burn.unit'),
    },
  ];

  return (
    <div>
      <h2 className="font-display text-[28px] text-text-primary mb-6">
        {t('tokenomics.burn.sectionTitle')}
      </h2>
      <div className="bg-surface-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
        <p className="text-sm text-text-secondary leading-relaxed">
          {t('tokenomics.burn.description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-surface-secondary rounded-xl p-4">
              <p className="text-[28px] font-semibold text-text-primary tabular-nums">
                {formatNumberSpaced(m.value)}
              </p>
              <p className="text-sm text-text-secondary mt-1">{m.label}</p>
              <p className="text-xs text-text-muted">{m.sublabel}</p>
              {m.value === 0 && (
                <p className="text-xs text-text-muted mt-2">{t('tokenomics.burn.firstBurnNote')}</p>
              )}
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-base font-semibold text-text-primary mb-4">
            {t('tokenomics.burn.historyTitle')}
          </h3>

          {burnHistory.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <Flame className="w-10 h-10 text-text-muted mb-3" />
              <p className="text-sm text-text-secondary max-w-xs">
                {t('tokenomics.burn.emptyTitle')}
              </p>
              <button className="mt-3 text-sm text-primary hover:underline" type="button">
                {t('tokenomics.burn.emptyLink')}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-text-on-primary text-xs font-semibold">
                    <th className="text-left px-3 py-2 rounded-tl-lg">
                      {t('tokenomics.burn.colQuarter')}
                    </th>
                    <th className="text-left px-3 py-2">{t('tokenomics.burn.colDate')}</th>
                    <th className="text-right px-3 py-2">{t('tokenomics.burn.colVolume')}</th>
                    <th className="text-left px-3 py-2">{t('tokenomics.burn.colTxHash')}</th>
                    <th className="text-right px-3 py-2 rounded-tr-lg">
                      {t('tokenomics.burn.colSupplyAfter')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {burnHistory.map((row, i) => (
                    <tr
                      key={row.txHash}
                      className={cn(
                        'border-b border-border',
                        i % 2 === 0 ? 'bg-surface-card' : 'bg-surface-secondary',
                      )}
                    >
                      <td className="px-3 py-2 text-text-secondary">{row.quarter}</td>
                      <td className="px-3 py-2 text-text-secondary">{row.date}</td>
                      <td className="px-3 py-2 text-right text-text-primary tabular-nums">
                        {formatNumberSpaced(row.volume)}
                      </td>
                      <td className="px-3 py-2">
                        <a
                          href={`https://etherscan.io/tx/${row.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[13px] text-info hover:underline"
                        >
                          {row.txHash.slice(0, 6)}...{row.txHash.slice(-4)}
                        </a>
                      </td>
                      <td className="px-3 py-2 text-right text-text-primary tabular-nums">
                        {formatNumberSpaced(row.supplyAfter)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-text-muted pt-4 border-t border-border">
          {t('tokenomics.burn.disclaimer')}
        </p>
      </div>
    </div>
  );
}
