import { lazy } from 'react';
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  useParams,
  type RouteObject,
} from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { PageLayout } from '@/components/layout/PageLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'));
const PositionDetailPage = lazy(() => import('@/pages/PositionDetailPage'));
const ActivityPage = lazy(() => import('@/pages/ActivityPage'));
const LearnPage = lazy(() => import('@/pages/LearnPage'));
const LearnArticlePage = lazy(() => import('@/pages/LearnArticlePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const SecuritySettingsPage = lazy(() => import('@/pages/SecuritySettingsPage'));
const WalletSettingsPage = lazy(() => import('@/pages/WalletSettingsPage'));
const CardSettingsPage = lazy(() => import('@/pages/CardSettingsPage'));
const CardSettingsSubPage = lazy(() => import('@/pages/CardSettingsSubPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const ListingDetailPage = lazy(() => import('@/pages/ListingDetailPage'));
const CreateListingPage = lazy(() => import('@/app/CreateListingPage'));
const ParticipatePage = lazy(() => import('@/pages/ParticipatePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const DevPage = lazy(() => import('@/pages/DevPage'));
const AnalyticsDashboardPage = lazy(() => import('@/pages/AnalyticsDashboardPage'));
const MyMinePage = lazy(() => import('@/pages/MyMinePage'));
const ReferralPage = lazy(() => import('@/pages/ReferralPage'));
const TrustPage = lazy(() => import('@/pages/TrustPage'));
const WelcomeCarouselPage = lazy(() => import('@/pages/WelcomeCarouselPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));

// Route guard: checks authStore for authentication
function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?redirect=${redirect}`} replace />;
  }
  return <>{children}</>;
}

// Legacy redirect: /portfolio/:id → /positions/:id
function PortfolioIdRedirect() {
  const { id } = useParams();
  return <Navigate to={`/positions/${id}`} replace />;
}

const routes: RouteObject[] = [
  // Authenticated routes (with NavBar / BottomTabBar)
  {
    element: (
      <RequireAuth>
        <PageLayout />
      </RequireAuth>
    ),
    children: [
      { path: '/home', element: <HomePage /> },
      { path: '/participate', element: <ParticipatePage /> },
      { path: '/participate/marketplace', element: <ParticipatePage /> },
      { path: '/earn/checkout', element: <CheckoutPage /> },
      { path: '/positions', element: <PortfolioPage /> },
      { path: '/positions/:id', element: <PositionDetailPage /> },
      { path: '/activity', element: <ActivityPage /> },
      { path: '/learn', element: <LearnPage /> },
      { path: '/learn/:slug', element: <LearnArticlePage /> },
      { path: '/my-mine', element: <MyMinePage /> },
      { path: '/referral', element: <ReferralPage /> },
      { path: '/trust', element: <TrustPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/settings/security', element: <SecuritySettingsPage /> },
      { path: '/settings/wallets', element: <WalletSettingsPage /> },
      { path: '/settings/cards', element: <CardSettingsPage /> },
      { path: '/settings/card-settings', element: <CardSettingsSubPage /> },
      { path: '/participate/marketplace/create', element: <CreateListingPage /> },
      { path: '/participate/marketplace/:id', element: <ListingDetailPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
    ],
  },
  // Auth routes (no nav)
  {
    element: <AuthLayout />,
    children: [{ path: '/auth', element: <AuthPage /> }],
  },
  // Welcome carousel (standalone, protected)
  {
    path: '/welcome',
    element: (
      <RequireAuth>
        <WelcomeCarouselPage />
      </RequireAuth>
    ),
  },
  // Dev pages (standalone)
  { path: '/dev', element: <DevPage /> },
  { path: '/dev/analytics', element: <AnalyticsDashboardPage /> },
  // Legacy redirects
  { path: '/earn', element: <Navigate to="/participate" replace /> },
  { path: '/portfolio', element: <Navigate to="/positions" replace /> },
  {
    path: '/portfolio/:id',
    element: <PortfolioIdRedirect />,
  },
  // Root redirect
  { path: '/', element: <Navigate to="/home" replace /> },
  // 404
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
