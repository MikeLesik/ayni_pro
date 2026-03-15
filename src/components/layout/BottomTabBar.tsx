import { NavLink, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Layers, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

export function BottomTabBar() {
  const { t } = useTranslation();
  const location = useLocation();

  const tabs = [
    { to: '/home', label: t('nav.home'), icon: Home },
    { to: '/participate', label: t('nav.participate'), icon: TrendingUp },
    { to: '/positions', label: t('nav.portfolio'), icon: Layers },
    { to: '/learn', label: t('nav.resources'), icon: BookOpen },
    { to: '/settings', label: t('nav.profile'), icon: User },
  ];

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[100] lg:hidden',
        'flex justify-around items-start',
        'pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom,0.25rem))]',
        'bg-surface-elevated',
        'border-t border-border-light',
        'shadow-[0_-1px_3px_rgba(0,0,0,0.03)]',
      )}
      style={{ backdropFilter: 'blur(20px) saturate(1.2)' }}
    >
      {tabs.map((tab) => {
        // Resources tab is also active on /trust paths
        const isResourcesMatch = tab.to === '/learn' && location.pathname.startsWith('/trust');
        // Participate tab is also active on /participate/marketplace paths
        const isParticipateMatch =
          tab.to === '/participate' && location.pathname.startsWith('/participate/');
        // Profile tab is also active on /settings/* paths
        const isProfileMatch = tab.to === '/settings' && location.pathname.startsWith('/settings');

        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center gap-0.5 min-w-[48px] py-2',
                'transition-colors duration-150',
                isActive || isResourcesMatch || isParticipateMatch || (isProfileMatch && !isActive)
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-primary',
              )
            }
          >
            {({ isActive }) => (
              <>
                {(isActive ||
                  isResourcesMatch ||
                  isParticipateMatch ||
                  (isProfileMatch && !isActive)) && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-gold" />
                )}
                <tab.icon size={20} strokeWidth={1.5} />
                <span className="text-xs leading-tight">{tab.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
