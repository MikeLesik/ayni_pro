import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Polyfill matchMedia for useReducedMotion and other media-query hooks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Polyfill localStorage for zustand persist middleware (jsdom v28+ may not provide it)
{
  const map: Record<string, string> = {};
  const localStorageShim: Storage = {
    getItem: (key: string) => map[key] ?? null,
    setItem: (key: string, value: string) => {
      map[key] = value;
    },
    removeItem: (key: string) => {
      delete map[key];
    },
    clear: () => {
      for (const k of Object.keys(map)) delete map[k];
    },
    get length() {
      return Object.keys(map).length;
    },
    key: (index: number) => Object.keys(map)[index] ?? null,
  };
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageShim,
    writable: true,
    configurable: true,
  });
}
