import { useState, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { formatNumber } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { NotificationPanel } from '@/components/ui/NotificationPanel';
import { Avatar } from '@/components/ui/Avatar';
import { usePremium } from '@/hooks/usePremium';
import { useSimulationStore } from '@/stores/simulation';
import { useUiStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useUnreadCount } from '@/stores/notificationStore';
import { useTranslation } from '@/i18n';
import logoNavbar from '@/assets/logo-navbar.png';

export function NavBar() {
  const { t } = useTranslation();
  const location = useLocation();
  const isPremium = usePremium();
  const advancedView = useUiStore((s) => s.advancedView);
  const prices = useSimulationStore((s) => s.prices);
  const user = useAuthStore((s) => s.user);
  const unreadCount = useUnreadCount();
  const [notifOpen, setNotifOpen] = useState(false);
  const toggleNotif = useCallback(() => setNotifOpen((o) => !o), []);
  const closeNotif = useCallback(() => setNotifOpen(false), []);
  const avatarName =
    user?.firstName || user?.lastName
      ? [user.firstName, user.lastName].filter(Boolean).join(' ')
      : (user?.email ?? 'User');

  const navItems = [
    { to: '/home', label: t('nav.home') },
    { to: '/positions', label: t('nav.portfolio') },
    { to: '/learn', label: t('nav.resources') },
  ];

  const isOnTrust = location.pathname.startsWith('/trust');

  return (
    <header
      className={cn(
        'sticky top-0 z-[100] hidden lg:flex items-center',
        'h-16 px-8',
        'bg-surface-elevated',
        'border-b border-border-light',
        'shadow-[0_1px_3px_rgba(0,0,0,0.03)]',
      )}
      style={{ backdropFilter: 'blur(20px) saturate(1.2)' }}
    >
      {/* Nav items */}
      <nav className="flex items-center gap-6">
        {/* Logo */}
        <NavLink to="/home" className="shrink-0 mr-4 flex items-center">
          <img src={logoNavbar} alt="AYNI" className="h-6" />
        </NavLink>
        {navItems.map((item) => {
          const isResourcesActive = item.to === '/learn' && isOnTrust;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'text-[13px] font-medium transition-colors duration-150 py-5',
                  'border-b-2 -mb-px',
                  isActive || isResourcesActive
                    ? 'text-text-primary border-gold'
                    : 'text-text-secondary border-transparent hover:text-text-primary',
                )
              }
            >
              {item.label}
            </NavLink>
          );
        })}

        {/* Participate — primary button style */}
        <NavLink to="/participate">
          {({ isActive }) => {
            const active = isActive || location.pathname.startsWith('/participate');
            return (
              <Button
                variant={active ? 'primary' : 'secondary'}
                size="sm"
                className="h-8 px-4 text-[13px]"
              >
                {t('nav.participate')}
              </Button>
            );
          }}
        </NavLink>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Price ticker (advanced view only) */}
      {advancedView && (
        <div className="flex items-center gap-4 mr-5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-muted">AYNI</span>
            <span className="text-[13px] font-medium text-text-primary">
              ${prices.ayniUsd.toFixed(4)}
            </span>
          </div>
          <div className="w-px h-4 bg-border-light" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-muted">PAXG</span>
            <span className="text-[13px] font-medium text-text-primary">
              ${formatNumber(prices.paxgUsd, 2)}
            </span>
          </div>
        </div>
      )}

      {/* Right section */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <NotificationBell count={unreadCount} onClick={toggleNotif} />
          <NotificationPanel open={notifOpen} onClose={closeNotif} />
        </div>
        {isPremium && (
          <span className="text-xs font-medium text-primary bg-primary-light rounded-full px-2.5 py-0.5">
            {t('nav.premium')}
          </span>
        )}
        <NavLink to="/settings">
          <Avatar size="md" name={avatarName} />
        </NavLink>
      </div>
    </header>
  );
}
