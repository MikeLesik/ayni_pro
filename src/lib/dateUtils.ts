// ═══════════════════════════════════════════════════════════════
// AYNI GOLD — Date Utility Functions
// Shared date arithmetic used by simulation and distribution
// ═══════════════════════════════════════════════════════════════

/** Add days to an ISO date string, returning UTC ISO format */
export function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split('T')[0] + 'T00:00:00Z';
}

/** Add months to an ISO date string */
export function addMonths(iso: string, months: number): string {
  const d = new Date(iso);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().split('T')[0] + 'T00:00:00Z';
}

/** Is date a <= date b? */
export function dateLte(a: string, b: string): boolean {
  return new Date(a).getTime() <= new Date(b).getTime();
}

/** Is date a < date b? */
export function dateLt(a: string, b: string): boolean {
  return new Date(a).getTime() < new Date(b).getTime();
}

/** Days between two ISO date strings */
export function daysBetween(a: string, b: string): number {
  const diff = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

/** Convert Date to ISO date-only string (YYYY-MM-DD) */
export function toISODate(d: Date): string {
  return d.toISOString().split('T')[0]!;
}

/** Today as UTC ISO string */
export function todayUTC(): string {
  return toISODate(new Date());
}
