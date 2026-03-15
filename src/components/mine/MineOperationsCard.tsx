import { MapPin, Pickaxe, Calendar, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import { trustData } from '@/services/mock/data/trust';

const rows = [
  { icon: MapPin, key: 'mine.operations.location' as const, value: trustData.miningStatus.location },
  { icon: Pickaxe, key: 'mine.operations.concession' as const, value: trustData.miningStatus.concessionArea },
  { icon: Calendar, key: 'mine.operations.since' as const, value: trustData.miningStatus.operatingSince },
  { icon: FileText, key: 'mine.operations.license' as const, value: trustData.miningStatus.licenseNumber },
] as const;

export function MineOperationsCard() {
  const { t } = useTranslation();

  return (
    <Card variant="stat" className="p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-3">
        {t('mine.operations.title')}
      </h3>
      <div className="divide-y divide-border-light">
        {rows.map(({ icon: Icon, key, value }) => (
          <div key={key} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2 text-text-secondary">
              <Icon size={14} strokeWidth={1.5} />
              <span className="text-sm">{t(key)}</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between py-2.5 last:pb-0">
          <span className="text-sm text-text-secondary">{t('mine.operations.equipment')}</span>
          <span className="text-sm font-medium text-text-primary">
            {trustData.miningStatus.equipmentUnits}
          </span>
        </div>
      </div>
    </Card>
  );
}
