import { useState } from 'react';
import { ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';

import { trustData } from '@/services/mock/data/trust';

export function AuditsSection() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const { audits, token } = trustData;

  const handleCopy = () => {
    navigator.clipboard.writeText(token.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="audits" className="scroll-mt-24">
      <h2 className="font-display text-xl md:text-2xl text-text-primary mb-4">
        {t('trust.audits.title')}
      </h2>

      {/* Audit cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {audits.map((audit) => (
          <Card key={audit.name} variant="stat" className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  {audit.name === 'PeckShield'
                    ? t('trust.audits.peckshield')
                    : t('trust.audits.certik')}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              <Check size={14} className="text-success" />
              <span className="text-sm font-medium text-success">{t('trust.audits.passed')}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={audit.reportUrl ?? (audit as any).auditUrl ?? '#'}
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                {audit.name === 'PeckShield'
                  ? t('trust.audits.viewReport')
                  : t('trust.audits.viewAudit')}
                <ExternalLink size={12} />
              </a>
              {(audit as any).pageUrl && (
                <a
                  href={(audit as any).pageUrl}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                >
                  {t('trust.audits.certikPage')}
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Token info */}
      <Card variant="stat" className="p-5 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex gap-2">
            <span className="text-text-muted">{t('trust.audits.tokenName')}:</span>
            <span className="text-text-primary font-medium">{token.name}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-text-muted">{t('trust.audits.symbol')}:</span>
            <span className="text-text-primary font-medium">{token.symbol}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-text-muted">{t('trust.audits.standard')}:</span>
            <span className="text-text-primary font-medium">{token.standard}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-text-muted">{t('trust.audits.totalSupply')}:</span>
            <span className="text-text-primary font-medium">{token.totalSupply}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border-light">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-text-muted">{t('trust.audits.contract')}:</span>
            <code className="text-xs bg-surface-secondary px-2 py-1 rounded font-mono text-text-primary break-all">
              {token.contractAddress}
            </code>
            <button
              onClick={handleCopy}
              className="shrink-0 p-1.5 rounded hover:bg-surface-secondary text-text-muted hover:text-text-primary transition-colors"
              aria-label={t('trust.audits.copyAddress')}
            >
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            </button>
            {copied && <span className="text-xs text-success">{t('trust.audits.copied')}</span>}
            <a
              href={token.etherscanUrl}
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1 ml-auto"
            >
              {t('trust.audits.viewOnEtherscan')}
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </Card>
    </section>
  );
}
