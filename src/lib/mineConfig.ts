import type { MineLevel, MineLevelConfig } from '@/types/mine';

export const MINE_LEVELS: MineLevelConfig[] = [
  {
    level: 1,
    name: 'Explorer',
    minParticipation: 100,
    maxParticipation: 999,
    description: 'A tent with a pickaxe by the river. One person panning for gold.',
    workers: 1,
    equipment: 'Basic pickaxe & pan',
    outputMultiplier: 1.0,
    illustrationId: 'explorer',
  },
  {
    level: 2,
    name: 'Prospector',
    minParticipation: 1000,
    maxParticipation: 4999,
    description: 'A small mine with 2-3 workers and a sluice box.',
    workers: 3,
    equipment: 'Sluice box & hand tools',
    outputMultiplier: 1.2,
    illustrationId: 'prospector',
  },
  {
    level: 3,
    name: 'Operation',
    minParticipation: 5000,
    maxParticipation: 24999,
    description: 'A base camp with an excavator, barracks, and conveyor belt.',
    workers: 8,
    equipment: 'Excavator & conveyor',
    outputMultiplier: 1.5,
    illustrationId: 'operation',
  },
  {
    level: 4,
    name: 'Mining Camp',
    minParticipation: 25000,
    maxParticipation: 99999,
    description: 'A quarry with multiple processing lines, warehouses, and generators.',
    workers: 15,
    equipment: 'Multi-line processing',
    outputMultiplier: 2.0,
    illustrationId: 'mining-camp',
  },
  {
    level: 5,
    name: 'Gold Empire',
    minParticipation: 100000,
    maxParticipation: null,
    description: 'A full-scale operation: multiple lines, helicopter, office building.',
    workers: 50,
    equipment: 'Full industrial complex',
    outputMultiplier: 3.0,
    illustrationId: 'gold-empire',
  },
];

export function getLevelForParticipation(totalParticipated: number): MineLevelConfig {
  for (let i = MINE_LEVELS.length - 1; i >= 0; i--) {
    if (totalParticipated >= MINE_LEVELS[i]!.minParticipation) return MINE_LEVELS[i]!;
  }
  return MINE_LEVELS[0]!;
}

export function getNextLevel(currentLevel: MineLevel): MineLevelConfig | null {
  return MINE_LEVELS.find((l) => l.level === currentLevel + 1) || null;
}

export function getProgressToNextLevel(
  totalParticipated: number,
  currentLevel: MineLevelConfig,
): number {
  const nextLevel = getNextLevel(currentLevel.level);
  if (!nextLevel) return 100;
  const range = nextLevel.minParticipation - currentLevel.minParticipation;
  const progress = totalParticipated - currentLevel.minParticipation;
  return Math.min(Math.round((progress / range) * 100), 100);
}
