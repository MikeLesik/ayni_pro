// ═══════════════════════════════════════════════════════════════
// AYNI GOLD — Deterministic Hash Functions
// Used for reproducible daily variation in simulation/distribution
// ═══════════════════════════════════════════════════════════════

/**
 * Deterministic seed from date + positionId.
 * Returns a value in [0, 1) for reproducible variation.
 */
export function dateToSeed(dateStr: string, positionId: string): number {
  let hash = 0;
  const str = dateStr + positionId;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit int
  }
  return Math.abs(hash % 1000) / 1000;
}

/**
 * Deterministic gold price variation ±2% from base price for a given date.
 */
export function goldPriceForDate(basePrice: number, dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 3) - hash + dateStr.charCodeAt(i);
    hash = hash & hash;
  }
  const variation = 1 + (Math.abs(hash % 1000) / 1000 - 0.5) * 0.04; // ±2%
  return basePrice * variation;
}
