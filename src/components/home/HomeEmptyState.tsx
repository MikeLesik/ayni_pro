import { useNavigate } from 'react-router-dom';
import { TrendingUp, Gem } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/cn';
import { formatInteger } from '@/lib/formatters';

interface HomeEmptyStateProps {
  totalParticipants: number;
  className?: string;
}

export function HomeEmptyState({ totalParticipants, className }: HomeEmptyStateProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <EmptyState
      illustration={
        <div className="w-[200px] h-[150px] bg-surface-secondary rounded-xl flex items-center justify-center gap-3">
          <TrendingUp className="w-10 h-10 text-primary" />
          <Gem className="w-10 h-10 text-primary" />
        </div>
      }
      title={t('home.ctaBanner.title')}
      description={t('home.ctaBanner.subtitle')}
      ctaLabel={t('home.ctaBanner.button')}
      onCtaClick={() => navigate('/participate')}
      socialProof={t('home.ctaBanner.socialProof', { count: formatInteger(totalParticipants) })}
      className={cn(className)}
    />
  );
}
