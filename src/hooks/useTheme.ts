import { useEffect, useSyncExternalStore } from 'react';
import { useUiStore } from '@/stores/uiStore';

function applyTheme(mode: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', mode);
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Returns true when the resolved theme is dark (handles 'system' automatically). */
export function useIsDark(): boolean {
  const theme = useUiStore((s) => s.theme);

  const systemDark = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => false,
  );

  if (theme === 'system') return systemDark;
  return theme === 'dark';
}

export function useThemeInit() {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    if (theme === 'system') {
      applyTheme(getSystemTheme());

      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);
}
