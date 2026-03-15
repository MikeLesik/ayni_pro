import { useTranslation } from '@/i18n';
import { cn } from '@/lib/cn';
import { trustData } from '@/services/mock/data/trust';

export function MiningStatusBanner() {
  const { t } = useTranslation();
  const { miningStatus, miningStatusRosemary } = trustData;

  const statusLabel =
    miningStatus.status === 'active'
      ? t('trust.status.miningActive')
      : miningStatus.status === 'maintenance'
        ? t('trust.status.maintenance')
        : t('trust.status.paused');

  const sanHilarioMetrics = [
    {
      label: statusLabel,
      value: miningStatus.location,
      pulse: miningStatus.status === 'active',
      accent: 'text-primary',
    },
    { label: t('trust.status.participants'), value: String(miningStatus.totalParticipants) },
    { label: t('trust.status.concession'), value: miningStatus.concessionArea },
    { label: t('trust.status.operatingSince'), value: miningStatus.operatingSince },
    {
      label: t('trust.status.equipment'),
      value: t('trust.status.equipmentUnits', { count: miningStatus.equipmentUnits }),
    },
    { label: t('trust.status.licensed'), value: `INGEMMET #${miningStatus.licenseNumber}` },
  ];

  const rosemaryMetrics = [
    {
      label: t('trust.status.acquired'),
      value: `${miningStatusRosemary.name}, ${miningStatusRosemary.location}`,
      dot: true,
      accent: 'text-warning',
    },
    { label: t('trust.status.acquiredDate'), value: miningStatusRosemary.acquired },
    { label: t('trust.status.concession'), value: miningStatusRosemary.concessionArea },
    { label: t('trust.status.phase'), value: t('trust.data.preDevelopment') },
    { label: t('trust.status.equipment'), value: '—' },
    { label: t('trust.status.licensed'), value: miningStatusRosemary.authority },
  ];

  return (
    <div className="space-y-3">
      {/* San Hilario */}
      <div className="bg-surface-secondary rounded-xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sanHilarioMetrics.map((m, i) => (
            <div key={i}>
              <div className="flex items-center gap-1.5">
                {i === 0 && m.pulse && (
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
                )}
                <span className="text-xs text-text-muted uppercase tracking-wider">{m.label}</span>
              </div>
              <p className={cn('text-sm font-semibold text-text-primary mt-0.5', m.accent)}>
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Rosemary Uno */}
      <div className="bg-surface-secondary rounded-xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {rosemaryMetrics.map((m, i) => (
            <div key={i}>
              <div className="flex items-center gap-1.5">
                {i === 0 && m.dot && <span className="w-2 h-2 rounded-full bg-warning shrink-0" />}
                <span className="text-xs text-text-muted uppercase tracking-wider">{m.label}</span>
              </div>
              <p className={cn('text-sm font-semibold text-text-primary mt-0.5', m.accent)}>
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
