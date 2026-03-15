import { Pickaxe, MapPin, Users } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { trustData } from '@/services/mock/data/trust';

export function TrustHero() {
  const { t } = useTranslation();
  const { miningOperations: ops, miningStatus } = trustData;

  const formatKg = (g: number) => (g >= 1000 ? `${(g / 1000).toFixed(1)} kg` : `${g.toFixed(0)} g`);

  const stats = [
    {
      icon: Pickaxe,
      value: formatKg(ops.totalExtracted),
      label: t('trust.hero.extracted'),
    },
    {
      icon: MapPin,
      value: '2',
      label: t('trust.hero.concessions'),
    },
    {
      icon: Users,
      value: String(miningStatus.totalParticipants),
      label: t('trust.hero.participants'),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-text-primary">
          {t('trust.page.title')}
        </h1>
        <p className="text-sm md:text-base text-text-secondary mt-1 max-w-[600px]">
          {t('trust.page.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-surface-card rounded-xl p-4 text-center border border-border-light"
          >
            <s.icon size={20} className="text-primary mx-auto mb-2" />
            <p className="text-xl md:text-2xl font-bold text-text-primary tabular-nums">
              {s.value}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
