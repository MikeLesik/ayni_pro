import { format, parseISO } from 'date-fns';
import { enUS, es as esLocale, ru as ruLocale } from 'date-fns/locale';
import { useUiStore, type Language } from '@/stores/uiStore';

/* ── Locale helpers ── */

const intlLocaleMap: Record<Language, string> = {
  en: 'en-US',
  es: 'es-ES',
  ru: 'ru-RU',
};

const dateFnsLocaleMap: Record<Language, typeof enUS> = {
  en: enUS,
  es: esLocale,
  ru: ruLocale,
};

export function getLocale(): string {
  return intlLocaleMap[useUiStore.getState().language];
}

export function getDateLocale() {
  return dateFnsLocaleMap[useUiStore.getState().language];
}

/* ── Number formatters ── */

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat(getLocale(), {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number): string {
  const pct = Math.abs(value) < 1 ? value * 100 : value;
  return (
    new Intl.NumberFormat(getLocale(), {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(pct) + '%'
  );
}

export function formatDate(isoString: string): string {
  return format(parseISO(isoString), 'MMM d, yyyy', { locale: getDateLocale() });
}

export function formatGrams(value: number): string {
  return (
    new Intl.NumberFormat(getLocale(), {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value) + ' g'
  );
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat(getLocale(), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPrice(value: number): string {
  return (
    '$' +
    new Intl.NumberFormat(getLocale(), {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value)
  );
}

export function formatInteger(value: number): string {
  return new Intl.NumberFormat(getLocale(), {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}
