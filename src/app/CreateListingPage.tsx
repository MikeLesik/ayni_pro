import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { useSimulationStore } from '@/stores/simulation';
import { Button } from '@/components/ui/Button';
import { CreateListingForm } from './CreateListingPage/CreateListingForm';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('positionId') || '';
  const positions = useSimulationStore((s) => s.positions);

  const hasListablePositions = useMemo(
    () => positions.some((p) => p.status === 'active' || p.status === 'completed'),
    [positions],
  );

  // Empty state: no listable positions
  if (!hasListablePositions) {
    return (
      <div className="pt-4 pb-24 md:pt-6">
        <button
          onClick={() => navigate('/participate/marketplace')}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
        >
          <ArrowLeft size={16} />
          Назад
        </button>
        <div className="max-w-[640px] mx-auto text-center py-16">
          <Lock size={40} className="mx-auto text-text-muted mb-4" />
          <h2 className="text-heading-2 font-semibold text-text-primary mb-2">
            Нет доступных позиций
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Для создания предложения необходимо иметь активную или завершённую позицию с токенами
            AYNI.
          </p>
          <Button variant="secondary" onClick={() => navigate('/participate')}>
            Участвовать
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-24 md:pt-6">
      {/* Back */}
      <button
        onClick={() => navigate('/participate/marketplace')}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
      >
        <ArrowLeft size={16} />
        Назад
      </button>

      <CreateListingForm preselectedId={preselectedId} />
    </div>
  );
}
