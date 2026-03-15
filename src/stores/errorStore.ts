import { create } from 'zustand';
import { uid } from '@/lib/uid';

const MAX_ERRORS = 50;

export interface CapturedError {
  id: string;
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  url: string;
}

interface ErrorState {
  errors: CapturedError[];
  captureError: (error: Error, componentStack?: string) => void;
  clearErrors: () => void;
}

export const useErrorStore = create<ErrorState>()((set) => ({
  errors: [],

  captureError: (error: Error, componentStack?: string) => {
    const entry: CapturedError = {
      id: uid(),
      message: error.message,
      stack: error.stack,
      componentStack: componentStack ?? undefined,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
    };

    set((s) => ({
      errors: [entry, ...s.errors].slice(0, MAX_ERRORS),
    }));
  },

  clearErrors: () => set({ errors: [] }),
}));
