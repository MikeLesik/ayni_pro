import { Tabs } from '@/components/ui/Tabs';
import { useTranslation } from '@/i18n';
import type { ActivityFilter } from '@/types/activity';

interface ActivityFilterBarProps {
  activeFilter: ActivityFilter;
  onChange: (filter: ActivityFilter) => void;
  className?: string;
}

export function ActivityFilterBar({ activeFilter, onChange, className }: ActivityFilterBarProps) {
  const { t } = useTranslation();

  const filterTabs = [
    { id: 'all', label: t('activity.filter.all') },
    { id: 'earnings', label: t('activity.filter.distributions') },
    { id: 'payments', label: t('activity.filter.payments') },
    { id: 'payouts', label: t('activity.filter.payouts') },
    { id: 'system', label: t('activity.filter.system') },
  ] as const;

  return (
    <Tabs
      items={[...filterTabs]}
      activeId={activeFilter}
      onChange={(id) => onChange(id as ActivityFilter)}
      variant="pill"
      size="sm"
      className={className}
    />
  );
}
