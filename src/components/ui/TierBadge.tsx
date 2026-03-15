import { Compass, Pickaxe, Settings, Crown } from 'lucide-react';
import { TIER_CONFIG } from '@/lib/tierConfig';
import { useTranslation, type TranslationKey } from '@/i18n';
import type { TierLevel } from '@/types/tier';
import type { LucideIcon } from 'lucide-react';

const TIER_ICONS: Record<string, LucideIcon> = {
  Compass,
  Pickaxe,
  Settings,
  Crown,
};

interface TierBadgeProps {
  tier: TierLevel;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export function TierBadge({ tier, size = 'sm', onClick }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];
  const Icon = TIER_ICONS[config.iconName] ?? Compass;
  const { t } = useTranslation();

  const iconSize = size === 'sm' ? 11 : 14;
  const textClass = size === 'sm' ? 'text-[11px]' : 'text-sm';
  const px = size === 'sm' ? '8px' : '12px';
  const py = size === 'sm' ? '2px' : '5px';

  return (
    <span
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`inline-flex items-center gap-1 rounded-full font-medium tracking-wide ${textClass} ${onClick ? 'cursor-pointer hover:opacity-85 transition-opacity' : ''}`}
      style={{
        backgroundColor: `${config.colorBadgeBg}cc`,
        border: `1px solid ${config.colorBorder}40`,
        color: config.colorBorder,
        padding: `${py} ${px}`,
        backdropFilter: 'blur(4px)',
      }}
    >
      <Icon size={iconSize} />
      {t(config.label as TranslationKey)}
    </span>
  );
}
