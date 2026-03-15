import { useSimulationStore } from '@/stores/simulation';
import { TIER_CONFIG } from '@/lib/tierConfig';

/** User is "premium" if their total locked AYNI reaches at least Contributor tier (5000 AYNI) */
export function usePremium(): boolean {
  const positions = useSimulationStore((s) => s.positions);
  const totalLocked = positions
    .filter((p) => p.status === 'active')
    .reduce((sum, p) => sum + p.ayniActivated, 0);
  return totalLocked >= TIER_CONFIG.contributor.minAYNI;
}
