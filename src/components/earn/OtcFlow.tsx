import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useEarnStore } from '@/stores/earnStore';
import { useTranslation } from '@/i18n';
import { formatCurrency } from '@/lib/formatters';
import { Shield, Clock, UserCheck } from 'lucide-react';
import { cn } from '@/lib/cn';

export function OtcFlow({ className }: { className?: string }) {
  const { t } = useTranslation();
  const amount = useEarnStore((s) => s.amount);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSubmitted(false);
  }, [amount]);

  if (submitted) {
    return (
      <Card variant="stat" className={cn('p-6 md:p-8 text-center', className)}>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="h-12 w-12 rounded-full bg-success-light flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-success" />
          </div>
          <h3 className="text-heading-3 text-text-primary">{t('earn.otc.successTitle')}</h3>
          <p className="text-body-md text-text-secondary max-w-sm">
            {t('earn.otc.successMessage', { amount: formatCurrency(amount) })}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="stat" className={cn('p-6 md:p-8', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-heading-3 text-text-primary">{t('earn.otc.title')}</h3>
      </div>
      <p className="text-body-md text-text-secondary mt-2">{t('earn.otc.description')}</p>

      {/* Amount display */}
      <div className="mt-6 p-4 rounded-lg bg-surface-secondary">
        <p className="text-body-sm text-text-muted">{t('earn.otc.amountLabel')}</p>
        <p className="text-number-lg text-text-primary mt-1">{formatCurrency(amount)}</p>
      </div>

      {/* Message field */}
      <div className="mt-4">
        <Input
          label={t('earn.otc.messageLabel')}
          placeholder={t('earn.otc.messagePlaceholder')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* CTA */}
      <Button
        variant="gold-cta"
        fullWidth
        className="h-14 mt-6 text-base"
        onClick={() => setSubmitted(true)}
      >
        {t('earn.otc.ctaButton')}
      </Button>

      {/* Trust note */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <Clock className="h-3.5 w-3.5 text-text-muted" />
        <p className="text-body-sm text-text-muted">{t('earn.otc.trustNote')}</p>
      </div>
    </Card>
  );
}
