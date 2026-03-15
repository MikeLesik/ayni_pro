import { Gem, ShieldCheck, Coins, Users } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { trustData } from '@/services/mock/data/trust';
import { formatNumber } from '@/lib/formatters';
import { useTranslation } from '@/i18n';

export function ReservesSummary() {
  const { t } = useTranslation();
  const r = trustData.reservesSnapshot;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        icon={<Gem size={16} />}
        iconColor="text-primary"
        label={t('trust.reserves.totalMined')}
        value={`${formatNumber(r.goldReservesGrams, 1)}g`}
      />
      <StatCard
        icon={<ShieldCheck size={16} />}
        iconColor="text-success"
        label={t('trust.reserves.coverageRatio')}
        value={`${(r.coverageRatio * 100).toFixed(1)}%`}
        trend="success"
      />
      <StatCard
        icon={<Coins size={16} />}
        iconColor="text-primary"
        label={t('trust.reserves.tokenBacking')}
        value={`${r.tokenBackingRatio}x`}
      />
      <StatCard
        icon={<Users size={16} />}
        iconColor="text-info"
        label={t('trust.reserves.onChainHolders')}
        value={String(r.onChainHolders)}
      />
    </div>
  );
}
