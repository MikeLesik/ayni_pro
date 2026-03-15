import { useState, useEffect, useRef } from 'react';
import {
  Gem,
  Coins,
  Flame,
  TrendingUp,
  Pickaxe,
  Download,
  Lock,
  Compass,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/formatters';
import { TOTAL_ACHIEVEMENTS } from '@/lib/achievementDefs';
import { useMineStore } from '@/stores/mineStore';
import type { Achievement } from '@/types/mine';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n';

/* ── Icon map ──────────────────────────────────────────────── */

const iconMap: Record<string, LucideIcon> = {
  Gem,
  Coins,
  Flame,
  TrendingUp,
  Pickaxe,
  Download,
};

/* ── Category config ───────────────────────────────────────── */

type AchievementCategory = Achievement['category'];

interface CategoryConfig {
  key: AchievementCategory;
  labelKey: TranslationKey;
  Icon: LucideIcon;
  colorClass: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'participation',
    labelKey: 'mine.achievements.categoryExplorer' as TranslationKey,
    Icon: Compass,
    colorClass: 'text-info',
  },
  {
    key: 'production',
    labelKey: 'mine.achievements.categoryMiner' as TranslationKey,
    Icon: Pickaxe,
    colorClass: 'text-gold-dark',
  },
  {
    key: 'milestone',
    labelKey: 'mine.achievements.categoryInvestor' as TranslationKey,
    Icon: TrendingUp,
    colorClass: 'text-success',
  },
  {
    key: 'streak',
    labelKey: 'mine.achievements.categoryVeteran' as TranslationKey,
    Icon: Shield,
    colorClass: 'text-warning',
  },
];

const categoryColorMap: Record<AchievementCategory, string> = {
  participation: 'text-info',
  production: 'text-gold-dark',
  milestone: 'text-success',
  streak: 'text-warning',
};

/* ── AchievementsSection ───────────────────────────────────── */

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');

  // Track newly unlocked IDs from the toast queue
  const toastQueue = useMineStore((s) => s.achievementToastQueue);
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState<Set<string>>(new Set());

  const prevQueueRef = useRef<string[]>([]);
  useEffect(() => {
    const prev = new Set(prevQueueRef.current);
    const added = toastQueue.filter((id: string) => !prev.has(id));
    if (added.length > 0) {
      setNewlyUnlockedIds((s) => {
        const next = new Set(s);
        added.forEach((id: string) => next.add(id));
        return next;
      });
    }
    prevQueueRef.current = [...toastQueue];
  }, [toastQueue]);

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  // Category counts (unlocked only)
  const categoryCounts: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    categoryCounts[cat.key] = achievements.filter(
      (a) => a.category === cat.key && a.unlockedAt,
    ).length;
  }

  // Filter + sort (unlocked first)
  const filtered =
    activeCategory === 'all'
      ? achievements
      : achievements.filter((a) => a.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (a.unlockedAt && !b.unlockedAt) return -1;
    if (!a.unlockedAt && b.unlockedAt) return 1;
    return 0;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg font-semibold text-text-primary">{t('mine.achievements.title')}</h2>
        <span className="text-xs text-text-muted tabular-nums">
          {t('mine.achievements.count', { unlocked: unlockedCount, total: TOTAL_ACHIEVEMENTS })}
        </span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        <CategoryTab
          label={t('mine.achievements.categoryAll' as TranslationKey)}
          count={unlockedCount}
          isActive={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        />
        {CATEGORIES.map((cat) => (
          <CategoryTab
            key={cat.key}
            Icon={cat.Icon}
            label={t(cat.labelKey)}
            count={categoryCounts[cat.key] ?? 0}
            isActive={activeCategory === cat.key}
            onClick={() => setActiveCategory(cat.key)}
          />
        ))}
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-2 gap-2">
        {sorted.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isNewlyUnlocked={newlyUnlockedIds.has(achievement.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── CategoryTab ───────────────────────────────────────────── */

function CategoryTab({
  Icon,
  label,
  count,
  isActive,
  onClick,
}: {
  Icon?: LucideIcon;
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium',
        'transition-all duration-200 whitespace-nowrap flex-shrink-0',
        isActive
          ? 'bg-primary text-white'
          : 'bg-transparent text-text-secondary hover:bg-surface-secondary',
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
      <span className={cn('text-xs tabular-nums', isActive ? 'text-white/70' : 'text-text-muted')}>
        {count}
      </span>
    </button>
  );
}

/* ── AchievementCard ───────────────────────────────────────── */

function AchievementCard({
  achievement,
  isNewlyUnlocked,
}: {
  achievement: Achievement;
  isNewlyUnlocked: boolean;
}) {
  const isUnlocked = !!achievement.unlockedAt;
  const IconComponent = iconMap[achievement.icon] ?? Gem;
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  // Unlock animation state
  const [animPhase, setAnimPhase] = useState<'idle' | 'animating' | 'done'>(
    isNewlyUnlocked && isUnlocked ? 'idle' : 'done',
  );

  useEffect(() => {
    if (isNewlyUnlocked && isUnlocked && animPhase === 'idle') {
      if (reducedMotion) {
        setAnimPhase('done');
        return;
      }
      const timer = setTimeout(() => setAnimPhase('animating'), 200);
      return () => clearTimeout(timer);
    }
  }, [isNewlyUnlocked, isUnlocked, animPhase, reducedMotion]);

  useEffect(() => {
    if (animPhase === 'animating') {
      const timer = setTimeout(() => setAnimPhase('done'), 1200);
      return () => clearTimeout(timer);
    }
  }, [animPhase]);

  const showGrayscale = !isUnlocked || (isNewlyUnlocked && animPhase === 'idle');
  const showShine = animPhase === 'animating';
  const showParticles = animPhase === 'animating';
  const isRevealed = isUnlocked && !showGrayscale;

  const categoryColor = categoryColorMap[achievement.category];
  const title = t(achievement.title as TranslationKey);
  const description = t(achievement.description as TranslationKey);

  const card = (
    <motion.div
      animate={animPhase === 'animating' ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card
        variant="stat"
        className={cn(
          'p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
          'relative overflow-hidden',
          !isUnlocked && 'dark:bg-surface-secondary',
        )}
        style={{
          filter: showGrayscale ? 'grayscale(100%)' : 'grayscale(0%)',
          transition: 'filter 0.4s ease-out',
        }}
      >
        <div className="flex items-start gap-2.5">
          {/* Icon circle */}
          <div
            className={cn(
              'relative flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center',
              'transition-all duration-300',
              isRevealed
                ? cn('bg-primary-light', categoryColor, 'ring-1 ring-gold/30 shadow-gold')
                : 'bg-surface-secondary text-text-muted opacity-30',
            )}
            role="img"
            aria-label={
              isUnlocked
                ? t('mine.achievements.unlocked', { title })
                : t('mine.achievements.locked', { title })
            }
          >
            <IconComponent className="w-4 h-4" aria-hidden="true" />
            {!isUnlocked && (
              <Lock className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-text-muted bg-surface-card rounded-full p-px" />
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h4
              className={cn(
                'text-sm font-medium',
                isRevealed ? 'text-text-primary' : 'text-text-muted',
              )}
            >
              {title}
            </h4>
            <p
              className={cn('text-body-sm', isRevealed ? 'text-text-secondary' : 'text-text-muted')}
            >
              {description}
            </p>
            {isUnlocked && achievement.unlockedAt && (
              <span className="text-xs text-text-muted">{formatDate(achievement.unlockedAt)}</span>
            )}
          </div>
        </div>

        {/* Shine sweep overlay */}
        {showShine && (
          <div
            className="absolute inset-0 pointer-events-none animate-shine-sweep"
            style={{
              background:
                'linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.25) 50%, transparent 60%)',
            }}
          />
        )}

        {/* Particle burst from icon */}
        {showParticles && <CardParticleBurst />}
      </Card>
    </motion.div>
  );

  if (!isUnlocked) {
    return (
      <Tooltip content={t('mine.achievements.lockedTooltip')}>
        <div>{card}</div>
      </Tooltip>
    );
  }

  return card;
}

/* ── CardParticleBurst ─────────────────────────────────────── */

const CARD_PARTICLE_COUNT = 6;

function CardParticleBurst() {
  const particles = useRef(
    Array.from({ length: CARD_PARTICLE_COUNT }, (_, i) => {
      const angle = (i * 360) / CARD_PARTICLE_COUNT + Math.random() * 30 - 15;
      const rad = (angle * Math.PI) / 180;
      const distance = 20 + Math.random() * 16;
      return {
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance,
        size: 3 + Math.random() * 3,
        delay: 0.4 + Math.random() * 0.15,
      };
    }),
  ).current;

  return (
    <div className="absolute top-2 left-3 w-7 h-7 pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            top: '50%',
            left: '50%',
            marginTop: -p.size / 2,
            marginLeft: -p.size / 2,
            background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: p.x, y: p.y, scale: 0.3 }}
          transition={{ duration: 0.6, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
