import { useNavigate } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { TierBadge } from '@/components/ui/TierBadge';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { useAuthStore } from '@/stores/authStore';
import { useTierData } from '@/hooks/useTierData';
import { useTranslation } from '@/i18n';

export function ProfileSection() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { tierData, isLoading: tierLoading } = useTierData();
  const navigate = useNavigate();

  const displayName =
    user?.firstName || user?.lastName
      ? [user.firstName, user.lastName].filter(Boolean).join(' ')
      : null;

  return (
    <Card variant="stat" className="!p-0 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-4">
        <Avatar
          src={user?.avatarUrl ?? undefined}
          name={displayName ?? user?.email ?? '?'}
          size="lg"
          className="!h-10 !w-10 shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text-primary truncate">
              {displayName ?? user?.email ?? t('settings.profile.defaultName')}
            </p>
            {tierLoading ? (
              <SkeletonLoader variant="text" width="60px" height="20px" />
            ) : tierData ? (
              <Tooltip.Provider delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span>
                      <TierBadge
                        tier={tierData.currentTier}
                        size="sm"
                        onClick={() => navigate('/positions')}
                      />
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      className="rounded-lg bg-surface-elevated px-3 py-2 text-xs text-text-secondary shadow-md border border-border-light z-50"
                    >
                      View your contributor status
                      <Tooltip.Arrow className="fill-surface-elevated" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            ) : null}
          </div>
          <p className="text-xs text-text-muted truncate">{user?.email}</p>
        </div>

        {/* Edit button — will be re-enabled once profile editing is implemented */}
      </div>
    </Card>
  );
}
