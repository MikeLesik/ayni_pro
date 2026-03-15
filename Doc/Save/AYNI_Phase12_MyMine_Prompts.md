# ФАЗА 12: My Mine (Gamification) — Детальные промты для Claude Code

---

## Контекст

My Mine — визуальная метафора прогресса инвестора. Чем больше стейк, тем масштабнее "шахта". Это ключевой engagement-механизм для ритейла: ежедневный вход, ощущение "я расту", геймифицированный upsell.

Приоритет по бэклогу: P3 Q3-Q4, но визуальная готовность нужна раньше как placeholder.

---

## Промт 12.1 — Типы, API-контракт, Store, Mock Data

```
Прочитай AYNI_Technical_Implementation_Brief.md и дизайн-спецификацию.
Нам нужна страница My Mine (/my-mine) — геймификация прогресса инвестора.

Сначала создай всю data-layer:

1. src/types/mine.ts:

export type MineLevel = 1 | 2 | 3 | 4 | 5;

export interface MineLevelConfig {
  level: MineLevel;
  name: string;               // Explorer, Prospector, Operation, Mining Camp, Gold Empire
  minStake: number;            // $100, $1000, $5000, $25000, $100000
  maxStake: number | null;     // null для последнего уровня
  description: string;         // "A tent with a pickaxe by the river..."
  workers: number;             // 1, 3, 8, 15, 50
  equipment: string;           // "Basic pickaxe", "Sluice box", "Excavator", etc
  outputMultiplier: number;    // 1.0, 1.2, 1.5, 2.0, 3.0
  illustrationId: string;      // ключ для выбора иллюстрации
}

export interface MineStats {
  currentLevel: MineLevel;
  levelName: string;
  totalStaked: number;
  nextLevelThreshold: number | null;
  amountToNextLevel: number | null;
  progressToNextLevel: number;  // 0-100
  nextLevelName: string | null;
  
  dailyProduction: {
    goldGrams: number;
    usdValue: number;
  };
  weeklyProduction: {
    goldGrams: number;
    usdValue: number;
  };
  totalProduction: {
    goldGrams: number;
    usdValue: number;
  };
  
  streak: {
    currentDays: number;
    longestDays: number;
    lastVisit: string;          // ISO date
  };
  
  mineDetails: {
    workers: number;
    equipment: string;
    efficiency: number;         // 0-100
    outputPerDay: string;       // "0.002g/day"
  };

  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;                // lucide icon name
  unlockedAt: string | null;   // null = locked
  category: 'production' | 'streak' | 'investment' | 'milestone';
}

export interface MineEvent {
  type: 'level_up' | 'achievement' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
}

2. src/lib/mineConfig.ts — конфигурация уровней:

export const MINE_LEVELS: MineLevelConfig[] = [
  {
    level: 1,
    name: 'Explorer',
    minStake: 100,
    maxStake: 999,
    description: 'A tent with a pickaxe by the river. One person panning for gold.',
    workers: 1,
    equipment: 'Basic pickaxe & pan',
    outputMultiplier: 1.0,
    illustrationId: 'explorer',
  },
  {
    level: 2,
    name: 'Prospector',
    minStake: 1000,
    maxStake: 4999,
    description: 'A small mine with 2-3 workers and a sluice box.',
    workers: 3,
    equipment: 'Sluice box & hand tools',
    outputMultiplier: 1.2,
    illustrationId: 'prospector',
  },
  {
    level: 3,
    name: 'Operation',
    minStake: 5000,
    maxStake: 24999,
    description: 'A base camp with an excavator, barracks, and conveyor belt.',
    workers: 8,
    equipment: 'Excavator & conveyor',
    outputMultiplier: 1.5,
    illustrationId: 'operation',
  },
  {
    level: 4,
    name: 'Mining Camp',
    minStake: 25000,
    maxStake: 99999,
    description: 'A quarry with multiple processing lines, warehouses, and generators.',
    workers: 15,
    equipment: 'Multi-line processing',
    outputMultiplier: 2.0,
    illustrationId: 'mining-camp',
  },
  {
    level: 5,
    name: 'Gold Empire',
    minStake: 100000,
    maxStake: null,
    description: 'A full-scale operation: multiple lines, helicopter, office building.',
    workers: 50,
    equipment: 'Full industrial complex',
    outputMultiplier: 3.0,
    illustrationId: 'gold-empire',
  },
];

export function getLevelForStake(totalStaked: number): MineLevelConfig {
  for (let i = MINE_LEVELS.length - 1; i >= 0; i--) {
    if (totalStaked >= MINE_LEVELS[i].minStake) return MINE_LEVELS[i];
  }
  return MINE_LEVELS[0];
}

export function getNextLevel(currentLevel: MineLevel): MineLevelConfig | null {
  return MINE_LEVELS.find(l => l.level === currentLevel + 1) || null;
}

export function getProgressToNextLevel(totalStaked: number, currentLevel: MineLevelConfig): number {
  const nextLevel = getNextLevel(currentLevel.level);
  if (!nextLevel) return 100;
  const range = nextLevel.minStake - currentLevel.minStake;
  const progress = totalStaked - currentLevel.minStake;
  return Math.min(Math.round((progress / range) * 100), 100);
}

3. src/services/mineService.ts — mock API:

// GET /api/mine
export async function getMineStats(): Promise<MineStats> {
  await new Promise(r => setTimeout(r, 600));
  return {
    currentLevel: 1,
    levelName: 'Explorer',
    totalStaked: 414.68,
    nextLevelThreshold: 1000,
    amountToNextLevel: 585.32,
    progressToNextLevel: 41.5,
    nextLevelName: 'Prospector',
    dailyProduction: { goldGrams: 0.002, usdValue: 0.39 },
    weeklyProduction: { goldGrams: 0.014, usdValue: 2.73 },
    totalProduction: { goldGrams: 0.14, usdValue: 27.30 },
    streak: { currentDays: 15, longestDays: 15, lastVisit: new Date().toISOString() },
    mineDetails: { workers: 1, equipment: 'Basic pickaxe & pan', efficiency: 80, outputPerDay: '0.002g/day' },
    achievements: [
      { id: 'first-invest', title: 'First Investment', description: 'Made your first investment', icon: 'Gem', unlockedAt: '2025-12-18T00:00:00Z', category: 'investment' },
      { id: 'first-reward', title: 'First Gold', description: 'Received your first daily reward', icon: 'Coins', unlockedAt: '2025-12-19T00:00:00Z', category: 'production' },
      { id: 'streak-7', title: '7-Day Streak', description: 'Visited 7 days in a row', icon: 'Flame', unlockedAt: '2025-12-25T00:00:00Z', category: 'streak' },
      { id: 'streak-14', title: '14-Day Streak', description: 'Visited 14 days in a row', icon: 'Flame', unlockedAt: '2026-01-01T00:00:00Z', category: 'streak' },
      { id: 'stake-500', title: 'Half a Grand', description: 'Total investments reached $500', icon: 'TrendingUp', unlockedAt: null, category: 'investment' },
      { id: 'prospector', title: 'Prospector', description: 'Reach Level 2', icon: 'Pickaxe', unlockedAt: null, category: 'milestone' },
      { id: 'streak-30', title: '30-Day Streak', description: 'Visited 30 days in a row', icon: 'Flame', unlockedAt: null, category: 'streak' },
      { id: 'first-payout', title: 'Payday!', description: 'Received your first quarterly payout', icon: 'Download', unlockedAt: null, category: 'production' },
    ],
  };
}

4. src/hooks/useMine.ts:
   import { useQuery } from '@tanstack/react-query';
   export function useMine() {
     return useQuery({ queryKey: ['mine'], queryFn: getMineStats, staleTime: 60_000 });
   }

5. Добавь route /my-mine в routes.tsx:
   const MyMinePage = lazy(() => import('@/pages/MyMinePage'));
   { path: '/my-mine', element: withSuspense(MyMinePage) }
```

---

## Промт 12.2 — Иллюстрация шахты (CSS/SVG изометрия)

```
Создай CSS/SVG изометрическую иллюстрацию шахты для My Mine. 
Это КЛЮЧЕВОЙ визуальный элемент страницы.

src/components/mine/MineIllustration.tsx:

Принципы:
- Изометрический вид (как в Clash of Clans, но проще)
- Тёплая палитра: земляные тона (#8B7355, #A0522D, #6B4226) + золотые акценты (--color-gold)
- Всё рисуется CSS + inline SVG (без внешних картинок)
- 5 вариантов иллюстрации для 5 уровней
- Анимация при загрузке: элементы появляются последовательно (stagger)

Props:
  level: MineLevel (1-5)
  animated?: boolean
  className?: string

Уровень 1 — Explorer:
- Фон: зелёная трава (gradient #4a7c3f → #3d6b35), река (blue curve #5b9bd5)
- Палатка: треугольник (коричневый canvas, #A0522D), палки
- Костёр: маленький orange circle с glow
- Человек: простая фигурка у реки (stick figure или простая геометрия)
- Кирка: маленькая рядом с палаткой
- Микро-анимация: вода в реке (subtle shimmer), дым от костра (css animation, 3 circles rising)

Уровень 2 — Prospector:
- Всё из уровня 1 +
- Деревянная хижина вместо палатки (прямоугольник + треугольная крыша)
- Промывочный лоток (sluice box): длинный коричневый прямоугольник у реки
- 2-3 фигурки рабочих
- Маленькая тачка с породой

Уровень 3 — Operation:
- Масштабнее:
- Бетонное/металлическое здание (серый прямоугольник)
- Экскаватор (жёлтый, простая геометрия: квадратный корпус + рычаг + ковш)
- Конвейер (наклонная полоса с движущимися блоками — css animation)
- Бараки (2-3 прямоугольника)
- 5+ фигурок
- Генератор (серый box с exhaust)

Уровень 4 — Mining Camp:
- Карьер: большая яма (градиент от коричневого к тёмному)
- Несколько конвейеров
- Склады (большие прямоугольники)
- Грузовики (2-3 штуки, с анимацией движения по дороге)
- Осветительные вышки (тонкие линии + yellow circles)

Уровень 5 — Gold Empire:
- Всё из 4 + 
- Офисное здание (стеклянное, с отражением)
- Вертолётная площадка (H circle) с вертолётом
- Множество линий обработки
- Золотые слитки (stack) на складе
- Ограждение периметра

Реализация:
- Каждый уровень — отдельный SVG или div composition
- Используй CSS transforms для изометрии: transform: rotateX(55deg) rotateZ(-45deg) или 
  skew для pseudo-3D
- Или проще: плоский top-down с тенями для глубины
- Container: w-full, h-[300px] desktop / h-[220px] mobile, rounded-xl, overflow-hidden
- Background: gradient для "земли"

ВАЖНО: не делай слишком сложно. Лучше стилизованная простота (geometric/low-poly) 
чем попытка реализма. Think "Monument Valley" или "Alto's Odyssey" стилистика.
Все элементы — CSS shapes и simple SVGs.

Если изометрия слишком сложна — сделай side-view (как 2D платформер):
- Горизонт line
- Земля снизу (коричневый gradient)
- Небо сверху (subtle blue/cream gradient)
- Элементы шахты расставлены по "сцене"
- Parallax-like layers для глубины

Анимации (Framer Motion):
- При загрузке: элементы появляются снизу вверх, stagger 100ms
- Микро-анимации (infinite, subtle):
  - Дым от генератора/костра: 3 circles, scale + opacity + translateY, 2-3s loop
  - Вода в реке: horizontal gradient shimmer
  - Грузовики (уровень 4+): translateX туда-сюда, 8s linear loop
  - Ковш экскаватора (уровень 3+): rotate покачивание, 4s ease-in-out loop
- prefers-reduced-motion: все бесконечные анимации отключаются

Level-up анимация (показывается при смене уровня):
- Текущая сцена уменьшается (scale 1 → 0.8), новые элементы fade in
- Flash gold overlay (opacity 0 → 0.3 → 0), 0.5s
- Confetti-like золотые частицы (5-8 кружков, random positions, scale + fade out)
```

---

## Промт 12.3 — Компоненты страницы My Mine

```
Создай все компоненты для страницы My Mine:

1. src/components/mine/MineHeader.tsx:
   - "My Mine" — heading-1 (DM Serif Display)
   - "Level {N}: {Name}" — heading-3, text-gold
   - Badge с текущим уровнем: bg gold-light, text gold-dark, rounded-full, px-3 py-1
   - Если premium (tier): дополнительный "⭐ Premium" badge

2. src/components/mine/MineLevelProgress.tsx:
   - Полоска прогресса до следующего уровня
   - Layout: 
     Left label: "{currentName}" — body-sm, font-semibold, text-primary
     Right label: "{nextName}" — body-sm, text-muted  (или "Max level" если уровень 5)
     Progress bar: h-3, rounded-full, bg bg-secondary
       Fill: gold gradient, animated width, rounded-full
       Процент label по центру заполненной части: body-sm, font-bold
     Below: "Invest ${amountToNextLevel} more to reach {nextName}" — body-sm, text-secondary, mt-2
   - Props: currentLevel, nextLevel, progress, amountNeeded
   - Если уровень максимальный: "🏆 You've reached the highest level!" text-gold

3. src/components/mine/DailyProductionCard.tsx:
   - Card variant="action" (gold gradient overlay), p-6
   - "Today's production" — heading-3
   - Центральный блок:
     Gold nugget icon (Gem from lucide, 32px, text-gold, с glow анимацией: 
       box-shadow pulse gold, 2s infinite)
     "{goldGrams}g of gold" — display-lg, text-primary, CountUpNumber
     "≈ ${usdValue}" — number-md, text-gold, mt-1
   - Streak badge снизу: 
     [🔥 icon] "Day {streak.currentDays} streak" — body-sm, bg warning-light, text-warning, 
     rounded-full, px-3, py-1, inline-flex
   - Weekly summary: "This week: {weeklyGrams}g · ${weeklyUsd}" — body-sm, text-secondary, mt-3

4. src/components/mine/MineStatsGrid.tsx:
   - Grid 2×2 (desktop) / 2×2 (mobile), gap-4
   - 4 stat карточки (Card variant="stat", p-4):
     [Workers]: icon Users, value "{workers}", sublabel based on level
     [Equipment]: icon Wrench, value "{equipment}" (name), truncate if long
     [Output]: icon Gauge, value "{outputPerDay}", sublabel "daily"
     [Efficiency]: icon Activity, value "{efficiency}%", 
       color: ≥80 success, ≥50 warning, <50 error
   - Каждая: icon 20px top-left, label-sm muted, value heading-4

5. src/components/mine/UpgradeCTA.tsx:
   - Показывается если currentLevel < 5
   - Card variant="stat", p-6, border dashed border-gold/30
   - "Upgrade your mine" — heading-3
   - "Invest ${amountToNextLevel} more to reach {nextLevelName} level" — body-md, text-secondary
   - Preview what's next: "Unlock: {nextLevel.workers} workers, {nextLevel.equipment}" — body-sm, text-muted
   - [Invest and upgrade →] Gold CTA button → navigate('/earn')
   - Если уровень 5: скрыт

6. src/components/mine/AchievementsSection.tsx:
   - "Achievements" — heading-2
   - Grid: 2 columns (desktop) / 1 column (mobile), gap-3
   - Каждое achievement:
     Card, p-4, flex items-center gap-3
     Unlocked:
       Icon circle 40px: bg gold-light, text-gold, icon from lucide
       Title: heading-4, text-primary
       Description: body-sm, text-secondary
       Date: body-sm, text-muted, right-aligned
     Locked:
       Icon circle 40px: bg bg-secondary, text-text-muted, opacity-50
       Title: heading-4, text-muted
       Description: body-sm, text-muted
       Lock icon badge corner
     Hover on locked: "Keep going!" tooltip
   - Separate by category: production, streak, investment, milestone
     или просто unlocked first, locked after

7. src/components/mine/MineTimeline.tsx (optional — если хватит scope):
   - "Mine history" — heading-3
   - Timeline вертикальный:
     [dot] "You started mining" — Dec 18, 2025
     [dot] "First gold received" — Dec 19, 2025
     [dot] "7-day streak!" — Dec 25, 2025
     [dot] "14-day streak!" — Jan 1, 2026
     [dot gold, dashed after] "Next: Reach Prospector level" — goal
   - Dot: 12px circle, bg primary (past) / bg gold (milestone) / border dashed (future)
   - Line: 2px vertical, bg border-light
   - Each: title body-md + date body-sm text-muted

8. src/pages/MyMinePage.tsx:
   - useMine() hook для данных
   - Layout:
     MineHeader
     MineIllustration (level={stats.currentLevel}), mt-6
     MineLevelProgress, mt-4
     DailyProductionCard, mt-8
     MineStatsGrid, mt-6
     UpgradeCTA, mt-8
     AchievementsSection, mt-10
     MineTimeline (optional), mt-10
   
   - Loading state:
     Skeleton для illustration (h-[300px] rounded-xl)
     Skeleton для каждой секции
   
   - Анимации при загрузке:
     Stagger все блоки: initial opacity 0 y 12px → animate opacity 1 y 0
     DailyProductionCard: gold nugget appears with scale bounce
     Stats grid: count-up на numbers
```

---

## Промт 12.4 — Интеграция с Home + NavBar

```
Интегрируй My Mine в существующий app:

1. Добавь "My Mine" в навигацию:
   - Desktop NavBar: добавь между Portfolio и Activity: 
     "My Mine" с иконкой Pickaxe (lucide)
   - Mobile BottomTabBar: замени "More" (5-я tab) на "My Mine" с Pickaxe icon
     "More" перенеси в avatar dropdown
   - Active state: text-gold вместо text-primary (уникальный цвет для My Mine tab)

2. Home page — добавь Mine Preview Card:
   Между QuickStatsRow и EarningsChart добавь:
   
   src/components/home/MinePreviewCard.tsx:
   - Card variant="action" (gold gradient overlay), p-5, cursor-pointer, onClick → /my-mine
   - Layout: flex row (desktop) / col (mobile)
   - Left: 
     Мини-иллюстрация шахты (simplified: 80×80px, css shapes, текущий уровень)
     или просто icon Pickaxe 32px в gold circle
   - Center:
     "My Mine · Level {N}: {Name}" — heading-4
     "Today: {goldGrams}g produced · ${usdValue}" — body-sm, text-secondary
     ProgressBar (mini): h-1.5, w-[120px], gold fill, inline
     "{progress}% to {nextLevelName}" — body-sm, text-muted
   - Right (desktop):
     [View mine →] ghost btn, text-gold
   - Hover: shadow-md, subtle gold glow
   - Показывается ТОЛЬКО если у юзера есть хотя бы одна позиция

3. Daily entry animation (первый вход за день):
   - При первом посещении /home или /my-mine за сутки:
     Toast/notification сверху:
     "Your mine produced {goldGrams}g of gold today! ≈ ${usdValue}"
     С иконкой Gem (gold, animated glow)
     Auto-dismiss через 5s или по клику
   - Реализуй через onboardingStore или отдельный store:
     lastDailyNotification: string (date)
     Показывай если lastDailyNotification !== today
   
4. Streak tracking:
   - При каждом визите → обнови lastVisit в store
   - Показывай streak badge на Home + My Mine
   - 🔥 Fire icon рядом с avatar в NavBar если streak ≥ 7

5. Achievement notifications:
   - Когда пользователь разблокирует achievement:
     Toast notification: "🏆 Achievement unlocked: {title}!"
     Gold border, success pulse animation
   - Пока mock: показывай при первом посещении My Mine
```

---

## Промт 12.5 — Dark Mode + Polish

```
Финальный polish для My Mine:

1. Dark mode:
   - MineIllustration: тёмный фон (ночная сцена)
     Небо: dark blue gradient (#0a1628 → #1a2740)
     Звёзды: 10-15 маленьких white dots, opacity 0.6, random twinkle animation
     Элементы: чуть светлее для контраста
     Костёр/огни: ярче (orange glow увеличен)
     Вода: darker blue
   - DailyProductionCard: glass card variant в dark mode
   - Gold nugget glow: ярче в dark mode
   - Achievement locked cards: bg slightly lighter than surface

2. Responsive:
   - MineIllustration: h-[220px] на mobile, h-[300px] на desktop
   - MineStatsGrid: 2×2 на всех размерах
   - AchievementsSection: 1 column на mobile
   - DailyProductionCard: full-width, centered content
   - UpgradeCTA: full-width, text centered на mobile

3. Accessibility:
   - MineIllustration: role="img", aria-label="Isometric illustration of your Level {N} {Name} mine"
   - Animations: отключаются при prefers-reduced-motion
   - Achievement icons: aria-label для каждого
   - Progress bar: role="progressbar", aria-valuenow, aria-label
   - Streak badge: aria-label="Current login streak: {N} days"

4. Микро-взаимодействия:
   - Клик на иллюстрацию: subtle zoom pulse (scale 1.02 → 1, 0.3s)
   - Achievement hover: card lift (translateY -2px, shadow-md)
   - Level progress bar: при загрузке — заполняется с задержкой 0.5s, duration 1.5s
   - Stats numbers: count-up при первом появлении (IntersectionObserver)
   - Upgrade CTA: subtle border pulse animation (gold dashed border opacity oscillates)

5. Тестовые данные для разных уровней:
   В mockData добавь функцию getMineStatsByLevel(level) чтобы можно было 
   тестировать все 5 уровней визуально.
   Добавь query param: /my-mine?testLevel=3 → показывает уровень 3 с mock данными.
   Это поможет проверить все иллюстрации и UI для каждого уровня.
```

---

## Проверка после Фазы 12

```
Открой /my-mine и проверь для каждого уровня (используй ?testLevel=1..5):

- [ ] Иллюстрация меняется для каждого уровня
- [ ] Микро-анимации работают (дым, вода, грузовики)
- [ ] Progress bar до следующего уровня корректный
- [ ] Daily production с gold nugget glow
- [ ] Streak badge показывает дни
- [ ] Stats grid: Workers, Equipment, Output, Efficiency
- [ ] Achievements: unlocked показаны полноцветно, locked — затемнённые
- [ ] Upgrade CTA: корректная сумма, ведёт на /earn
- [ ] Для уровня 5: "Max level reached", CTA скрыт, progress 100%
- [ ] Dark mode: ночная сцена, звёзды, ярче огни
- [ ] Mobile: всё стекается, illustration меньше, grid 2×2
- [ ] Home page: Mine Preview Card показывается, ведёт на /my-mine
- [ ] NavBar: "My Mine" tab с Pickaxe icon
- [ ] prefers-reduced-motion: бесконечные анимации отключены
```
