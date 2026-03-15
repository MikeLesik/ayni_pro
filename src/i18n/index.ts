import { useCallback } from 'react';
import { en, type TranslationKey } from './en';
import { es } from './es';
import { ru } from './ru';
import { useUiStore } from '@/stores/uiStore';

const translations: Record<string, Record<TranslationKey, string>> = { en, es, ru };

export type { TranslationKey };

export function useTranslation() {
  const language = useUiStore((s) => s.language);
  const dict = translations[language] ?? en;

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      let text = dict[key] ?? en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replaceAll(`{{${k}}}`, String(v));
        }
      }
      return text;
    },
    [dict],
  );

  return { t, language };
}
