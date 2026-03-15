import { ReservesSummary } from './ReservesSummary';
import { ProductionAreaChart } from './ProductionAreaChart';
import { OnChainWidget } from './OnChainWidget';
import { ReservesAuditTimeline } from './ReservesAuditTimeline';

export function ProofOfReserves() {
  return (
    <div className="space-y-6">
      <ReservesSummary />
      <ProductionAreaChart />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OnChainWidget />
        <ReservesAuditTimeline />
      </div>
    </div>
  );
}
