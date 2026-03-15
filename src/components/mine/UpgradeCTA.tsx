import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/formatters';
import type { MineLevel } from '@/types/mine';
import { getNextLevel } from '@/lib/mineConfig';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n';

const equipmentKeyMap: Record<string, TranslationKey> = {
  'Basic pickaxe & pan': 'mine.equip.basicPickaxe',
  'Sluice box & hand tools': 'mine.equip.sluiceBox',
  'Excavator & conveyor': 'mine.equip.excavatorConveyor',
  'Multi-line processing': 'mine.equip.multiLine',
  'Full industrial complex': 'mine.equip.fullIndustrial',
};

interface UpgradeCTAProps {
  currentLevel: MineLevel;
  amountToNextLevel: number | null;
  nextLevelName: string | null;
}

export function UpgradeCTA({ currentLevel, amountToNextLevel, nextLevelName }: UpgradeCTAProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (currentLevel >= 5 || !amountToNextLevel || !nextLevelName) return null;

  const nextLevel = getNextLevel(currentLevel);

  return (
    <Card
      variant="stat"
      className="p-4 border-dashed border-primary/30 text-center md:text-left cta-border-pulse"
    >
      <h3 className="text-base font-semibold text-text-primary">{t('mine.upgrade.title')}</h3>
      <p className="text-sm text-text-secondary mt-1.5">
        {t('mine.upgrade.description', {
          amount: formatCurrency(amountToNextLevel),
          name: nextLevelName,
        })}
      </p>

      {nextLevel && (
        <p className="text-xs text-text-muted mt-1.5">
          {t('mine.upgrade.unlockHint', {
            workers: nextLevel.workers,
            equipment: equipmentKeyMap[nextLevel.equipment]
              ? t(equipmentKeyMap[nextLevel.equipment]!)
              : nextLevel.equipment,
          })}
        </p>
      )}

      <Button
        variant="gold-cta"
        className="mt-3 w-full md:w-auto text-sm h-11"
        rightIcon={<ArrowRight className="w-4 h-4" />}
        onClick={() => navigate(`/participate?topup=${Math.ceil(amountToNextLevel)}`)}
      >
        {t('mine.upgrade.button')}
      </Button>

      <style>{`
        .cta-border-pulse {
          animation: ctaBorderPulse 2.5s ease-in-out infinite;
        }
        @keyframes ctaBorderPulse {
          0%, 100% { border-color: rgba(27,58,75,0.2); }
          50% { border-color: rgba(27,58,75,0.4); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-border-pulse { animation: none; }
        }
      `}</style>
    </Card>
  );
}
