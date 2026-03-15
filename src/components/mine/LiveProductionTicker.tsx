import { Gem } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { formatCurrency } from '@/lib/formatters';
import { useTranslation } from '@/i18n';
import { useMine } from '@/hooks/useMine';

export function LiveProductionTicker() {
  const { t } = useTranslation();
  const { data: stats } = useMine();

  const dailyGrams = stats?.dailyProduction.goldGrams ?? 0;
  const dailyUsd = stats?.dailyProduction.usdValue ?? 0;

  return (
    <Card variant="action" className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-xs font-medium text-success uppercase tracking-wide">
          {t('mine.live.label')}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Gem className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-display text-2xl text-text-primary">
            <CountUpNumber value={dailyGrams} suffix="g" decimals={4} duration={3000} />
          </p>
          <p className="text-sm text-text-secondary">
            {t('mine.live.subtitle', { usd: formatCurrency(dailyUsd) })}
          </p>
        </div>
      </div>
    </Card>
  );
}
