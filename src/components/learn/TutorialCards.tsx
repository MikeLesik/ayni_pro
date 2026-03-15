import { useMemo } from 'react';
import { Pickaxe, Coins, BookOpen, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import { useLearnStore, LEARN_MODULES } from '@/stores/learnStore';
import { cn } from '@/lib/cn';
import type { TranslationKey } from '@/i18n';
import type { LucideIcon } from 'lucide-react';

interface Tutorial {
  id: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  durationKey: TranslationKey;
  typeKey: TranslationKey;
  icon: LucideIcon;
}

const TUTORIALS: Tutorial[] = [
  {
    id: 'how-it-works',
    titleKey: 'learn.tutorial.howItWorks',
    descKey: 'learn.tutorial.howItWorksDesc',
    durationKey: 'learn.tutorial.howItWorksDuration',
    typeKey: 'learn.tutorial.typeVideo',
    icon: Pickaxe,
  },
  {
    id: 'first-investment',
    titleKey: 'learn.tutorial.firstInvestment',
    descKey: 'learn.tutorial.firstInvestmentDesc',
    durationKey: 'learn.tutorial.firstInvestmentDuration',
    typeKey: 'learn.tutorial.typeVideo',
    icon: Coins,
  },
  {
    id: 'understanding-earnings',
    titleKey: 'learn.tutorial.understandingEarnings',
    descKey: 'learn.tutorial.understandingEarningsDesc',
    durationKey: 'learn.tutorial.understandingEarningsDuration',
    typeKey: 'learn.tutorial.typeArticle',
    icon: BookOpen,
  },
];

export function TutorialCards({ searchQuery = '' }: { searchQuery?: string }) {
  const { t } = useTranslation();
  const completedModules = useLearnStore((s) => s.completedModules);
  const claimedRewards = useLearnStore((s) => s.claimedRewards);
  const completeModule = useLearnStore((s) => s.completeModule);
  const claimModuleReward = useLearnStore((s) => s.claimModuleReward);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return TUTORIALS;
    const q = searchQuery.toLowerCase();
    return TUTORIALS.filter(
      (tut) =>
        t(tut.titleKey).toLowerCase().includes(q) || t(tut.descKey).toLowerCase().includes(q),
    );
  }, [searchQuery, t]);

  if (filtered.length === 0) {
    return (
      <p className="text-sm text-text-muted py-4 text-center">{t('learn.search.noResults')}</p>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
      {filtered.map((tutorial) => {
        const learnMod = LEARN_MODULES.find((m) => m.id === tutorial.id);
        const isCompleted = !!completedModules[tutorial.id];
        const isClaimed = !!claimedRewards[tutorial.id];
        const isPending = isCompleted && !isClaimed;

        const handleClick = () => {
          if (!isCompleted) {
            completeModule(tutorial.id);
          } else if (isPending) {
            claimModuleReward(tutorial.id);
          }
        };

        return (
          <Card
            key={tutorial.id}
            variant="stat"
            hoverable
            className="min-w-[220px] flex-shrink-0 lg:flex-1 lg:min-w-0 cursor-pointer !p-0 overflow-hidden"
            onClick={handleClick}
          >
            {/* Gradient thumbnail */}
            <div className="relative bg-gradient-to-br from-[#F5EFD7] to-[#E8F0F4] flex items-center justify-center h-32 rounded-t-[16px]">
              <tutorial.icon className={cn('w-8 h-8', isCompleted ? 'text-success' : 'text-primary')} />
              {isCompleted && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3">
              <h4 className="text-sm font-medium text-text-primary">{t(tutorial.titleKey)}</h4>
              <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{t(tutorial.descKey)}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="inline-block text-[11px] text-text-muted bg-surface-secondary px-2 py-0.5 rounded-full">
                  {t(tutorial.durationKey)} · {t(tutorial.typeKey)}
                </span>
                {learnMod && (
                  <span
                    className={cn(
                      'text-[11px] font-medium px-2 py-0.5 rounded-full',
                      isClaimed
                        ? 'bg-success/10 text-success'
                        : isPending
                          ? 'bg-primary/10 text-primary animate-pulse'
                          : 'bg-surface-secondary text-text-muted',
                    )}
                  >
                    {isClaimed
                      ? t('learn.earn.claimed')
                      : isPending
                        ? t('learn.earn.pendingClaim')
                        : t('learn.earn.reward', { amount: String(learnMod.reward) })}
                  </span>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
