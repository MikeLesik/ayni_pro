import { TOKENOMICS } from '@/lib/rewardEngine';
import type { SimBalances, SimPrices } from './types';

export const DEFAULT_BALANCES: SimBalances = {
  usdBalance: 0,
  ayniAvailable: 0,
  ayniActivated: 0,
  paxgBalance: 0,
  paxgClaimed: 0,
};

export const DEFAULT_PRICES: SimPrices = {
  ayniUsd: TOKENOMICS.defaultAyniPrice,
  paxgUsd: TOKENOMICS.defaultPaxgPrice,
  goldPerGram: TOKENOMICS.defaultGoldPricePerGram,
};

export function today(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}T00:00:00Z`;
}
