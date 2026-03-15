import { type ReactNode, useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { EmptyState } from '@/components/ui/EmptyState';
import api from '@/services/api';

const BLOCKED_COUNTRIES = new Set([
  'US',
  // EU member states
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
]);

interface GeoRestrictionProps {
  children: ReactNode;
}

export function GeoRestriction({ children }: GeoRestrictionProps) {
  const user = useAuthStore((s) => s.user);
  const [blocked, setBlocked] = useState<boolean | null>(null);

  useEffect(() => {
    // Check profile country first
    if (user?.country && BLOCKED_COUNTRIES.has(user.country)) {
      setBlocked(true);
      return;
    }

    if (user?.country) {
      setBlocked(false);
      return;
    }

    // Fallback to geo API
    api
      .get('user/geo')
      .json<{ country: string }>()
      .then(({ country }) => setBlocked(BLOCKED_COUNTRIES.has(country)))
      .catch(() => setBlocked(false));
  }, [user?.country]);

  // Still loading
  if (blocked === null) return null;

  if (!blocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm">
      <EmptyState
        illustration={
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Globe className="w-8 h-8 text-primary" />
          </div>
        }
        title="Маркетплейс недоступен в вашем регионе"
        description="По регуляторным требованиям P2P-трансферы недоступны для резидентов США и ЕС."
        ctaLabel="Вернуться к участию →"
        onCtaClick={() => {
          window.location.href = '/earn';
        }}
        className="bg-surface-card rounded-2xl shadow-lg max-w-md mx-4 py-12"
      />
    </div>
  );
}
