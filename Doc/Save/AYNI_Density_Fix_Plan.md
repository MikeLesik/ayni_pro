# AYNI Gold — Фикс плотности и spacing (Design Density Fix)

## Диагноз

Проблема не в отдельных компонентах, а в 5 системных вещах:

### 1. Раздутые внутренние отступы карточек
Сейчас: p-6/p-7/p-8 (24-32px) внутри каждой карточки.
Нужно: p-4/p-5 (16-20px) для stat-карточек, p-5/p-6 (20-24px) для больших.

### 2. Слишком большие gap между секциями  
Сейчас: gap-6 (24px) между секциями на Home.  
Нужно: gap-4 (16px) для плотных страниц, gap-5 (20px) максимум.

### 3. Однокиноколоночный layout там, где нужен multi-column
Сейчас: всё стопкой.  
Нужно: Home — hero + stats в одну зону; Earn — 2 колонки; My Mine — production + stats сбоку.

### 4. Hero card слишком большой
Сейчас: p-8, число display-hero (56px), ring 120px — всё крупно и с воздухом.
Нужно: Компактнее — p-5/p-6, число 40-48px, ring 96px.

### 5. Элементы не используют ширину
Сейчас: max-w-1200px + большой padding = контент ~900-1000px, одна колонка.
Нужно: Тот же max-width, но плотнее заполнен, 2-3 колонки для данных.

---

## Поэкранный фикс

### HOME — основные проблемы и решения

```
БЫЛО:                              СТАЛО:
┌─────────────────────────┐        ┌──────────────────────────────┐
│ Good evening, Alex      │ pt-8   │ Good evening, Alex           │ pt-5
│                         │        │                              │
│ ┌─────────────────────┐ │        │ ┌──────────┬────────────────┐│
│ │  TOTAL EARNED       │ │ p-8    │ │TOTAL     │ [$] $12,500   ││ p-5
│ │  $8.63              │ │        │ │$8.63     │ [↗] $0.39/day ││ 
│ │  +$0.39 today       │ │        │ │+$0.39    │ [⏱] Apr 28   ││
│ │          ◯ 60 days  │ │        │ │today  ◯  │               ││
│ └─────────────────────┘ │        │ └──────────┴────────────────┘│
│                         │ gap-6  │                              │ gap-4
│ ┌───┐  ┌───┐  ┌───┐    │        │ ┌─ Mine preview ────────────┐│
│ │$12k│  │$0.39│ │Apr│   │ p-5    │ │ Lvl 1 · 0.002g · 41.5%   ││ p-3
│ └───┘  └───┘  └───┘    │        │ └───────────────────────────┘│
│                         │ gap-6  │                              │ gap-4
│ ┌─ Mine preview ──────┐ │        │ ┌─ Chart ──────────────────┐│
│ │ ...                 │ │        │ │ 180px height, p-4        ││
│ └─────────────────────┘ │        │ └───────────────────────────┘│
│                         │ gap-6  │                              │ gap-4
│ ┌─ Chart ─────────────┐ │        │ ┌─ Daily earnings ─────────┐│
│ │ 200px height, p-6   │ │        │ │ compact rows 12px py     ││
│ └─────────────────────┘ │        │ └───────────────────────────┘│
│                         │ gap-6  │                              │ gap-4
│ ┌─ Daily earnings ────┐ │        │ ┌─ CTA banner ─────────────┐│
│ │ rows, p-6           │ │        │ │ p-5, one line + btn      ││
│ └─────────────────────┘ │        │ └───────────────────────────┘│
│                         │ gap-6  │                              │
│ ┌─ CTA banner ────────┐ │        └──────────────────────────────┘
│ │ p-7, two lines      │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

Ключевая идея: **объединить Hero + Stats в один визуальный блок**. Число и 3 stat карточки — это одна "зона состояния". Progress ring остаётся в hero, stat cards переходят в inline row внутри hero или сразу под ним с минимальным gap.

### EARN — 2-колоночный layout

```
БЫЛО (1 колонка):              СТАЛО (2 колонки на desktop):
┌─────────────────────┐        ┌───────────────┬──────────────┐
│ How much?           │        │ How much?     │ ESTIMATED    │
│ [$ 5,000       ]    │        │ [$ 5,000   ]  │ EARNINGS     │
│ $100 $500 ...       │        │ $100 $500 ... │              │
│ For how long?       │        │ For how long? │ $875.00      │
│ ═══●════════════    │        │ ═══●══════    │ ~17.5%/yr    │
│                     │        │               │              │
│ ┌─ Projection ────┐ │        │ ☑ Auto-start  │ Monthly $72  │
│ │ $875.00         │ │        │               │ Daily $2.40  │
│ │ ~17.5%/yr       │ │        │ [Invest →]    │ Payout May   │
│ │ Monthly $72.92  │ │        │               │              │
│ │ Daily $2.40     │ │        │ terms link    │ disclaimer   │
│ └─────────────────┘ │        └───────────────┴──────────────┘
│ ☑ Auto-start        │        
│ [Invest $5,000 →]   │        Соотношение: 60% / 40%
│                     │        Projection — sticky sidebar
└─────────────────────┘        На mobile: остаётся 1 колонка
```

### PORTFOLIO — компактнее позиции

```
БЫЛО:                              СТАЛО:
┌──────────────────────────┐       ┌──────────────────────────────┐
│ Position #1       Active │       │ #1 Active  12mo  Dec 18 2026 │
│ 12 months · ends Dec 18  │       │ $200.00 invested  $5.42 earn │
│                          │       │ ████████░░░░░ 21% · 10mo left│
│ Invested    Earned       │       │ Next: Mar 18 · ~$1.85  [▾]  │
│ $200.00     $5.42        │       └──────────────────────────────┘
│                          │
│ ████████░░░░░ 21%   10mo │       Каждая позиция: 4 строки вместо 7
│ Next: Mar 18 · ~$1.85   │       padding p-4 вместо p-5
│              Expand ▾    │
└──────────────────────────┘
```

### MY MINE — tighter grid

```
БЫЛО:                              СТАЛО:
┌────────────────────────┐         ┌──────────────────────────────┐
│ [illustration 300px]   │         │ [illustration 200px]         │
│                        │         │ Explorer ████ 41.5% Prospect.│
│ Explorer ███ Prospect. │         ├──────────────┬───────────────┤
│ Invest $585 more...    │         │ Today's prod │ Workers: 1    │
│                        │         │ 0.002g ≈$0.39│ Equip: Basic  │
│ ┌─ Today's prod ─────┐ │         │ 🔥 Day 15   │ Output: 0.002 │
│ │    ◈ 0.0020g       │ │         │ Week: $2.73  │ Effic: 80%   │
│ │    ≈ $0.39         │ │         ├──────────────┴───────────────┤
│ │ 🔥 Day 15          │ │         │ Upgrade: $585 to Prospector  │
│ │ Week: 0.014g $2.73 │ │         │ [Invest and upgrade →]       │
│ └─────────────────────┘ │         ├─────────────────────────────┤
│                         │         │ Achievements (2×4 grid)     │
│ ┌───┐ ┌───┐            │         └──────────────────────────────┘
│ │Wrk│ │Eqp│            │
│ └───┘ └───┘            │         Иллюстрация: 200px (было 300px)
│ ┌───┐ ┌───┐            │         Production + Stats: side by side
│ │Out│ │Eff│            │         
│ └───┘ └───┘            │
│                         │
│ Upgrade CTA             │
│                         │
│ Achievements (2-col)    │
│ Mine history            │
└─────────────────────────┘
```

---

## Конкретные CSS/Tailwind изменения

### Глобальные токены spacing (обновить tokens.css и tailwind.config)

| Что | Было | Стало | Зачем |
|-----|------|-------|-------|
| Section gap (Home) | gap-6 (24px) | gap-4 (16px) | Секции ближе |
| Section gap (другие) | gap-6 (24px) | gap-5 (20px) | Чуть плотнее |
| Card padding (stat) | p-5/p-6 (20-24px) | p-4 (16px) | Stat cards компактнее |
| Card padding (large) | p-6/p-7/p-8 (24-32px) | p-5 (20px) | Charts, tables |
| Hero card padding | p-8 (32px) | p-5 md:p-6 (20-24px) | Hero не доминирует |
| Hero number size | text-[56px] | text-[40px] md:text-[48px] | Пропорционально |
| Progress ring | 120px | 88px md:96px | Рядом с hero number |
| Page top padding | pt-8 (32px) | pt-5 (20px) | Быстрее к контенту |
| Content side padding | px-12 (48px) | px-8 md:px-10 (32-40px) | Шире контент |
| Greeting bottom margin | pb-2+mt-8 до hero | mb-3 (12px) | Greeting ближе к hero |
| Stat cards height | auto (90-100px) | auto (~72-80px) | За счёт p-4 и text scale |
| Chart height | 200px | 180px desktop, 140px mobile | Чуть компактнее |
| Table row padding | py-4 (16px) | py-2.5 (10px) | Больше строк видно |
| Table header | py-3 + mb | py-2 | Тоньше |
| CTA banner padding | p-7 (28px) | p-4 md:p-5 (16-20px) | Компактный banner |
| Position card padding | p-5 (20px) | p-4 (16px) | Позиции теснее |
| Position card gap | gap-4 (16px) | gap-3 (12px) | Между позициями |
| Activity item padding | py-4 (16px) | py-3 (12px) | Плотнее лента |
| Settings item height | py-5 (20px) | py-3.5 (14px) | Компактнее |
| My Mine illustration | h-[300px] | h-[200px] md:h-[240px] | Меньше доминирует |
| Achievement card | p-4 | p-3 | Tighter grid |

### Layout переключения (2-column)

| Страница | Что | Desktop layout |
|----------|-----|---------------|
| **Home** | Hero card | Hero number (left 60%) + ring (right 40%), inline flex |
| **Home** | Stats → Mine preview | Stats row + Mine preview в одну строку или stats row уже |
| **Earn** | Calculator + Projection | grid-cols-[1fr_380px], projection sticky top-24 |
| **Portfolio** | Overview cards | Уже 2-col, OK |
| **My Mine** | Production + Stats grid | grid-cols-2: production card left, stats grid right |
| **Activity** | Feed | max-w-[720px] mx-auto — ОК, но items tighter |
| **Settings** | List | max-w-[640px] — ОК, items tighter |

---

## Промты для Claude Code

### Промт FIX-1: Глобальные spacing tokens

```
Задача: уплотнить spacing по всему приложению. 
Не менять структуру компонентов — только отступы, размеры, gaps.

1. src/styles/tokens.css — если есть custom spacing properties, уменьши:
   --section-gap: 16px (было ~24px)
   --card-padding: 16px (было ~24px)
   --card-padding-lg: 20px (было ~32px)

2. src/components/layout/PageLayout.tsx:
   - Контент: pt-5 pb-6 (было pt-8 pb-8)
   - Desktop padding: px-8 (было px-12) → контент шире
   - Mobile: px-4 (без изменений)

3. Все Card components — уменьши дефолтный padding:
   - variant="stat": p-4 (было p-5 или p-6)
   - variant="position": p-4 (было p-5)  
   - variant="action": p-4 (было p-5/p-6)
   - variant="premium": p-5 (было p-7/p-8)

4. Все StatCard: 
   - Padding: p-4
   - Icon size: 20px (было 24px)
   - Label: text-xs (было text-sm)
   - Value: text-xl font-semibold (было text-2xl)
   - Gap between icon and label: mt-2 (было mt-3)
   - Gap between label and value: mt-0.5 (было mt-1)
```

### Промт FIX-2: Home page density

```
Уплотни Home страницу. Вот конкретные изменения:

1. GreetingSection: 
   - pt-5 mb-3 (было pt-8, mb отдельно)
   - text-lg (было heading-3 / text-xl)

2. HeroEarningsCard:
   - Padding: p-5 md:p-6 (было p-6 md:p-8)
   - "TOTAL EARNED" label: text-[11px] (было text-xs/text-sm)
   - Число: text-[40px] md:text-[48px] (было text-[56px])
   - Gold accent line: w-8 h-[1.5px] (было w-10 h-[2px])
   - "since you started" text: text-xs (было text-sm)
   - Daily badge: text-xs py-0.5 px-2 (было text-sm py-1 px-3)
   - Progress ring: size 88px md:96px (было 120px)
   - Ring center text: "60" = text-xl (было text-2xl), "days" = text-[10px]
   - Расстояние ring от текста: gap-4 (было gap-8 или auto spacing)
   - Trust badge "Backed by real mining": text-xs mt-2 (было mt-3)

3. QuickStatsRow:
   - gap-3 (было gap-4)
   - mt-3 (было mt-6 от hero)
   - Каждая stat card: p-3.5 (было p-5)
   - Icon: 18px (было 24px)
   - Label: text-[11px] (было text-xs)
   - Value: text-lg (было text-xl/text-2xl)

4. MinePreviewCard:
   - mt-3 (было mt-4/mt-6)
   - p-3 (было p-4/p-5)
   - Icon: 16px в circle 32px (было 20px в circle 40px)
   - Title: text-sm font-medium (было heading-4)
   - Subtitle: text-xs (было text-sm)
   - Progress bar: h-1 (было h-1.5)

5. EarningsChart:
   - mt-4 (было mt-6)
   - Card padding: p-4 (было p-6)
   - Header "Earnings over time": text-base font-semibold (было heading-3)
   - Period tabs: text-xs px-2.5 py-1 (было text-sm px-3 py-1.5)
   - Chart height: 180px desktop / 140px mobile (было 200/160)
   - Bottom toggle "Show in USD": text-xs mt-2

6. DailyBreakdown:
   - mt-4 (было mt-6)
   - Card padding: p-4 (было p-6)
   - Header: text-base font-semibold
   - Table header row: py-2 text-[11px] (было py-3 text-xs)
   - Table data rows: py-2 text-sm (было py-3/py-4 text-base)
   - Status text: text-xs
   - "View all →": text-xs mt-2

7. CtaBanner:
   - mt-4 (было mt-6)
   - Padding: p-4 md:p-5 (было p-6/p-7)
   - Title: text-lg font-semibold (было heading-2)
   - Description: text-sm (было body-lg)
   - Button: py-2.5 px-5 text-sm (было py-3.5 px-7)
   - Сделай desktop — inline: текст слева, кнопка справа, в одну строку

8. Общий gap между секциями в HomePage:
   flex flex-col gap-4 (было gap-6)

Результат: Home должен быть компактным, ~1.5 экрана на desktop 
(сейчас ~2.5 экрана). "Дышащий" но без пустоты.
```

### Промт FIX-3: Earn page — 2 колонки

```
Переделай Earn page в 2-колоночный layout на desktop:

1. EarnPage layout:
   Desktop (≥1024px):
   grid grid-cols-[1fr_360px] gap-6 items-start
   
   Левая колонка: калькулятор
   Правая колонка: ProjectionCard (sticky top-24)
   
   Mobile: single column, ProjectionCard после slider'а

2. EarningCalculator:
   - Убери ProjectionCard из калькулятора — он теперь в sidebar
   - p-5 (было p-8)
   - "How much?" heading: text-base font-semibold (было heading-3)
   - AmountInput: h-14 text-[32px] (было h-16 text-[40px])
   - Quick amount buttons: text-xs px-3 py-1.5 gap-2 (было text-sm px-4 py-2 gap-3)
   - "Minimum investment": text-[11px] mt-1.5
   - "For how long?" heading: text-base font-semibold mt-6 (было heading-4 mt-8)
   - Slider labels: text-xs
   - Checkbox "Auto-start": text-sm mt-5 (было mt-6)
   - CTA button: h-12 text-[15px] mt-5 (было h-14 text-base mt-6)
   - Terms text: text-[11px] mt-2

3. ProjectionCard (sidebar):
   - Sticky: sticky top-24
   - p-5 (было p-6)
   - "ESTIMATED EARNINGS" label: text-[11px]
   - Number: text-[32px] (было text-[40px])
   - "~17.5% annual return": text-sm
   - Breakdown rows: text-sm py-2 (было text-base py-3)
   - Disclaimer: text-[11px]

4. HowItWorks:
   - mt-8 (было mt-12)
   - "How it works" heading: text-lg font-semibold (было heading-2)
   - Step cards: p-4 (было p-6)
   - Step circle: 32px (было 40px), text-sm
   - Step title: text-sm font-semibold (было heading-3)
   - Step description: text-xs (было body-md)
   - Card height станет ~120px вместо ~180px

5. TrustBadges:
   - mt-4 (было mt-8)
   - p-4 (было p-8) — или даже inline row без карточки
   - Badge text: text-xs
   - Сделай одну строку flex gap-4, без bg карточки

6. "Investing more than $5,000?" — text-xs mt-3 (было body-sm mt-4)
```

### Промт FIX-4: Portfolio компактность

```
Уплотни Portfolio:

1. PortfolioOverview:
   - gap-3 (было gap-4)
   - Main value card: p-4 (было p-7)
   - "PORTFOLIO VALUE" label: text-[11px]
   - Value: text-2xl (было display-lg)
   - "{N} active positions": text-xs
   - "All time earned": text-xs
   - Right card: p-4 (было p-5)
   - Available/Gold values: text-lg (было number-lg)

2. PositionTabs:
   - mt-4 (было mt-6)
   - Tab text: text-sm

3. PositionCard:
   - p-4 (было p-5)
   - gap-3 между позициями (было gap-4)
   - Header: "Position #1" text-base font-semibold (было heading-4)
   - Badge: text-[11px] px-2 py-0.5
   - Subtitle "12 months · ends...": text-xs (было text-sm)
   - Invested/Earned: в одну строку flex gap-6
     Label text-[11px], Value text-base font-semibold
   - ProgressBar: h-[4px] (было h-[6px])
   - "21% complete" + "10 months remaining": text-xs, одна строка flex justify-between
   - "Next payout": text-xs (было text-sm)
   - Expand toggle: text-xs
   
   Результат: каждая позиция ~100px высоты вместо ~160px

4. AdvancedToggle:
   - mt-4 (было mt-8)
   - text-sm
```

### Промт FIX-5: Activity, Learn, Settings — minor density

```
1. Activity:
   - Page title: text-2xl (было heading-1)
   - Filter tabs: text-xs px-2.5 py-1
   - ActivityItem:
     py-3 (было py-4)
     Icon circle: 32px (было 36px)
     Title: text-sm (было body-md)
     Timestamp: text-[11px] (было body-sm)
     Amount: text-sm font-medium (было number-md)
     Subtitle (80 USDT → 309.97 AYNI): text-[11px]
   - Date group header: text-[11px] uppercase mt-3 mb-1 (было mt-4 mb-2)
   - "Load more" button: text-xs py-2

2. Learn:
   - Page title: text-2xl
   - Search input: h-10 text-sm (было h-12)
   - "Getting started" heading: text-lg mt-5
   - Tutorial cards: 
     Video placeholder: h-24 (было h-32)
     Title: text-sm
     Duration: text-[11px]
   - FAQ heading: text-lg mt-6
   - Accordion items: 
     p-4 (было p-5)
     mb-1.5 (было mb-2)
     Title: text-sm (было heading-4)
   - "How your investment works" heading: text-lg mt-6
   - Flow icons: 36px circles (было 44px?), gap-3 + arrow
   - "Need help?" heading: text-base mt-6
   - Contact buttons: text-sm py-2

3. Settings:
   - Profile card: p-5 (было p-6)
   - Avatar: 48px (было 64px) — всё равно виден
   - Name: text-lg (было heading-3)
   - Settings item: py-3 (было py-5)
   - Item label: text-sm (было body-md)
   - Item icon: 18px (было 20px)
   - "Coming soon" badge: text-[11px]
   - Danger zone: mt-6 (было mt-8)
   - "Sign out" / "Delete account": text-sm
```

### Промт FIX-6: My Mine density

```
1. MineHeader:
   - "My Mine": text-2xl (было heading-1)
   - "Level 1: Explorer": text-base (было heading-3)
   - Badges: text-[11px] px-2 py-0.5

2. MineIllustration:
   - h-[200px] md:h-[240px] (было h-[300px])
   - mt-3 (было mt-6)

3. MineLevelProgress:
   - mt-2 (было mt-4)
   - Bar height: h-2.5 (было h-3)
   - Labels: text-xs
   - "Invest $585 more": text-xs mt-1

4. Layout: Production + Stats side by side:
   Desktop: grid grid-cols-2 gap-3 mt-4
   Left: DailyProductionCard
   Right: MineStatsGrid (2×2)
   Mobile: stack, gap-3

5. DailyProductionCard:
   - p-4 (было p-6)
   - "Today's production": text-base font-semibold
   - Gold nugget icon: 24px (было 32px)
   - Gold amount: text-2xl (было display-lg)
   - USD: text-sm
   - Streak badge: text-[11px]
   - Weekly: text-xs

6. MineStatsGrid:
   - Каждая: p-3 (было p-4)
   - Icon: 16px (было 20px)
   - Label: text-[11px]
   - Value: text-base font-semibold (было heading-4)
   - Sublabel: text-[11px]

7. UpgradeCTA:
   - mt-3 (было mt-8)
   - p-4 (было p-6)
   - Title: text-base font-semibold
   - Description: text-sm
   - Button: text-sm h-10
   - Или сделай inline banner: одна строка текст + кнопка

8. AchievementsSection:
   - mt-5 (было mt-10)
   - "Achievements": text-lg
   - Grid: grid-cols-2 gap-2 (было gap-3)
   - Achievement card: p-3 (было p-4)
   - Icon circle: 32px (было 40px)
   - Title: text-sm
   - Description: text-xs
   - Date: text-[11px]

9. MineTimeline:
   - mt-4 (было mt-10)
   - Dot: 8px (было 12px)
   - Line: 1px (было 2px)
   - Title: text-sm
   - Date: text-[11px]
```

---

## Принцип проверки

После каждого промта проверяй метрику:

**Home page на 1440×900 viewport должен:**
- Показывать ВСЮ информацию до CTA banner без скролла (1 экран)
- Greeting + Hero + Stats + Mine preview + начало chart = видно сразу
- Не иметь пустых полос >16px между секциями

**Earn page:**
- Calculator + Projection рядом, без скролла видно всю форму + прогноз
- "How it works" + trust badges — под fold, но не далеко

**Portfolio:**
- Overview + все 3 позиции видны за 1 скролл

**Контрольные отступы (golden rules):**
- Между секциями: 16px (gap-4)
- Внутри карточек: 16px (p-4) для stat, 20px (p-5) для больших
- Между элементами внутри карточки: 8-12px
- Page top padding: 20px
- Шрифт labels: 11px
- Шрифт values: 18-20px (text-lg/text-xl)
- Шрифт hero number: 40-48px
- Шрифт headings: 16-18px (text-base/text-lg font-semibold)
```

## Порядок исполнения

1. **FIX-1** (глобальные токены) → npm run dev → проверь все страницы
2. **FIX-2** (Home) → проверь Home
3. **FIX-3** (Earn 2-col) → проверь Earn  
4. **FIX-4** (Portfolio) → проверь Portfolio
5. **FIX-5** (Activity + Learn + Settings) → проверь
6. **FIX-6** (My Mine) → проверь

Между каждым промтом: скриншот → сравни → если слишком тесно, откати конкретный элемент.
