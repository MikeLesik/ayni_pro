import type { TierLevel, TierConfig } from '@/types/tier';

export const TIER_CONFIG: Record<TierLevel, TierConfig> = {
  explorer: {
    level: 'explorer',
    label: 'tiers.explorer',
    minAYNI: 0,
    minMonths: 0,
    successFeeDiscount: 0,
    colorBorder: '#9B9B9B',
    colorBadgeBg: '#F4F3EF',
    iconName: 'Compass',
    perks: ['tiers.explorer.perk1', 'tiers.explorer.perk2', 'tiers.explorer.perk3'],
  },
  contributor: {
    level: 'contributor',
    label: 'tiers.contributor',
    minAYNI: 5000,
    minMonths: 6,
    successFeeDiscount: 5,
    colorBorder: '#C9A84C',
    colorBadgeBg: '#F5EFD7',
    iconName: 'Pickaxe',
    perks: [
      'tiers.contributor.perk1',
      'tiers.contributor.perk2',
      'tiers.contributor.perk3',
      'tiers.contributor.perk4',
    ],
  },
  operator: {
    level: 'operator',
    label: 'tiers.operator',
    minAYNI: 25000,
    minMonths: 12,
    successFeeDiscount: 10,
    colorBorder: '#2D8A4E',
    colorBadgeBg: '#E8F5EC',
    iconName: 'Settings',
    perks: [
      'tiers.operator.perk1',
      'tiers.operator.perk2',
      'tiers.operator.perk3',
      'tiers.operator.perk4',
      'tiers.operator.perk5',
    ],
  },
  principal: {
    level: 'principal',
    label: 'tiers.principal',
    minAYNI: 100000,
    minMonths: 24,
    successFeeDiscount: 15,
    colorBorder: '#1B3A4B',
    colorBadgeBg: '#E8F0F4',
    iconName: 'Crown',
    perks: [
      'tiers.principal.perk1',
      'tiers.principal.perk2',
      'tiers.principal.perk3',
      'tiers.principal.perk4',
      'tiers.principal.perk5',
      'tiers.principal.perk6',
    ],
  },
};

export const LIFETIME_GRAMS_THRESHOLDS: Record<TierLevel, number> = {
  explorer: 0,
  contributor: 4.63,
  operator: 54.67,
  principal: 588.76,
};
