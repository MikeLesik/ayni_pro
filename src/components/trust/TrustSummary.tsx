import { ShieldCheck, Pickaxe, Users } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { trustData } from '@/services/mock/data/trust';

export function TrustSummary() {
  const { t } = useTranslation();
  const { miningStatus, miningOperations: ops } = trustData;

  const formatKg = (g: number) => (g >= 1000 ? `${(g / 1000).toFixed(1)} kg` : `${g.toFixed(0)} g`);

  const proofPoints = [
    {
      icon: Pickaxe,
      text: t('trust.summary.license'),
    },
    {
      icon: ShieldCheck,
      text: t('trust.summary.audits'),
    },
    {
      icon: Users,
      text: t('trust.summary.stats', {
        count: miningStatus.totalParticipants,
        gold: formatKg(ops.totalExtracted),
      }),
    },
  ];

  return (
    <div className="bg-surface-secondary rounded-xl p-4 flex flex-col gap-2">
      {proofPoints.map((point, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <point.icon size={16} className="text-primary shrink-0" />
          <span className="text-sm text-text-primary">{point.text}</span>
        </div>
      ))}
    </div>
  );
}
