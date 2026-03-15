import { CheckoutFlow } from '@/components/earn/CheckoutFlow';
import { useTranslation } from '@/i18n';

export default function CheckoutPage() {
  const { t } = useTranslation();
  return (
    <div className="pt-6 pb-24 md:pt-8">
      <h1 className="font-display text-heading-1 text-text-primary mb-8">
        {t('earn.checkout.title')}
      </h1>
      <CheckoutFlow />
    </div>
  );
}
