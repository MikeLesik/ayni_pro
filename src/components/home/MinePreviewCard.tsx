import { Link } from 'react-router-dom';
import { Pickaxe } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useMine } from '@/hooks/useMine';
import { useTranslation } from '@/i18n';
import { formatCurrency } from '@/lib/formatters';

export function MinePreviewCard() {
  const { data: stats, isLoading } = useMine();
  const { t } = useTranslation();

  if (isLoading || !stats) return null;

  return (
    <Link
      to="/my-mine"
      className={cn(
        'bg-surface-card border border-border rounded-xl shadow-sm px-4 py-2.5',
        'flex items-center gap-2',
        'hover:shadow-md transition-shadow',
      )}
    >
      <Pickaxe size={16} className="text-primary shrink-0" />
      <span className="text-sm font-medium text-text-primary truncate">
        {t('home.minePreview.title')}
      </span>
      <span className="text-xs text-text-muted whitespace-nowrap">
        {stats.dailyProduction.goldGrams.toFixed(4)}g &middot;{' '}
        {formatCurrency(stats.dailyProduction.usdValue)}
      </span>
      <div className="w-16 h-1 bg-border rounded-full overflow-hidden shrink-0 hidden md:block">
        <div
          className="h-full rounded-full"
          style={{
            width: `${stats.progressToNextLevel}%`,
            background: 'var(--color-primary-gradient)',
          }}
        />
      </div>
      <span className="text-xs text-text-muted hidden md:inline">{stats.progressToNextLevel}%</span>
      <span className="flex-1" />
      <span className="text-xs text-primary shrink-0">&rsaquo;</span>
    </Link>
  );
}
