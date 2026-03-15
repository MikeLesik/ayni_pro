import { useState } from 'react';
import { Copy, Share2, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';
import { useReferralStore } from '@/stores/referralStore';

export function ReferralHero() {
  const { t } = useTranslation();
  const referralCode = useReferralStore((s) => s.referralCode);
  const generateCode = useReferralStore((s) => s.generateCode);
  const [copied, setCopied] = useState(false);

  // Auto-generate code on first render
  if (!referralCode) generateCode();

  const link = `https://app.ayni.gold/ref/${referralCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: t('referral.shareTitle'),
        text: t('referral.shareText', { code: referralCode }),
        url: link,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <Card variant="action" className="p-5">
      <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
        {t('referral.yourCode')}
      </p>
      <div className="flex items-center gap-3 bg-surface-secondary rounded-lg px-4 py-3">
        <code className="flex-1 text-lg font-mono font-semibold text-text-primary tracking-wider">
          {referralCode}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="p-2 rounded-md hover:bg-surface-card transition-colors text-text-secondary hover:text-primary"
          aria-label={t('referral.copyLink')}
        >
          {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <Button variant="primary" className="flex-1" onClick={handleCopy}>
          {copied ? t('referral.copied') : t('referral.copyLink')}
        </Button>
        <Button variant="secondary" className="flex-1" onClick={handleShare}>
          <Share2 size={16} className="mr-1.5" />
          {t('referral.shareTitle')}
        </Button>
      </div>
    </Card>
  );
}
