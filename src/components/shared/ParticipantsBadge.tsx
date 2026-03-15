import { useTranslation } from '@/i18n';
import { trustData } from '@/services/mock/data/trust';
import { cn } from '@/lib/cn';

// TODO: make dynamic — fetch from API instead of trustData
const PARTICIPANT_COUNT = trustData.miningStatus.totalParticipants;

const AVATAR_COLORS = [
  'bg-primary text-white',
  'bg-accent-copper text-white',
  'bg-emerald-500 text-white',
  'bg-violet-500 text-white',
  'bg-sky-500 text-white',
];

const INITIALS = ['MK', 'AL', 'JR', 'TS', 'DN'];

interface ParticipantsBadgeProps {
  className?: string;
}

export function ParticipantsBadge({ className }: ParticipantsBadgeProps) {
  const { t } = useTranslation();

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {/* Mini avatar stack */}
      <div className="flex -space-x-2">
        {INITIALS.map((initials, i) => (
          <div
            key={initials}
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center',
              'text-[9px] font-semibold leading-none',
              'ring-2 ring-surface-page',
              AVATAR_COLORS[i],
            )}
          >
            {initials}
          </div>
        ))}
      </div>

      {/* Text */}
      <span className="text-[13px] text-text-secondary leading-tight">
        {t('socialProof.participantsReceiving', { count: PARTICIPANT_COUNT })}
      </span>
    </div>
  );
}
