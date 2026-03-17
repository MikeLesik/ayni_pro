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
        'fixed z-[100] lg:hidden',
        'bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))]',
        'left-4 right-4',
        'flex justify-around items-center',
        'h-14 px-2',
        'bg-surface-elevated',
        'border border-white/15',
        'rounded-2xl',
        'shadow-lg shadow-black/10',
      )}
      style={{ backdropFilter: 'blur(24px) saturate(1.3)' }}
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
                'relative flex flex-col items-center justify-center gap-0.5 min-w-[48px] py-1.5',
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
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
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
