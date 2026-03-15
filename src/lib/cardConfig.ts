// src/lib/cardConfig.ts
//
// Card privileges per existing AYNI tier.
// Tiers are defined in tierConfig.ts — this file only adds CARD-SPECIFIC attributes.

import type { TierLevel } from '@/types/tier';

export type AyniTier = TierLevel;

export interface CardPrivileges {
  canApplyForCard: boolean;
  cardType: 'none' | 'virtual' | 'virtual+physical';
  physicalCardMaterial: 'none' | 'metal' | 'gold-plated';
  monthlySpendLimit: number;
  dailySpendLimit: number;
  dailyAtmLimit: number;
  monthlyTopUpLimit: number;
  conversionFeePercent: number;
  cashbackPercent: number;
  cardGradient: string;
  cardLabel: string;
  benefits: string[];
}

export const CARD_PRIVILEGES: Record<AyniTier, CardPrivileges> = {
  explorer: {
    canApplyForCard: false,
    cardType: 'none',
    physicalCardMaterial: 'none',
    monthlySpendLimit: 0,
    dailySpendLimit: 0,
    dailyAtmLimit: 0,
    monthlyTopUpLimit: 0,
    conversionFeePercent: 0,
    cashbackPercent: 0,
    cardGradient: 'linear-gradient(135deg, #9B9B9B, #6B6B6B)',
    cardLabel: '',
    benefits: [],
  },

  contributor: {
    canApplyForCard: true,
    cardType: 'virtual',
    physicalCardMaterial: 'none',
    monthlySpendLimit: 10000,
    dailySpendLimit: 2000,
    dailyAtmLimit: 500,
    monthlyTopUpLimit: 10000,
    conversionFeePercent: 1.0,
    cashbackPercent: 0,
    cardGradient: 'linear-gradient(135deg, #C9A84C, #8B6914)',
    cardLabel: 'Contributor',
    benefits: [
      'Virtual Visa card',
      'Apple Pay & Google Pay',
      'Spend PAXG distributions at 150M+ merchants',
      'EUR & USD card currency',
    ],
  },

  operator: {
    canApplyForCard: true,
    cardType: 'virtual+physical',
    physicalCardMaterial: 'metal',
    monthlySpendLimit: 50000,
    dailySpendLimit: 10000,
    dailyAtmLimit: 2500,
    monthlyTopUpLimit: 50000,
    conversionFeePercent: 0.5,
    cashbackPercent: 0.5,
    cardGradient: 'linear-gradient(135deg, #2D8A4E, #1A5C32)',
    cardLabel: 'Operator',
    benefits: [
      'Virtual + Physical metal card',
      'Apple Pay & Google Pay',
      'Spend PAXG distributions at 150M+ merchants',
      '0.5% cashback in PAXG',
      'Reduced conversion fee (0.5%)',
      'Higher limits (€50K/month)',
      'Dedicated support channel',
    ],
  },

  principal: {
    canApplyForCard: true,
    cardType: 'virtual+physical',
    physicalCardMaterial: 'gold-plated',
    monthlySpendLimit: 200000,
    dailySpendLimit: 50000,
    dailyAtmLimit: 5000,
    monthlyTopUpLimit: 200000,
    conversionFeePercent: 0.25,
    cashbackPercent: 1.0,
    cardGradient: 'linear-gradient(135deg, #1B3A4B, #0D1F2B)',
    cardLabel: 'Principal',
    benefits: [
      'Virtual + Limited-edition gold-plated card',
      'Apple Pay & Google Pay',
      'Spend PAXG distributions at 150M+ merchants',
      '1% cashback in PAXG',
      'Lowest conversion fee (0.25%)',
      'Highest limits (€200K/month)',
      'Personal account manager',
      'Mine visit invitation',
      'Priority OTC access',
    ],
  },
};

export function getCardPrivileges(tier: AyniTier): CardPrivileges {
  return CARD_PRIVILEGES[tier];
}

export function getNextCardUpgrade(currentTier: AyniTier): {
  tier: AyniTier;
  privileges: CardPrivileges;
  unlockText: string;
} | null {
  const upgrades: Record<string, { tier: AyniTier; text: string } | null> = {
    explorer: {
      tier: 'contributor',
      text: 'Lock 5,000 AYNI for 6+ months to unlock your card',
    },
    contributor: {
      tier: 'operator',
      text: 'Reach Operator tier for physical card + 0.5% cashback',
    },
    operator: {
      tier: 'principal',
      text: 'Reach Principal tier for gold-plated card + 1% cashback',
    },
    principal: null,
  };
  const next = upgrades[currentTier];
  if (!next) return null;
  return {
    tier: next.tier,
    privileges: CARD_PRIVILEGES[next.tier],
    unlockText: next.text,
  };
}
