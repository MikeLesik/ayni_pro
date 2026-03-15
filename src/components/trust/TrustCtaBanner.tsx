import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';
import { trustData } from '@/services/mock/data/trust';

export function TrustCtaBanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="rounded-xl p-8 text-center" style={{ background: 'var(--color-primary)' }}>
      <h2 className="font-display text-xl md:text-2xl text-white">{t('trust.cta.title')}</h2>
      <p className="text-sm text-white/70 mt-2">
        {t('trust.cta.subtitle', { count: trustData.miningStatus.totalParticipants })}
      </p>
      <Button
        variant="gold-cta"
        size="lg"
        className="mt-4"
        rightIcon={<ArrowRight size={16} />}
        onClick={() => navigate('/participate')}
      >
        {t('trust.cta.button')}
      </Button>
    </section>
  );
}
