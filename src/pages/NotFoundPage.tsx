import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-bg px-4">
      <h1 className="font-display text-display-hero-mobile md:text-display-hero text-text-primary">
        404
      </h1>
      <p className="mt-4 text-body-lg text-text-secondary">{t('notFound.title')}</p>
      <Button variant="primary" className="mt-8" onClick={() => navigate('/home')}>
        {t('notFound.goHome')}
      </Button>
    </div>
  );
}
