import type { MineLevel } from '@/types/mine';
import { usePremium } from '@/hooks/usePremium';
import { useTranslation } from '@/i18n';

interface MineHeaderProps {
  level: MineLevel;
  levelName: string;
}

export function MineHeader({ level, levelName }: MineHeaderProps) {
  const isPremium = usePremium();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
      <h1 className="font-display text-2xl text-text-primary leading-tight">
        {t('mine.header.title')}
      </h1>
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-base text-primary">
          {t('mine.header.levelDisplay', { level, name: levelName })}
        </h3>
        <span className="inline-flex items-center bg-primary-light text-primary rounded-full px-2 py-0.5 text-xs font-medium">
          {t('mine.header.levelBadge', { level })}
        </span>
        {isPremium && (
          <span className="inline-flex items-center bg-warning-light text-warning rounded-full px-2 py-0.5 text-xs font-medium gap-1">
            <span aria-hidden>⭐</span> {t('mine.header.premiumBadge')}
          </span>
        )}
      </div>
    </div>
  );
}
