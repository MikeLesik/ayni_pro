import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Tabs } from '@/components/ui/Tabs';
import { PositionCard } from './PositionCard';
import { CompletedPosition } from './CompletedPosition';
import { SellAyniModal } from './SellAyniModal';
import { useTranslation } from '@/i18n';
import type { Position } from '@/types/portfolio';

interface PositionTabsProps {
  positions: Position[];
  onWithdraw?: () => void;
  className?: string;
}

export function PositionTabs({ positions, onWithdraw, className }: PositionTabsProps) {
  const [activeTab, setActiveTab] = useState('active');
  const [sellPosition, setSellPosition] = useState<Position | null>(null);
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  const activePositions = positions.filter((p) => p.status === 'active');
  const completedPositions = positions.filter((p) => p.status === 'completed');

  const tabItems = [
    { id: 'active', label: t('portfolio.positionTabs.active'), count: activePositions.length },
    {
      id: 'completed',
      label: t('portfolio.positionTabs.completed'),
      count: completedPositions.length,
    },
  ];

  return (
    <div className={className}>
      <Tabs
        items={tabItems}
        activeId={activeTab}
        onChange={setActiveTab}
        variant="underline"
        size="sm"
      />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeTab === 'active'
          ? activePositions.map((p, i) => (
              <motion.div
                key={p.id}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: reducedMotion ? 0 : i * 0.1 }}
              >
                <PositionCard position={p} />
              </motion.div>
            ))
          : completedPositions.map((p, i) => (
              <motion.div
                key={p.id}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: reducedMotion ? 0 : i * 0.1 }}
              >
                <CompletedPosition
                  position={p}
                  onSellAyni={setSellPosition}
                  onWithdraw={onWithdraw}
                />
              </motion.div>
            ))}
      </div>

      <SellAyniModal
        open={sellPosition !== null}
        onClose={() => setSellPosition(null)}
        position={sellPosition}
      />
    </div>
  );
}
