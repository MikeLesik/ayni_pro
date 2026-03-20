import { NavLink, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Layers, BookOpen } from 'lucide-react';
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
  ];

  return (
    <nav
      className={cn(
        'fixed z-[100] lg:hidden',
        'bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))]',
        'left-4 right-4',
        'flex justify-around items-center',
        'h-12 px-3',
        'bg-surface-elevated',
        'border border-white/12',
        'rounded-2xl',
        'shadow-lg shadow-black/8',
      )}
      style={{ backdropFilter: 'blur(20px) saturate(1.3)' }}
    >
      {tabs.map((tab) => {
        const isResourcesMatch = tab.to === '/learn' && location.pathname.startsWith('/trust');
        const isParticipateMatch =
          tab.to === '/participate' && location.pathname.startsWith('/participate/');

        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] py-1',
                'transition-colors duration-150',
                isActive || isResourcesMatch || isParticipateMatch
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-primary',
              )
            }
          >
            {({ isActive }) => (
              <>
                {(isActive || isResourcesMatch || isParticipateMatch) && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-gold" />
                )}
                <tab.icon size={20} strokeWidth={1.5} />
                <span className="text-[10px] leading-tight font-medium">{tab.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
