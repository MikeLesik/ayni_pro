import { Shield, Pickaxe, Lock } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/cn';
import type { TranslationKey } from '@/i18n';

const badgeConfig: {
  icon: typeof Shield;
  key: TranslationKey;
  tooltipKey: TranslationKey;
  href?: string;
}[] = [
  {
    icon: Shield,
    key: 'earn.trust.peckshield',
    tooltipKey: 'earn.trust.peckshieldTooltip',
    href: '/trust#audits',
  },
  {
    icon: Shield,
    key: 'earn.trust.certik',
    tooltipKey: 'earn.trust.certikTooltip',
    href: '/trust#audits',
  },
  {
    icon: Pickaxe,
    key: 'earn.trust.licensedMining',
    tooltipKey: 'earn.trust.licensedMiningTooltip',
    href: '/trust#mining-partner',
  },
  {
    icon: Lock,
    key: 'earn.trust.fundsProtected',
    tooltipKey: 'earn.trust.fundsProtectedTooltip',
    href: '/trust#stability-fund',
  },
];

export function TrustBadges({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <div className={cn('flex items-center justify-center gap-x-3 gap-y-1.5 flex-wrap', className)}>
      {badgeConfig.map((badge, i) => {
        const content = (
          <>
            <badge.icon size={13} className="text-text-muted shrink-0" />
            <span className="text-[11px] text-text-secondary whitespace-nowrap">
              {t(badge.key)}
            </span>
          </>
        );

        const inner = badge.href ? (
          <a
            href={badge.href}
            className="flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer"
          >
            {content}
          </a>
        ) : (
          <button
            type="button"
            className="flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer"
          >
            {content}
          </button>
        );

        return (
          <span key={badge.key} className="flex items-center gap-x-3">
            <Tooltip content={t(badge.tooltipKey)}>{inner}</Tooltip>
            {i < badgeConfig.length - 1 && (
              <span className="text-border text-[10px] leading-none select-none" aria-hidden>
                ·
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
