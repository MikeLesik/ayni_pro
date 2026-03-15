import { Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { trustData } from '@/services/mock/data/trust';
import { useTranslation } from '@/i18n';
import { getLocale } from '@/lib/formatters';

export function OnChainWidget() {
  const { t } = useTranslation();
  const token = trustData.token;
  const reserves = trustData.reservesSnapshot;
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rows = [
    { label: t('trust.reserves.token'), value: `${token.name} (${token.symbol})` },
    { label: t('trust.reserves.standard'), value: token.standard },
    { label: t('trust.reserves.totalSupply'), value: token.totalSupply },
    { label: t('trust.reserves.onChainHolders'), value: String(reserves.onChainHolders) },
  ];

  const locale = getLocale();

  return (
    <Card variant="stat" className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <h3 className="text-sm font-semibold text-text-primary">{t('trust.reserves.onChainData')}</h3>
      </div>

      <div className="divide-y divide-border-light">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2.5 first:pt-0">
            <span className="text-sm text-text-secondary">{label}</span>
            <span className="text-sm font-medium text-text-primary">{value}</span>
          </div>
        ))}

        {/* Contract Address */}
        <div className="flex items-center justify-between py-2.5">
          <span className="text-sm text-text-secondary">{t('trust.reserves.contract')}</span>
          <div className="flex items-center gap-1.5">
            <code className="text-xs font-mono text-text-primary">
              {token.contractAddress.slice(0, 6)}...{token.contractAddress.slice(-4)}
            </code>
            <button
              type="button"
              onClick={() => handleCopy(token.contractAddress)}
              className="p-1 text-text-muted hover:text-primary transition-colors"
              aria-label={t('trust.reserves.copyAddress')}
            >
              <Copy size={12} />
            </button>
            {copied && <span className="text-[10px] text-success">{t('trust.reserves.copied')}</span>}
          </div>
        </div>

        {/* Reserve Wallet */}
        <div className="flex items-center justify-between py-2.5">
          <span className="text-sm text-text-secondary">{t('trust.reserves.reserveWallet')}</span>
          <div className="flex items-center gap-1.5">
            <code className="text-xs font-mono text-text-primary">
              {reserves.walletAddress.slice(0, 6)}...{reserves.walletAddress.slice(-4)}
            </code>
            <button
              type="button"
              onClick={() => handleCopy(reserves.walletAddress)}
              className="p-1 text-text-muted hover:text-primary transition-colors"
              aria-label={t('trust.reserves.copyWallet')}
            >
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-text-muted mt-3">
        {t('trust.reserves.lastUpdated', {
          date: new Date(reserves.lastUpdated).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        })}
      </p>
    </Card>
  );
}
