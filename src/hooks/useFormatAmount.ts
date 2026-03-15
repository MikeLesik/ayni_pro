import { useCallback } from 'react';
import { useUiStore } from '@/stores/uiStore';
import { formatCurrency, formatNumber } from '@/lib/formatters';

/**
 * Hook that formats amounts based on the user's displayCurrency preference.
 * Returns a `format` function that renders USD, AYNI, or both.
 */
export function useFormatAmount() {
  const displayCurrency = useUiStore((s) => s.displayCurrency);

  const format = useCallback(
    (usdValue: number, ayniValue?: number): string => {
      const usd = formatCurrency(usdValue);
      if (!ayniValue) return usd;

      const ayni = `${formatNumber(ayniValue)} AYNI`;

      switch (displayCurrency) {
        case 'ayni':
          return ayni;
        case 'both':
          return `${usd} (${ayni})`;
        default:
          return usd;
      }
    },
    [displayCurrency],
  );

  return { format, displayCurrency };
}
