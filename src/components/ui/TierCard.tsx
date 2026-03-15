import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Pickaxe, Settings, Crown, Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatInteger } from '@/lib/formatters';
import { TIER_CONFIG } from '@/lib/tierConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTierData } from '@/hooks/useTierData';
import { useTranslation, type TranslationKey } from '@/i18n';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Button } from '@/components/ui/Button';
import type { UserTierData } from '@/types/tier';
import type { LucideIcon } from 'lucide-react';

const TIER_ICONS: Record<string, LucideIcon> = {
  Compass,
  Pickaxe,
  Settings,
  Crown,
};

interface TierCardProps {
  tierData?: UserTierData;
  variant?: 'compact' | 'full';
  className?: string;
}

export function TierCard({
  tierData: tierDataProp,
  variant = 'compact',
  className,
}: TierCardProps) {
  const { tierData: hookData, isLoading, isError, refetch } = useTierData();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();

  const tierData = tierDataProp ?? hookData;

  if (isLoading && !tierData) {
    return (
      <div className={cn('bg-surface-card rounded-2xl border-l-4 border-border p-5', className)}>
        <SkeletonLoader variant="card" height="120px" />
      </div>
    );
  }

  if (isError && !tierData) {
    return (
      <div className={cn('bg-surface-card rounded-2xl border-l-4 border-border p-5', className)}>
        <p className="text-sm text-text-secondary">{t('tierCard.loadError')}</p>
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="mt-2">
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  if (!tierData) return null;

  const config = TIER_CONFIG[tierData.currentTier];
  const Icon = TIER_ICONS[config.iconName] ?? Compass;
  const { progressToNext } = tierData;
  const isPrincipal = progressToNext.percentage === null;

  const perksToShow = variant === 'full' ? config.perks : config.perks.slice(0, 2);

  return (
    <div
      className={cn('bg-surface-card rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]', className)}
      style={{
        borderLeft: `4px solid ${config.colorBorder}`,
        padding: '20px 24px',
      }}
    >
      {/* Row 1 — Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon size={20} style={{ color: config.colorBorder }} />
          <span className="text-[13px] font-medium uppercase tracking-wide text-text-muted">
            {t('tierCard.header')}
          </span>
        </div>
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold"
          style={{
            backgroundColor: config.colorBadgeBg,
            color: config.colorBorder,
          }}
        >
          {t(config.label as TranslationKey)}
        </span>
      </div>

      {/* Row 2 — Mining Power */}
      <div className="flex items-center gap-1.5 mt-3">
        <Pickaxe size={14} className="text-gold" aria-label="Mining power" />
        <span className="text-sm text-text-secondary">{t('tierCard.miningPower')}</span>
        <span className="font-mono text-sm font-semibold text-gold">
          {tierData.miningPowerM3h.toFixed(4)} m³/h
        </span>
      </div>

      {/* Row 3 — Permanence badge */}
      {tierData.tierSource !== 'calculated' && (
        <div className="flex items-center gap-1.5 mt-2">
          <Shield size={12} className="text-text-muted" />
          <span className="text-xs text-text-muted italic">
            {tierData.tierSource === 'permanent'
              ? t('tierCard.statusRetained')
              : t('tierCard.statusLifetime')}
          </span>
        </div>
      )}

      {/* Progress bar or Principal badge */}
      {isPrincipal ? (
        <div className="flex items-center gap-1.5 mt-3">
          <Crown size={14} className="text-gold" />
          <span className="text-[13px] font-medium text-gold">{t('tierCard.maxTier')}</span>
        </div>
      ) : (
        progressToNext.percentage !== null && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[13px] text-text-secondary">
                {t('tierCard.progressTo', {
                  tier: t(progressToNext.nextTierLabel as TranslationKey),
                })}
              </span>
              <span className="text-[13px] font-semibold text-text-primary">
                {progressToNext.percentage}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #C9A84C 0%, #E8D48B 100%)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext.percentage}%` }}
                transition={reducedMotion ? { duration: 0 } : { duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-text-muted mt-1.5">
              {(() => {
                const ayniMet = progressToNext.ayniCurrent >= progressToNext.ayniRequired;
                const monthsMet = progressToNext.monthsCurrent >= progressToNext.monthsRequired;
                if (!ayniMet && !monthsMet) {
                  const ayniNeeded = progressToNext.ayniRequired - progressToNext.ayniCurrent;
                  const monthsNeeded = progressToNext.monthsRequired - progressToNext.monthsCurrent;
                  return t('tierCard.needAyniAndMonths', {
                    ayni: formatInteger(ayniNeeded),
                    months: monthsNeeded,
                  });
                }
                if (!ayniMet) {
                  const ayniNeeded = progressToNext.ayniRequired - progressToNext.ayniCurrent;
                  return t('tierCard.needAyni', { ayni: formatInteger(ayniNeeded) });
                }
                if (!monthsMet) {
                  const monthsNeeded = progressToNext.monthsRequired - progressToNext.monthsCurrent;
                  return t('tierCard.needMonths', { months: monthsNeeded });
                }
                return t('tierCard.requirementsMet');
              })()}
            </p>
          </div>
        )
      )}

      {/* Perks */}
      <div className="mt-3 space-y-1.5">
        {perksToShow.map((perk) => (
          <div key={perk} className="flex items-center gap-1.5">
            <CheckCircle size={12} className="text-success shrink-0" />
            <span className="text-[13px] text-text-secondary">{t(perk as TranslationKey)}</span>
          </div>
        ))}
      </div>

      {/* Footer link (compact only) */}
      {variant === 'compact' && (
        <button
          type="button"
          className="text-[13px] text-primary cursor-pointer mt-3 hover:underline"
          onClick={() => navigate('/positions')}
        >
          {t('tierCard.viewBenefits')}
        </button>
      )}
    </div>
  );
}
