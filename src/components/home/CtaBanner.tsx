import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import { formatCurrency } from '@/lib/formatters';
import { getLevelForParticipation, getNextLevel } from '@/lib/mineConfig';
import { useUiStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface CtaBannerProps {
  positionCount?: number;
  availableBalance?: number;
  totalParticipated?: number;
  className?: string;
}

export function CtaBanner({
  positionCount = 0,
  availableBalance = 0,
  totalParticipated = 0,
  className,
}: CtaBannerProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const showGamification = useUiStore((s) => s.showGamification);

  let title: string;
  let subtitle: string;
  let buttonLabel: string;

  // Personalized CTA: show upgrade to next mine level when user has positions
  const currentLevel = getLevelForParticipation(totalParticipated);
  const nextLevel = getNextLevel(currentLevel.level);
  const gap = nextLevel ? nextLevel.minParticipation - totalParticipated : 0;
  const hasUpgradePath = showGamification && positionCount > 0 && nextLevel && gap > 0;

  if (positionCount === 0) {
    title = t('home.ctaBanner.title');
    subtitle = t('home.ctaBanner.subtitle');
    buttonLabel = t('home.ctaBanner.button');
  } else if (hasUpgradePath) {
    const levelName = t(`mine.levels.${nextLevel.level}` as TranslationKey);
    title = t('home.ctaBanner.titleUpgrade', {
      amount: formatCurrency(gap),
      level: levelName,
    });
    subtitle = t('home.ctaBanner.subtitleUpgrade');
    buttonLabel = t('home.ctaBanner.buttonUpgrade');
  } else if (availableBalance > 0) {
    title = t('home.ctaBanner.titleHasBalance', { amount: formatCurrency(availableBalance) });
    subtitle = t('home.ctaBanner.subtitle');
    buttonLabel = t('home.ctaBanner.buttonOpenPosition');
  } else {
    title = t('home.ctaBanner.titleNoBalance');
    subtitle = t('home.ctaBanner.subtitle');
    buttonLabel = t('home.ctaBanner.buttonAddFunds');
  }

  return (
    <div
      className={cn(
        'bg-primary text-white rounded-xl px-5 py-3.5 shadow-sm',
        'flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3',
        className,
      )}
    >
      <div className="text-center lg:text-left">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-body-sm opacity-80 mt-0.5">{subtitle}</p>
      </div>
      <Button
        variant="inverse"
        size="md"
        onClick={() =>
          navigate(hasUpgradePath ? `/participate?topup=${Math.ceil(gap)}` : '/participate')
        }
        className="lg:flex-shrink-0 max-lg:w-full"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
