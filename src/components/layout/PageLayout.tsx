import { Link } from 'react-router-dom';
import { NavBar } from './NavBar';
import { BottomTabBar } from './BottomTabBar';
import { AnimatedOutlet } from './AnimatedOutlet';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ContactFab } from '@/components/shared/ContactFab';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { SkipLink } from '@/components/ui/SkipLink';
import { OfflineIndicator } from '@/components/ui/OfflineIndicator';
import { usePremium } from '@/hooks/usePremium';
import { useUnreadCount } from '@/stores/notificationStore';

export function PageLayout() {
  const isPremium = usePremium();
  const unreadCount = useUnreadCount();

  return (
    <div className="relative min-h-screen bg-surface-bg bg-noise">
      <OfflineIndicator />
      <SkipLink />
      <NavBar />
      {/* Mobile notification bell */}
      <div className="fixed top-[calc(env(safe-area-inset-top,0px)+0.5rem)] right-2 z-[99] lg:hidden">
        <Link to="/notifications">
          <NotificationBell count={unreadCount} />
        </Link>
      </div>
      <main id="main-content" className="relative z-[2] mx-auto max-w-[1200px] px-4 pt-[calc(env(safe-area-inset-top,0px)+1rem)] pb-[calc(6rem+env(safe-area-inset-bottom,0.5rem))] md:px-6 md:pt-4 md:pb-6 lg:px-8 lg:pt-4 lg:pb-6">
        <ErrorBoundary>
          <AnimatedOutlet />
        </ErrorBoundary>
      </main>
      <BottomTabBar />
      {isPremium && <ContactFab />}
    </div>
  );
}
