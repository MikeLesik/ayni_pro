import { CreditCard, Wallet, Building2 } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/cn';

export function PaymentMethodsStrip({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <div className={cn('flex items-center gap-2 justify-center flex-wrap', className)}>
      <span className="text-sm text-text-muted">{t('earn.paymentMethods.accepted')}:</span>
      <CreditCard size={16} className="text-text-secondary" />
      <span className="text-sm text-text-secondary">{t('earn.paymentMethods.visaMc')}</span>
      <span className="text-text-muted">&middot;</span>
      <Wallet size={16} className="text-text-secondary" />
      <span className="text-sm text-text-secondary">{t('earn.paymentMethods.crypto')}</span>
      <span className="text-text-muted">&middot;</span>
      <Building2 size={16} className="text-text-secondary" />
      <span className="text-sm text-text-secondary">{t('earn.paymentMethods.wire')}</span>
    </div>
  );
}
