import { Suspense, lazy } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Providers } from './providers';
import { router } from './routes';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useThemeInit } from '@/hooks/useTheme';
import { seedNotifications } from '@/services/notificationSeeder';

const SimulationPanel = lazy(() =>
  import('@/components/dev/SimulationPanel').then((m) => ({ default: m.SimulationPanel })),
);

// Seed demo notifications on first load
seedNotifications();

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  useThemeInit();
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
    <Providers>
      <ThemeInitializer>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-surface-bg">
              <p className="text-body-lg text-text-muted">Loading...</p>
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
        {import.meta.env.DEV && (
          <Suspense fallback={null}>
            <SimulationPanel />
          </Suspense>
        )}
      </ThemeInitializer>
    </Providers>
    </ErrorBoundary>
  );
}
