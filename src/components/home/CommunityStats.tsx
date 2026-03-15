import { usePlatformStats } from '@/hooks/usePlatformStats';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { useTranslation } from '@/i18n';

export function CommunityStats() {
  const { t } = useTranslation();
  const { data, isLoading } = usePlatformStats();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface-secondary border border-border-light rounded-xl p-4 text-center"
          >
            <SkeletonLoader variant="number" width="60px" height="24px" className="mx-auto" />
            <SkeletonLoader variant="text" width="80px" className="mx-auto mt-1" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    { value: data.totalParticipants.toString(), label: t('home.community.totalParticipants') },
    { value: data.activePositions.toString(), label: t('home.community.activePositions') },
    {
      value: `${data.platformMiningPowerM3h.toFixed(1)} m³/h`,
      label: t('home.community.miningPower'),
      mono: true,
    },
    {
      value: `${data.avgParticipationMonths.toFixed(1)} ${t('home.community.months')}`,
      label: t('home.community.avgParticipation'),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-surface-secondary border border-border-light rounded-xl p-4 text-center"
        >
          <p className={`text-xl font-bold text-text-primary ${stat.mono ? 'font-mono' : ''}`}>
            {stat.value}
          </p>
          <p className="text-xs text-text-muted mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
