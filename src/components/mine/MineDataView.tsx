import { ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { useTranslation } from '@/i18n';
import { formatCurrency } from '@/lib/formatters';
import type { MineStats } from '@/types/mine';
import type { TranslationKey } from '@/i18n';

interface MineDataViewProps {
  stats: MineStats;
}

export function MineDataView({ stats }: MineDataViewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const levelKey = `mine.levels.${stats.currentLevel}` as TranslationKey;
  const translatedLevelName = t(levelKey);

  // Compute monthly estimate from daily × 30
  const monthlyGrams = stats.dailyProduction.goldGrams * 30;
  const monthlyUsd = stats.dailyProduction.usdValue * 30;

  const isMaxLevel = stats.currentLevel >= 5;
  const nextLevelKey = stats.nextLevelName
    ? (`mine.levels.${stats.currentLevel + 1}` as TranslationKey)
    : null;
  const translatedNextLevelName = nextLevelKey ? t(nextLevelKey) : null;

  return (
    <div className="flex flex-col gap-3">
      {/* Hero: Today's production */}
      <Card variant="stat" className="p-5 text-center">
        <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          {t('mine.dataView.todayProduction' as TranslationKey)}
        </p>
        <p className="font-display text-display-hero-mobile md:text-display-hero text-primary mt-1">
          {stats.dailyProduction.goldGrams.toFixed(4)}g
        </p>
        <p className="text-sm text-text-secondary mt-0.5">
          {formatCurrency(stats.dailyProduction.usdValue)}
        </p>
      </Card>

      {/* Summary row: week / month / since start */}
      <div className="grid grid-cols-3 gap-2">
        <Card variant="stat" className="p-3 text-center">
          <p className="text-[11px] text-text-muted">
            {t('mine.dataView.weeklyOutput' as TranslationKey)}
          </p>
          <p className="text-sm font-semibold text-text-primary mt-0.5">
            {stats.weeklyProduction.goldGrams.toFixed(3)}g
          </p>
          <p className="text-[11px] text-text-secondary">
            {formatCurrency(stats.weeklyProduction.usdValue)}
          </p>
        </Card>
        <Card variant="stat" className="p-3 text-center">
          <p className="text-[11px] text-text-muted">
            {t('mine.dataView.monthlyOutput' as TranslationKey)}
          </p>
          <p className="text-sm font-semibold text-text-primary mt-0.5">
            {monthlyGrams.toFixed(2)}g
          </p>
          <p className="text-[11px] text-text-secondary">{formatCurrency(monthlyUsd)}</p>
        </Card>
        <Card variant="stat" className="p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <p className="text-[11px] text-text-muted">
              {t('mine.dataView.totalOutput' as TranslationKey)}
            </p>
            <Tooltip content={t('mine.dataView.totalOutputTooltip' as TranslationKey)}>
              <button
                type="button"
                className="text-text-muted hover:text-text-secondary transition-colors"
              >
                <Info size={10} />
              </button>
            </Tooltip>
          </div>
          <p className="text-sm font-semibold text-text-primary mt-0.5">
            {stats.totalProduction.goldGrams.toFixed(2)}g
          </p>
          <p className="text-[11px] text-text-secondary">
            {formatCurrency(stats.totalProduction.usdValue)}
          </p>
        </Card>
      </div>

      {/* Details table: level, participation, power, extraction rate */}
      <Card variant="stat" className="p-4">
        <div className="divide-y divide-border-light">
          <div className="flex justify-between py-2.5 text-sm">
            <span className="text-text-secondary">{t('mine.dataView.level')}</span>
            <span className="text-text-primary font-medium">
              {stats.currentLevel} — {translatedLevelName}
            </span>
          </div>
          <div className="flex justify-between py-2.5 text-sm">
            <span className="text-text-secondary">{t('mine.dataView.totalParticipation')}</span>
            <span className="text-text-primary font-medium">
              {formatCurrency(stats.totalParticipated)}
            </span>
          </div>
          <div className="flex justify-between py-2.5 text-sm">
            <span className="text-text-secondary">
              {t('mine.dataView.power' as TranslationKey)}
            </span>
            <span className="text-text-primary font-medium">{stats.mineDetails.outputPerDay}</span>
          </div>
          <div className="flex justify-between py-2.5 text-sm">
            <span className="text-text-secondary">
              {t('mine.dataView.extractionRate' as TranslationKey)}
            </span>
            <span className="text-text-primary font-medium">{stats.mineDetails.efficiency}%</span>
          </div>
        </div>
      </Card>

      {/* Progress CTA — only if not max level */}
      {!isMaxLevel && stats.amountToNextLevel && translatedNextLevelName && (
        <Card variant="stat" className="p-4 border-dashed border-primary/30">
          <p className="text-sm text-text-secondary">
            {t('mine.dataView.progress' as TranslationKey, {
              amount: formatCurrency(stats.amountToNextLevel),
              name: translatedNextLevelName,
            })}
          </p>
          <Button
            variant="text"
            onClick={() => navigate('/participate')}
            className="mt-2.5 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
          >
            {t('mine.upgrade.button')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      )}
    </div>
  );
}
