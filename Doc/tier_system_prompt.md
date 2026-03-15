Стек: React + TypeScript + Vite + Tailwind CSS + Zustand + TanStack Query +
Framer Motion + Radix UI + Lucide React.

Правило для всего промта:
- НЕ используй слова: investment, investor, staking, rewards, earnings, APY, yield, portfolio returns
- ИСПОЛЬЗУЙ: position, participant, contributor, distribution, participation, locked
- Все ссылки на компоненты — по тексту на экране, не по предполагаемым путям файлов
- После каждого шага — жди подтверждения в браузере перед следующим
- Один шаг = один экран = одна валидация

═══════════════════════════════════════════════════════
ШАГ 0 — РАЗВЕДКА ФАЙЛОВОЙ СТРУКТУРЫ
═══════════════════════════════════════════════════════

Перед созданием чего-либо выполни разведку текущей кодовой базы.
Результаты этого шага используются ВО ВСЕХ последующих шагах.

1. Выведи дерево src/ (2 уровня):
   find src/ -maxdepth 2 -type f | head -60

2. Найди файлы страниц: ищи по тексту 'Home', 'Portfolio', 'Position',
   'Settings', 'Learn', 'Earn' в папке с маршрутами (src/app/ или src/pages/).
   Запиши реальные имена файлов.

3. Найди mock-сервис: ищи по тексту 'mock', 'msw', 'handler'.
   Запиши путь к файлу с mock-обработчиками.

4. Найди queryKeys: ищи по тексту 'queryKeys' или 'dashboard'.
   Запиши путь.

5. Найди types/api.ts: ищи по 'DashboardResponse' или 'ApiError'.
   Запиши путь.

6. Найди текст навигации: ищи по 'TabBar', 'NavBar', 'navigation'.
   Запиши точные тексты пунктов меню (Home/Positions/Resources/Participate
   или Home/Portfolio/Learn/Earn — зависит от версии).

7. Проверь наличие useReducedMotion хука.

Выведи резюме: реальные пути файлов, которые ты нашёл.
Используй ЭТИ пути во всех последующих шагах.

═══════════════════════════════════════════════════════
ШАГ 1 — ТИПЫ, КОНСТАНТЫ И ВЫЧИСЛИТЕЛЬНАЯ ЛОГИКА
═══════════════════════════════════════════════════════

Создай файл src/types/tier.ts:

export type TierLevel = 'explorer' | 'contributor' | 'operator' | 'principal';

export const TIER_ORDER: TierLevel[] = ['explorer', 'contributor', 'operator', 'principal'];

export interface TierConfig {
  level: TierLevel;
  label: string;
  minAYNI: number;
  minMonths: number;
  successFeeDiscount: number; // 0 | 5 | 10 | 15
  colorBorder: string;        // CSS hex
  colorBadgeBg: string;       // CSS hex
  iconName: 'Compass' | 'Pickaxe' | 'Settings' | 'Crown';
  perks: string[];
}

export interface UserTierData {
  currentTier: TierLevel;
  highestAchievedTier: TierLevel;   // Permanence: не снижается
  tierSource: 'calculated' | 'permanent' | 'lifetime_grams';
  lockedAYNI: number;
  participationMonths: number;
  lifetimeGrams: number;            // Lifetime Net Allocation in grams
  miningPowerM3h: number;           // lockedAYNI * 4 * 0.000001
  progressToNext: {
    percentage: number | null;      // null если Principal
    ayniCurrent: number;
    ayniRequired: number;
    monthsCurrent: number;
    monthsRequired: number;
    nextTierLabel: string | null;
  };
}

---

Создай файл src/lib/tierConfig.ts:

Экспортируй константу TIER_CONFIG: Record<TierLevel, TierConfig>:

  explorer:
    label: 'Explorer'
    minAYNI: 0, minMonths: 0
    successFeeDiscount: 0
    colorBorder: '#9B9B9B', colorBadgeBg: '#F4F3EF'
    iconName: 'Compass'
    perks: [
      'Standard distribution schedule',
      'Basic mining activity overview',
      'Email support'
    ]

  contributor:
    label: 'Contributor'
    minAYNI: 5000, minMonths: 6
    successFeeDiscount: 5
    colorBorder: '#C9A84C', colorBadgeBg: '#F5EFD7'
    iconName: 'Pickaxe'
    perks: [
      '5% Success Fee reduction',
      'Extended mining analytics',
      'Priority support queue',
      'Quarterly concession reports'
    ]

  operator:
    label: 'Operator'
    minAYNI: 25000, minMonths: 12
    successFeeDiscount: 10
    colorBorder: '#2D8A4E', colorBadgeBg: '#E8F5EC'
    iconName: 'Settings'
    perks: [
      '10% Success Fee reduction',
      'Detailed concession reports with geo data',
      'Early access to new positions',
      'Dedicated support channel',
      'Private Operator community access'
    ]

  principal:
    label: 'Principal'
    minAYNI: 100000, minMonths: 24
    successFeeDiscount: 15
    colorBorder: '#1B3A4B', colorBadgeBg: '#E8F0F4'
    iconName: 'Crown'
    perks: [
      '15% Success Fee reduction',
      'Personal account manager',
      'OTC priority access',
      'Direct AMA access with leadership',
      'Roadmap input sessions',
      'White-glove onboarding for new positions'
    ]

// Lifetime grams пороги (запасной путь к тиру):
export const LIFETIME_GRAMS_THRESHOLDS: Record<TierLevel, number> = {
  explorer: 0,
  contributor: 4.63,
  operator: 54.67,
  principal: 588.76,
}

---

Создай файл src/lib/calculateTier.ts:

Экспортируй функции:

1. compareTiers(a: TierLevel, b: TierLevel): number
   // Возвращает: -1 | 0 | 1 (использует TIER_ORDER)

2. calculateRawTier(lockedAYNI: number, months: number): TierLevel
   // Вычисляет тир по AYNI + месяцам. Principal если оба порога выполнены и т.д.

3. calculateTierFromGrams(lifetimeGrams: number): TierLevel
   // Вычисляет тир по lifetime grams (LIFETIME_GRAMS_THRESHOLDS)

4. resolveEffectiveTier(
     lockedAYNI: number,
     months: number,
     lifetimeGrams: number,
     previousHighest: TierLevel
   ): { tier: TierLevel; source: UserTierData['tierSource'] }
   // Логика:
   // 1. Считает rawTier по AYNI+months
   // 2. Считает gramsTier по grams
   // 3. Берёт максимум из rawTier и gramsTier
   // 4. Сравнивает с previousHighest — берёт максимум (permanence)
   // 5. Возвращает итоговый тир + source ('calculated' | 'permanent' | 'lifetime_grams')

5. calcMiningPower(lockedAYNI: number): number
   // lockedAYNI * 4 * 0.000001

6. calcProgressToNext(
     lockedAYNI: number,
     months: number,
     currentTier: TierLevel
   ): UserTierData['progressToNext']
   // Возвращает прогресс к следующему тиру.
   // Для Principal — все поля null кроме percentage: null.

---

В файле queryKeys (путь из Шага 0) добавь:

  tier: {
    all: ['tier'] as const,
    data: () => [...queryKeys.tier.all, 'data'] as const,
  },
  platform: {
    all: ['platform'] as const,
    stats: () => [...queryKeys.platform.all, 'stats'] as const,
  },

---

В файле types/api.ts (путь из Шага 0) добавь:

export interface TierResponse {
  currentTier: TierLevel;
  highestAchievedTier: TierLevel;
  tierSource: 'calculated' | 'permanent' | 'lifetime_grams';
  lockedAYNI: number;
  participationMonths: number;
  lifetimeGrams: number;
  miningPowerM3h: number;
}

export interface PlatformStatsResponse {
  totalParticipants: number;
  activePositions: number;
  platformMiningPowerM3h: number;
  avgParticipationMonths: number;
}

---

Создай файл src/services/mock/data/tier.ts с тремя моковыми сценариями:

scenario_explorer:
  lockedAYNI: 1200, participationMonths: 3, lifetimeGrams: 0.8
  highestAchievedTier: 'explorer'

scenario_operator:
  lockedAYNI: 30000, participationMonths: 18, lifetimeGrams: 62.0
  highestAchievedTier: 'operator'

scenario_permanent:
  // Был Operator, снизил позицию — проверка permanence
  lockedAYNI: 2000, participationMonths: 14, lifetimeGrams: 55.0
  highestAchievedTier: 'operator'
  // resolveEffectiveTier должна вернуть operator + source: 'permanent'

scenario_principal:
  lockedAYNI: 120000, participationMonths: 30, lifetimeGrams: 620.0
  highestAchievedTier: 'principal'

---

В файле mock-обработчиков (путь из Шага 0) добавь:
GET /api/user/tier → возвращает scenario_operator по умолчанию.
Экспортируй также функцию setMockTierScenario(scenario: string) для переключения
сценариев во время разработки.

---

Создай src/hooks/useTierData.ts:
TanStack Query хук useTierData() — обёртка над GET /api/user/tier.
Используй queryKeys.tier.data() как ключ.
staleTime: 5 * 60 * 1000.
Экспортируй также хелпер useTierConfig() → возвращает TIER_CONFIG[currentTier].

Проверь: npx tsc --noEmit — ошибок нет.

═══════════════════════════════════════════════════════
ШАГ 2 — КОМПОНЕНТ TierCard (Home)
═══════════════════════════════════════════════════════

Создай src/components/ui/TierCard.tsx.

Props:
interface TierCardProps {
  tierData: UserTierData;
  variant?: 'compact' | 'full';  // compact — для Home, full — для Positions
  className?: string;
}

ДИЗАЙН КАРТОЧКИ (variant='compact'):

Обёртка:
  bg: var(--color-surface-card)
  border-radius: 16px
  border-left: 4px solid [colorBorder тира]
  padding: 20px 24px
  shadow: 0 1px 3px rgba(0,0,0,0.04)

Строка 1 — заголовок (flex justify-between items-center):
  Слева: [Lucide иконка тира 20px, цвет colorBorder] + пробел +
         'Contributor Status' (Inter 13px/500, --color-text-muted, uppercase)
  Справа: Badge с именем тира (colorBadgeBg фон, colorBorder текст, rounded-full, px-12 py-4, Inter 13px/600)

Строка 2 — Mining Power (mt-12):
  ⛏ иконка Pickaxe 14px (--color-gold) + пробел +
  'Mining Power:' (Inter 14px, --color-text-secondary) + пробел +
  [значение X.XXXX m³/h] (JetBrains Mono 14px/600, --color-gold)
  Tooltip на иконке ⛏: 'Your processing capacity based on locked AYNI position'

Строка 3 — Permanence badge (показывать ТОЛЬКО если tierSource !== 'calculated'):
  Shield иконка 12px (--color-text-muted) + пробел +
  текст в зависимости от source:
    'permanent' → 'Status retained from previous participation'
    'lifetime_grams' → 'Status maintained via lifetime gold allocation'
  Inter 12px, --color-text-muted, italic

Прогресс-бар (если progressToNext.percentage !== null):
  Заголовок: flex justify-between:
    'Progress to [nextTierLabel]' (Inter 13px, --color-text-secondary)
    '[percentage]%' (Inter 13px/600, --color-text-primary)
  Bar: высота 6px, border-radius 3px
    Track: --color-bg-secondary
    Fill: linear-gradient(90deg, #C9A84C 0%, #E8D48B 100%)
    width: [percentage]%
    анимация: Framer Motion width 1s ease-out при монтировании
    Учитывай useReducedMotion — если true, transition duration: 0
  Подпись: 'Need [ayniNeeded] AYNI + [monthsNeeded] more months'
    Inter 12px, --color-text-muted (если оба условия не выполнены)
    Или только AYNI / только месяцы если одно уже выполнено

Для Principal вместо прогресс-бара:
  Crown иконка 14px (--color-gold) + 'Maximum tier — Principal'
  Inter 13px/500, --color-gold

2 ключевые привилегии (первые 2 из perks[]):
  Каждая: CheckCircle иконка 12px (--color-success) + текст Inter 13px --color-text-secondary
  mt-12

Footer link:
  'View full benefits →' Inter 13px, --color-primary, cursor-pointer
  onClick: navigate к экрану, текст которого в навигации соответствует
  Positions (или Portfolio — по результатам Шага 0)

LOADING STATE: скелетон — rect 120px высота, shimmer анимация.
ERROR STATE: текст 'Unable to load contributor status' + retry кнопка.

---

В файле Home-страницы (путь из Шага 0) найди блок с текстом
'Total Received' или аналогичным крупным числовым показателем.
Добавь <TierCard variant="compact" /> ПОСЛЕ этого блока, ДО секции
с графиком или историей транзакций.
Не трогай существующую вёрстку.

Проверь в браузере: TierCard видна на Home, Mining Power отображается,
прогресс-бар анимируется при загрузке страницы.

═══════════════════════════════════════════════════════
ШАГ 3 — ContributorStatus (Positions)
═══════════════════════════════════════════════════════

Создай src/components/portfolio/ContributorStatus.tsx.
Использует useTierData() и TIER_CONFIG.

СЕКЦИЯ 1 — Current Status Card (TierCard variant="full"):
  Расширь TierCard: вместо 2 perks — показывай все perks[] с CheckCircle.
  Добавь строку 'Active since [дата первой позиции] · [N] months'
  Inter 13px --color-text-muted.

СЕКЦИЯ 2 — Path to Next Tier (если не Principal):
  Заголовок H3: 'Path to [nextTierLabel]'
  Два отдельных progress bar:

  Bar 1 — AYNI Position:
    Label flex: 'AYNI Position' + '[current] / [required] AYNI'
    Bar: gold gradient, height 8px
    Subtext если выполнено: '✓ Position requirement met' (--color-success)

  Bar 2 — Participation Period:
    Label flex: 'Participation Period' + '[current] / [required] months'
    Bar: gold gradient, height 8px
    Subtext если выполнено: '✓ Period requirement met' (--color-success)

  Если tierSource === 'permanent': добавь info-card:
    bg --color-warning-light, border 1px --color-warning, radius 12px, p 16px
    Shield иконка + текст:
    'Your Operator status is preserved. Increase your position
     to resume progress toward Principal.'

  Если tierSource === 'lifetime_grams': добавь info-card (bg --color-primary-light):
    'Your Contributor status is maintained via your lifetime gold allocation.'

СЕКЦИЯ 3 — All Tiers Table:
  Таблица 5 колонок: Tier | Min Position | Min Period | Fee Reduction | Key Benefit
  Данные из TIER_CONFIG (все 4 тира).
  Текущий тир пользователя:
    row bg: colorBadgeBg тира
    border-left: 4px solid colorBorder тира
    badge 'Current' рядом с названием тира
  Тиры ниже текущего: CheckCircle иконка в первой ячейке, opacity 0.7
  Тиры выше текущего: Lock иконка в первой ячейке, opacity 0.6
  На mobile: таблица скроллится горизонтально (overflow-x: auto).

СЕКЦИЯ 4 — CTA (только если не Principal):
  Card: bg --color-gold-light, border 1px --color-border, radius 16px, p 20px
  Текст: 'Reach [nextTierLabel]: add [ayniNeeded] AYNI to your position'
  Inter 15px --color-text-primary
  Button 'Add to Position' variant outline --color-primary
  onClick: navigate к экрану, текст которого в навигации соответствует
  Participate (или Earn — по результатам Шага 0)

---

В файле Positions/Portfolio страницы (путь из Шага 0) найди конец
страницы (после блока позиций / истории).
Добавь заголовок секции 'Contributor Status' H2 перед компонентом.
Добавь <ContributorStatus /> после заголовка.
Не трогай существующую вёрстку позиций.

Проверь в браузере: секция видна в Positions, таблица тиров корректна,
активный тир подсвечен, CTA ведёт на нужный экран.

═══════════════════════════════════════════════════════
ШАГ 4 — TierBadge в Settings
═══════════════════════════════════════════════════════

Создай src/components/ui/TierBadge.tsx.
Props: { tier: TierLevel; size?: 'sm' | 'md'; onClick?: () => void }

Дизайн (size='sm'):
  inline-flex items-center gap-4
  bg: colorBadgeBg тира, border: 1px solid colorBorder тира
  border-radius: 20px, px: 10px, py: 4px
  [Lucide иконка тира 12px, цвет colorBorder] + [label тира Inter 12px/600, colorBorder]
  Если onClick: cursor-pointer, hover opacity 0.85

В файле Settings страницы (путь из Шага 0) найди блок с именем
пользователя и аватаром (ориентируйся по тексту с именем/email
пользователя в шапке страницы).
Добавь <TierBadge tier={tierData.currentTier} size="sm"
  onClick={() => navigate к экрану Positions/Portfolio (по результатам Шага 0)} />
рядом с именем. Radix Tooltip на бейдже: 'View your contributor status'.
Добавь loading skeleton 60×20px пока useTierData() загружается.

Проверь в браузере: TierBadge в Settings кликабелен,
ведёт на экран Positions.

═══════════════════════════════════════════════════════
ШАГ 5 — Страница Contributor Tiers в Learn/Resources
═══════════════════════════════════════════════════════

В файле Learn/Resources страницы (путь из Шага 0) найди список
статей или карточек (ориентируйся по заголовкам существующих
материалов в разделе обучения).
Добавь новую карточку:
  Иконка: Award (Lucide)
  Заголовок: 'Contributor Tiers'
  Описание: 'How your participation tier is calculated and what benefits it unlocks'
  При клике — разворачивать inline или открывать модал/подэкран.

Содержимое страницы Contributor Tiers:

Блок 1 (если залогинен) — персональный статус:
  Компактная TierCard (variant='compact') без прогресс-бара.
  Ссылка 'See full status →' → экран Positions/Portfolio.

Блок 2 — 'How Tiers Work':
  H2 + параграф: объяснение системы.
  Текст: 'Your contributor tier is determined by two factors: the volume of
  your locked AYNI position and the length of your participation period.
  Higher tiers unlock reduced Success Fees and additional benefits.'
  Использовать только: 'locked AYNI position', 'participation period',
  'distributions', 'contributor benefits'. Без 'investment', 'earnings'.

  О Mining Power: 'Mining Power represents your share of ore processing
  capacity across AYNI gold mining concessions. 1 AYNI = 4 cm³/hour.
  This is a gold mining industry metric measuring physical processing
  capacity, not a financial return indicator.'

Блок 3 — карточки 4 тиров (grid-cols-2 на desktop, stack на mobile):
  Каждая карточка: border-left colorBorder, bg colorBadgeBg, p 20px, radius 16px
  [Иконка] + [Название] + [Условия входа] + [список perks через CheckCircle]
  Текущий тир пользователя: gold box-shadow 0 0 0 2px #C9A84C

Блок 4 — FAQ (Radix Accordion):
  Q: 'How is my contributor tier determined?'
  A: 'Your tier is based on the combined volume of your locked AYNI position
      and the length of your participation period.'

  Q: 'Will I lose my tier if I close a position?'
  A: 'No. Once you reach a tier, it is permanently retained — even if your
      active position decreases. Your tier reflects your participation history.'

  Q: 'What is Mining Power?'
  A: 'Mining Power represents your share of ore processing capacity across
      AYNI concessions. 1 AYNI = 4 cm³/hour. It is a technical measure of
      your participation in gold mining operations, not a financial metric.'

  Q: 'When does my tier update after I add to my position?'
  A: 'Tier updates are processed within 24 hours of your position being confirmed.'

Проверь в браузере: страница тиров в Learn/Resources открывается,
FAQ аккордеон работает, текущий тир подсвечен.

═══════════════════════════════════════════════════════
ШАГ 6 — CommunityStats (Home)
═══════════════════════════════════════════════════════

Создай src/components/home/CommunityStats.tsx.

В файле mock-обработчиков (путь из Шага 0) добавь:
GET /api/platform/stats → {
  totalParticipants: 47,
  activePositions: 89,
  platformMiningPowerM3h: 14.2,
  avgParticipationMonths: 11.4
}

Хук usePlatformStats() — обёртка над GET /api/platform/stats.
Используй queryKeys.platform.stats() как ключ.
staleTime: 5 * 60 * 1000.

Компонент — 4 метрики в ряд (grid-cols-4 desktop / grid-cols-2 mobile):
  Каждая ячейка: bg --color-bg-secondary, border 1px --color-border-light,
  radius 12px, p 16px, text-center

  1. [число] / 'Total Participants'
  2. [число] / 'Active Positions'
  3. [X.X m³/h] (JetBrains Mono) / 'Platform Mining Power'
  4. [X.X months] / 'Avg Participation'

  Числа: Inter 20px/700 --color-text-primary
  Labels: Inter 12px --color-text-muted
  Loading: skeleton 4 ячейки

НЕ показывать: суммы в USD, % доходности, суммы дистрибуций.

В файле Home-страницы (путь из Шага 0) добавь секцию
'Community Overview' H3 + <CommunityStats />
ПОСЛЕ TierCard, ДО графика/истории.

Проверь в браузере: CommunityStats видна на Home, 4 метрики отображаются,
mobile 2×2 grid корректен.

═══════════════════════════════════════════════════════
ШАГ 7 — Финальный compliance-аудит + QA
═══════════════════════════════════════════════════════

ЧАСТЬ А — Compliance-аудит:

Пройдись по всем новым файлам и выполни текстовый поиск.

ЗАПРЕЩЁННЫЕ слова — если найдены, замени:
  'investment' → 'position'
  'investor' → 'participant' или 'contributor'
  'staking' / 'stake' в UI-тексте → 'locked position' или 'active position'
  'rewards' → 'distributions'
  'earnings' → 'distributions' или 'allocation'
  'APY' / 'yield' → убрать или заменить на 'distribution rate'
  'Top Earners' → убрать
  'earn' в контексте дохода → 'receive distributions'

ЧАСТЬ Б — Проверка навигационных текстов:

Убедись что все CTA и ссылки используют РЕАЛЬНЫЕ тексты навигации
из Шага 0 (не 'Portfolio' если в навигации 'Positions', не 'Earn'
если в навигации 'Participate').

ЧАСТЬ В — Проверка prefers-reduced-motion:

Если в проекте есть useReducedMotion хук — убедись что прогресс-бар
в TierCard использует его. Если хука нет — создай:

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  Прогресс-бар: transition duration: 0 если reduced motion.

ОБЯЗАТЕЛЬНАЯ ПРОВЕРКА ПОСЛЕ АУДИТА:
  1. npx tsc --noEmit — ноль ошибок
  2. Переключи мок на scenario_permanent — TierCard показывает Shield + 'Status retained'
  3. Переключи на scenario_principal — прогресс-бар скрыт, Crown + 'Maximum tier'
  4. Переключи на scenario_explorer — CTA 'Add to Position' видна в Positions
  5. Проверь mobile (375px): TierCard full-width, таблица тиров скроллится,
     CommunityStats 2×2 grid
  6. Проверь dark mode: все новые компоненты корректно читаются
  7. Проверь prefers-reduced-motion: reduce — анимации отключены
  8. Проверь что все навигационные ссылки ведут на правильные экраны
