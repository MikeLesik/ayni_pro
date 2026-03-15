import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Pickaxe, Settings, Crown, Shield, CheckCircle, Lock, Info } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatInteger } from '@/lib/formatters';
import { TIER_CONFIG } from '@/lib/tierConfig';
import { TIER_ORDER } from '@/types/tier';
import { useTierData } from '@/hooks/useTierData';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation, type TranslationKey } from '@/i18n';
import { useSimulationStore } from '@/stores/simulation';
import { TierCard } from '@/components/ui/TierCard';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import type { LucideIcon } from 'lucide-react';

const TIER_ICONS: Record<string, LucideIcon> = {
  Compass,
  Pickaxe,
  Settings,
  Crown,
};

function ProgressBar({
  label,
  current,
  required,
  unit,
  met,
}: {
  label: string;
  current: number;
  required: number;
  unit: string;
  met: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();
  const pct = required > 0 ? Math.min(100, Math.round((current / required) * 100)) : 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[13px] text-text-secondary">{label}</span>
        <span className="text-[13px] font-semibold text-text-primary">
          {formatInteger(current)} / {formatInteger(required)} {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-secondary overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #C9A84C 0%, #E8D48B 100%)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={reducedMotion ? { duration: 0 } : { duration: 1, ease: 'easeOut' }}
        />
      </div>
      {met && (
        <p className="text-xs text-success mt-1 flex items-center gap-1">
          <CheckCircle size={12} /> {t('contributorStatus.requirementMet', { label })}
        </p>
      )}
    </div>
  );
}

export function ContributorStatus() {
  const { tierData, isLoading } = useTierData();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const ayniPriceUsd = useSimulationStore((s) => s.prices.ayniUsd);

  if (isLoading || !tierData) {
    return (
      <div className="space-y-4">
        <SkeletonLoader variant="card" height="200px" />
        <SkeletonLoader variant="card" height="160px" />
      </div>
    );
  }

  const config = TIER_CONFIG[tierData.currentTier];
  const { progressToNext } = tierData;
  const isPrincipal = progressToNext.percentage === null;
  const currentIdx = TIER_ORDER.indexOf(tierData.currentTier);

  const translatedNextTier = progressToNext.nextTierLabel
    ? t(progressToNext.nextTierLabel as TranslationKey)
    : null;

  return (
    <div className="space-y-6">
      {/* Section 1 — Current Status (full TierCard) */}
      <TierCard tierData={tierData} variant="full" />

      {/* Section 2 — Path to Next Tier */}
      {!isPrincipal && translatedNextTier && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('contributorStatus.pathTo', { tier: translatedNextTier })}
          </h3>

          <ProgressBar
            label={t('contributorStatus.ayniPosition')}
            current={progressToNext.ayniCurrent}
            required={progressToNext.ayniRequired}
            unit="AYNI"
            met={progressToNext.ayniCurrent >= progressToNext.ayniRequired}
          />

          <ProgressBar
            label={t('contributorStatus.participationPeriod')}
            current={progressToNext.monthsCurrent}
            required={progressToNext.monthsRequired}
            unit={t('common.months')}
            met={progressToNext.monthsCurrent >= progressToNext.monthsRequired}
          />

          {/* Permanence info cards */}
          {tierData.tierSource === 'permanent' && (
            <div className="flex items-start gap-3 rounded-xl border border-warning bg-warning/10 p-4">
              <Shield size={16} className="text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-text-secondary">
                {t('contributorStatus.statusPreserved', {
                  tier: t(config.label as TranslationKey),
                  nextTier: translatedNextTier,
                })}
              </p>
            </div>
          )}

          {tierData.tierSource === 'lifetime_grams' && (
            <div className="flex items-start gap-3 rounded-xl border border-primary bg-primary/5 p-4">
              <Info size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-text-secondary">
                {t('contributorStatus.statusLifetime', {
                  tier: t(config.label as TranslationKey),
                })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Section 3 — All Tiers Table */}
      <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 px-3 text-text-muted font-medium">
                {t('contributorStatus.tableTier')}
              </th>
              <th className="py-2 px-3 text-text-muted font-medium">
                {t('contributorStatus.tableMinPosition')}
              </th>
              <th className="py-2 px-3 text-text-muted font-medium">
                {t('contributorStatus.tableMinPeriod')}
              </th>
              <th className="py-2 px-3 text-text-muted font-medium">
                {t('contributorStatus.tableFeeReduction')}
              </th>
              <th className="py-2 px-3 text-text-muted font-medium">
                {t('contributorStatus.tableKeyBenefit')}
              </th>
            </tr>
          </thead>
          <tbody>
            {TIER_ORDER.map((tierLevel) => {
              const cfg = TIER_CONFIG[tierLevel];
              const tierIdx = TIER_ORDER.indexOf(tierLevel);
              const isCurrent = tierLevel === tierData.currentTier;
              const isBelow = tierIdx < currentIdx;
              const isAbove = tierIdx > currentIdx;
              const TierIcon = TIER_ICONS[cfg.iconName] ?? Compass;

              return (
                <tr
                  key={tierLevel}
                  className={cn(
                    'border-b border-border-light transition-colors',
                    isCurrent && 'font-medium',
                  )}
                  style={
                    isCurrent
                      ? {
                          backgroundColor: `${cfg.colorBorder}18`,
                          borderLeft: `4px solid ${cfg.colorBorder}`,
                        }
                      : isBelow
                        ? { opacity: 0.7 }
                        : isAbove
                          ? { opacity: 0.6 }
                          : undefined
                  }
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      {isBelow && <CheckCircle size={14} className="text-success" />}
                      {isAbove && <Lock size={14} className="text-text-muted" />}
                      {isCurrent && <TierIcon size={14} style={{ color: cfg.colorBorder }} />}
                      <span>{t(cfg.label as TranslationKey)}</span>
                      {isCurrent && (
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: cfg.colorBorder, color: '#fff' }}
                        >
                          {t('contributorStatus.currentBadge')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {cfg.minAYNI > 0 ? `${formatInteger(cfg.minAYNI)} AYNI` : '—'}
                  </td>
                  <td className="py-3 px-3">
                    {cfg.minMonths > 0
                      ? t('contributorStatus.months', { count: cfg.minMonths })
                      : '—'}
                  </td>
                  <td className="py-3 px-3">
                    {cfg.successFeeDiscount > 0 ? `${cfg.successFeeDiscount}%` : '—'}
                  </td>
                  <td className="py-3 px-3">{t(cfg.perks[0] as TranslationKey)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Section 4 — CTA */}
      {!isPrincipal &&
        translatedNextTier &&
        (() => {
          const ayniMet = progressToNext.ayniCurrent >= progressToNext.ayniRequired;
          const monthsMet = progressToNext.monthsCurrent >= progressToNext.monthsRequired;
          const ayniNeeded = Math.max(0, progressToNext.ayniRequired - progressToNext.ayniCurrent);
          const monthsNeeded = Math.max(
            0,
            progressToNext.monthsRequired - progressToNext.monthsCurrent,
          );

          // Both met — shouldn't normally show, but handle gracefully
          if (ayniMet && monthsMet) return null;

          return (
            <div className="rounded-2xl border border-border bg-gold/5 p-5">
              <p className="text-[15px] text-text-primary">
                {ayniMet
                  ? t('contributorStatus.reachTierMonthsOnly', {
                      tier: translatedNextTier,
                      months: monthsNeeded,
                    })
                  : monthsMet
                    ? t('contributorStatus.reachTier', {
                        tier: translatedNextTier,
                        amount: formatInteger(ayniNeeded),
                      })
                    : t('contributorStatus.reachTierBoth', {
                        tier: translatedNextTier,
                        amount: formatInteger(ayniNeeded),
                        months: monthsNeeded,
                      })}
              </p>
              {!ayniMet && (
                <Button
                  variant="secondary"
                  size="md"
                  className="mt-3"
                  onClick={() => {
                    const usdNeeded = ayniNeeded > 0 ? Math.ceil(ayniNeeded * ayniPriceUsd) : 0;
                    navigate(usdNeeded > 0 ? `/participate?topup=${usdNeeded}` : '/participate');
                  }}
                >
                  {t('contributorStatus.addToPosition')}
                </Button>
              )}
            </div>
          );
        })()}
    </div>
  );
}
