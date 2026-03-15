import { Coins } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';
import { useLearnStore, LEARN_MODULES, TOTAL_POSSIBLE_AYNI } from '@/stores/learnStore';

export function LearnProgressSection() {
  const { t } = useTranslation();
  const completedModules = useLearnStore((s) => s.completedModules);
  const totalEarnedAyni = useLearnStore((s) => s.totalEarnedAyni);
  const claimAllPending = useLearnStore((s) => s.claimAllPending);
  const getPendingTotal = useLearnStore((s) => s.getPendingTotal);

  const completedCount = Object.keys(completedModules).length;
  const totalCount = LEARN_MODULES.length;
  const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const pendingReward = getPendingTotal();

  return (
    <Card variant="action" className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{t('learn.earn.title')}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{t('learn.earn.subtitle')}</p>
        </div>
        <div className="flex items-center gap-1.5 text-primary">
          <Coins size={16} />
          <span className="text-sm font-semibold">
            {totalEarnedAyni}/{TOTAL_POSSIBLE_AYNI} AYNI
          </span>
        </div>
      </div>

      <ProgressBar
        percent={percent}
        label={t('learn.earn.completed', {
          count: String(completedCount),
          total: String(totalCount),
        })}
      />

      {pendingReward > 0 && (
        <Button variant="primary" size="sm" className="mt-3 w-full" onClick={claimAllPending}>
          {t('learn.earn.claimAll', { amount: String(pendingReward) })}
        </Button>
      )}
    </Card>
  );
}
