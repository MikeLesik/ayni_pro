import { Clock } from 'lucide-react';
import { useSimulationStore } from '@/stores/simulation';

interface CooldownBannerProps {
  /** ISO date when cooldown ends, or null if no active cooldown */
  cooldownEndDate: string | null;
}

export function CooldownBanner({ cooldownEndDate }: CooldownBannerProps) {
  const simulationDate = useSimulationStore((s) => s.simulationDate);

  if (!cooldownEndDate) return null;

  const nowMs = new Date(simulationDate).getTime();
  const diff = new Date(cooldownEndDate).getTime() - nowMs;
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  if (days <= 0) return null;

  return (
    <div
      role="alert"
      className="bg-warning-light border-l-4 border-warning rounded-r-xl px-4 py-3 flex items-start gap-3"
    >
      <Clock size={20} className="shrink-0 text-warning mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-text-primary">
          Период ожидания: осталось {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
        </p>
        <p className="text-xs text-text-secondary mt-0.5">
          После завершения позиции действует 7-дневный период ожидания
        </p>
      </div>
    </div>
  );
}
