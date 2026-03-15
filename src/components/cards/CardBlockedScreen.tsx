import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/i18n';

export function CardBlockedScreen() {
  const { t } = useTranslation();
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
        <ShieldAlert size={32} className="text-error" />
      </div>
      <h2 className="font-display text-2xl text-text-primary mb-2">
        {t('card.blocked.title')}
      </h2>
      <p className="text-text-secondary mb-4">
        {t('card.blocked.desc')}
      </p>
      <p className="text-sm text-text-muted">
        {t('card.blocked.hint')}
      </p>
    </div>
  );
}
