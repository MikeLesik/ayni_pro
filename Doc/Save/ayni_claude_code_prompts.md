# AYNI Gold — Claude Code Промты для Density Fix
## По одному промту на экран + системный промт для токенов

> **Порядок выполнения:** сначала Промт 0 (системные токены), затем экраны в любом порядке.  
> **Каждый промт — copy-paste ready для Claude Code.**

---

## ПРОМТ 0: Системные токены и базовые компоненты

```
Задача: обновить design tokens и базовые компоненты для повышения информационной плотности 
всего приложения AYNI Gold. Это СИСТЕМНЫЙ фикс — все экраны наследуют эти изменения.

=== ФАЙЛ: src/styles/tokens.css ===

Найди и замени следующие CSS custom properties:

SPACING:
1. Добавь НОВЫЕ токены (их пока нет):
   --section-gap-related: 12px;    /* между связанными блоками внутри секции */
   --section-gap-separate: 20px;   /* между несвязанными секциями */
   --card-padding-lg: 20px;        /* hero cards, chart cards */
   --card-padding-md: 16px;        /* stat cards, position cards */
   --card-padding-sm: 12px;        /* achievement cards, compact elements */

2. Замени существующие:
   --content-padding-desktop: 48px  →  --content-padding-desktop: 32px
   --content-padding-mobile: 16px   →  оставить 16px (mobile ок)

   Если есть --nav-height-desktop: 64px — оставить.

TYPOGRAPHY — замени font size tokens:
   Было display-hero: 56px → стало: 48px
   Было heading-1: 32px/28px → стало: 28px/24px (mobile оставить 24px)
   Было heading-3: 20px → стало: 18px
   Было body-lg: 17px/16px → стало: 16px/15px
   Было body-md: 15px/14px → стало: 14px/13px
   Было body-sm: 13px/12px → стало: 12px/11px
   Было label-sm: 11px → стало: 11px (оставить), но font-weight 500 вместо 600
   Было number-lg: 24px → стало: 22px
   Было number-md: 20px → стало: 18px

=== ФАЙЛ: tailwind.config.ts ===

В секции extend.fontSize обнови ВСЕ значения в соответствии с tokens.css выше.

Добавь в extend.spacing:
   'section-related': 'var(--section-gap-related)',    // 12px
   'section-separate': 'var(--section-gap-separate)',  // 20px
   'card-lg': 'var(--card-padding-lg)',                // 20px
   'card-md': 'var(--card-padding-md)',                // 16px
   'card-sm': 'var(--card-padding-sm)',                // 12px

=== ФАЙЛ: src/components/ui/Card.tsx ===

Обнови padding mapping для Card component:
   padding="lg" → p-[var(--card-padding-lg)]  (или p-5, что = 20px)
   padding="md" → p-[var(--card-padding-md)]  (или p-4, что = 16px)
   padding="sm" → p-[var(--card-padding-sm)]  (или p-3, что = 12px)

Если padding props нет — добавь: padding?: "sm" | "md" | "lg" с default "md"

=== ФАЙЛ: src/components/ui/Button.tsx ===

Обнови размеры кнопок:
   size="lg": h-11 (44px) вместо h-12 (48px), px-7 вместо px-8
   size="md": h-9 (36px) вместо h-10 (40px), px-5 вместо px-6
   size="sm": h-8 (32px) вместо h-9, px-4 вместо px-4 (оставить)

=== ФАЙЛ: src/components/ui/StatCard.tsx ===

Замени padding:
   Было: p-6 (24px) или p-5 (20px) → стало: p-4 (16px)
   
Замени label styles:
   Было: text-label-sm font-semibold → стало: text-label-sm font-medium
   Если есть tracking-wider → заменить на tracking-wide (0.05em → 0.025em)

Замени value font size:
   Было: text-number-lg (24px) → стало: text-number-lg (теперь 22px через токен)

=== ФАЙЛ: src/components/ui/Badge.tsx ===

Замени padding:
   Было: px-3 py-1 (12px 4px) → стало: px-2.5 py-0.5 (10px 2px)
   Font size: text-xs (12px) → text-[11px]

Не трогай цвета — они правильные.

=== ПРОВЕРКА ===

После всех замен:
1. Убедись что tokens.css компилируется без ошибок
2. Убедись что tailwind.config.ts парсится без ошибок  
3. Запусти dev server и проверь что Home page рендерится
```

---

## ПРОМТ 1: HomePage (Dashboard)

```
Задача: применить density фиксы к HomePage (/home) — главному дашборду AYNI Gold.
Цель — сократить vertical space на ~200px, чтобы весь ключевой контент помещался 
выше fold на 1080p мониторе.

Предполагаю что системные токены (Промт 0) уже применены.

=== ФАЙЛ: src/app/HomePage.tsx ===

1. PAGE LAYOUT — найди обёртку страницы:
   Замени: py-8 (или pt-8) → py-5 (20px top padding)
   Замени: px-12 (или px-content-padding) → px-8 (32px, через новый токен)
   Замени: gap-6 (24px) между секциями → используй разные gaps:
     - greeting → hero card: gap = 12px (mb-3 на greeting)
     - hero card → stats row: gap = 12px (mb-3)
     - stats row → mine strip: gap = 16px (mb-4)
     - mine strip → chart: gap = 16px (mb-4)
     - chart → daily table: gap = 16px (mb-4)
     - daily table → CTA banner: gap = 20px (mb-5)
   
   Если сейчас единый flex-col gap-6 — убери gap-6 и добавь mb-* на каждый child.

2. GREETING SECTION — "Good morning, Alex":
   Замени: text-heading-3 → text-heading-4 (или text-base font-medium text-text-secondary)
   Замени: mb-4 или mb-6 → mb-3 (12px)

3. HERO EARNINGS CARD (HeroEarningsCard):
   Замени: p-8 (32px) или p-6 (24px) → p-5 (20px)
   
   Progress Ring внутри:
   Замени: w-[120px] h-[120px] → w-[88px] h-[88px]
   Замени: SVG viewBox и circle r для кольца: 
     - было: cx=60 cy=60 r=54 → стало: cx=44 cy=44 r=40
   Замени: число внутри ring: text-2xl (24px) → text-lg (18px)
   Замени: label "days": text-xs → text-[11px]

   "Backed by real mining" trust badge между hero и stats:
   Если это отдельный div с py-3 или my-3 — замени на py-1.5 my-1 (минимальный gap)
   Или лучше: перенеси его внутрь hero card как последнюю строку.

4. QUICK STATS ROW (3 StatCards):
   Замени: gap-4 (16px) между карточками → gap-3 (12px)
   Каждая StatCard теперь p-4 (из системного фикса).

   Icons в stat cards:
   Замени: w-5 h-5 (20px) → w-4 h-4 (16px) если иконки в stat cards

5. EARNINGS CHART (EarningsChart):
   Замени: padding карточки p-6 → p-5 (20px)
   Замени: высота Recharts AreaChart:
     height={260} или height={240} → height={200}
   Замени: mb или gap между header и chart: mb-4 → mb-3

   Period tabs (7D / 1M / 3M / ALL):
   Замени: gap-2 → gap-1.5
   Замени: px-3 py-1.5 → px-2.5 py-1

6. DAILY BREAKDOWN TABLE (DailyBreakdown):
   Замени: padding карточки p-6 → p-5 (20px)
   
   Table header row:
   Замени: py-3 (12px) → py-2.5 (10px)
   
   Table body rows:
   Замени: py-4 (16px) → py-3 (12px)
   
   Section header ("Daily earnings" + "Show mining details"):
   Замени: mb-4 → mb-3
   Если h-12 или py-3 на header zone → h-9 или py-2

   "View all →" link:
   Замени: mt-4 → mt-3

7. CTA BANNER (CtaBanner):
   Замени: p-7 (28px) или p-6 → p-4 py-4 (16px vertical, оставить горизонтальный)
   Замени: rounded-xl → rounded-lg (если стоит 2xl)

8. MY MINE STRIP (если есть между stats и chart):
   Замени: py-4 (16px) → py-3 (12px)
   Замени: h-[60px] или min-h — → h-[48px]
   Progress bar width: оставить
   Замени: gap-3 внутри → gap-2

=== ПРОВЕРКА ===

Визуально: страница должна быть плотнее на ~20%. Hero card, 3 stat cards, 
и начало графика должны быть видны без скролла на 1080p.
```

---

## ПРОМТ 2: EarnPage (Calculator)

```
Задача: применить density фиксы к EarnPage (/earn) — калькулятору инвестиций.
Главные проблемы: right panel (Estimated Earnings) не top-aligned с формой, 
"How it works" секция занимает ~300px на 3 карточки.

=== ФАЙЛ: src/app/EarnPage.tsx ===

1. PAGE HEADER:
   "Start Earning" title:
   Замени: text-heading-1 (32px) → text-heading-1 (теперь 28px через токен)
   Замени: gap или mb между title и subtitle: mb-2 → mb-1
   Замени: mb между header и calculator: mb-8 или mb-6 → mb-5

2. CALCULATOR LAYOUT (form + projection panel):
   Убедись что layout = flex-row на desktop с items-start (НЕ items-center).
   Если сейчас items-center → замени на items-start (top-alignment).
   
   Gap между form и projection panel:
   Замени: gap-6 (24px) или gap-8 → gap-5 (20px)

3. CALCULATOR FORM (левая часть):
   Внешний card padding:
   Замени: p-8 (32px) или p-6 → p-5 (20px)
   
   Amount input:
   Замени: text-[44px] или text-display-lg → text-[36px]
   
   Quick amount buttons ($100, $500, $1000, $5000, Custom):
   Замени: gap-3 → gap-2
   Замени: mt-3 → mt-2 (gap input → buttons)
   Замени: mb-1 → оставить (gap buttons → "Minimum" label)
   
   Gap amount section → "For how long?":
   Замени: mt-8 или mt-6 → mt-5
   
   Slider area ("For how long?"):
   Label "For how long?":
   Замени: mb-4 → mb-3
   
   Slider component:
   Замени: mt-2 → mt-1.5
   Snap point labels: оставить spacing
   
   Gap slider → checkbox:
   Замени: mt-6 или mt-5 → mt-4
   
   Gap checkbox → CTA button:
   Замени: mt-6 или mt-5 → mt-4
   
   CTA button "Invest $5,000.00 and start earning →":
   Замени: h-12 (48px) → h-11 (44px) через size="lg" (уже обновлён в Button.tsx)
   
   "By investing, you agree...":
   Замени: mt-3 → mt-2

4. PROJECTION PANEL (правая часть — EstimatedEarnings):
   Замени: p-6 (24px) → p-5 (20px)
   
   Header "ESTIMATED EARNINGS FOR 24 MONTHS":
   Замени: text-label-sm — оставить (11px ок)
   Замени: mb-3 → mb-2
   
   Hero number "$1750.00":
   Замени: text-display-lg → текущий размер уменьшится через токен
   
   "~17.5% annual return":
   Замени: mb-4 → mb-3 (gap hero → breakdown)
   
   Breakdown rows (Monthly, Daily, First payout, Paid in):
   Замени: py-3 → py-2.5
   Замени: border-b opacity-10 → оставить
   
   Disclaimer text:
   Замени: mt-4 → mt-3
   Замени: text-body-sm → text-[11px]

5. "HOW IT WORKS" SECTION:
   *** КЛЮЧЕВОЙ ФИКС — заменить 3 высокие карточки на компактный inline flow ***
   
   Вариант A (предпочтительный) — горизонтальный stepper:
   Замени всю секцию HowItWorks с тремя Card компонентами на:
   
   <div className="flex items-center justify-center gap-4 py-6 mt-8">
     <div className="flex flex-col items-center gap-1.5">
       <div className="w-8 h-8 rounded-full bg-[var(--color-gold-light)] 
                       flex items-center justify-center text-sm font-semibold 
                       text-[var(--color-gold-dark)]">1</div>
       <span className="text-sm font-medium">Invest</span>
       <span className="text-[11px] text-[var(--color-text-muted)] text-center max-w-[120px]">
         Choose amount and term
       </span>
     </div>
     <div className="w-8 h-px bg-[var(--color-border)]" />
     <!-- repeat for step 2 "We mine" and step 3 "You earn" -->
   </div>

   Это экономит ~200px высоты.

   Вариант B (если нужно сохранить карточки):
   Замени высоту каждой карточки: min-h-[180px] → убрать min-h
   Замени padding карточек: p-6 → p-4
   Замени иконки: w-10 h-10 → w-8 h-8
   Замени gap между карточками: gap-4 → gap-3
   Замени mt секции: mt-12 или mt-8 → mt-6

6. TRUST BADGES:
   Замени: gap-8 (32px) между badges → gap-5 (20px)
   Замени: text-xs → text-[11px]
   Замени: mt-8 → mt-4
   Замени: py-4 → py-3

7. "Investing more than $5,000?" LINK:
   Замени: mt-4 → mt-3

=== ПРОВЕРКА ===

Визуально: калькулятор + projection panel должны быть видны целиком без скролла.
"How it works" должен быть компактным, не занимать полэкрана.
Right panel (estimated earnings) должен начинаться на одной высоте с формой.
```

---

## ПРОМТ 3: PortfolioPage

```
Задача: применить density фиксы к PortfolioPage (/portfolio).
Главная проблема — position cards слишком высокие (~180px каждая), 
с 3 позициями страница уходит за fold.

=== ФАЙЛ: src/app/PortfolioPage.tsx ===

1. PAGE HEADER:
   "Your Portfolio":
   Замени: text-heading-1 (уже 28px через токен) — ок
   Замени: mb-6 или mb-8 → mb-5

2. PORTFOLIO OVERVIEW (2 summary cards):
   Контейнер:
   Замени: gap-6 → gap-4 между двумя summary cards
   
   Left card (Portfolio Value):
   Замени: p-6 → p-5
   "$414.68" — размер через токен (уже обновлён)
   "3 active positions" + "All time earned: $15.83":
   Замени: leading-6 → leading-5 (line-height)
   Замени: mt-1.5 → mt-1

   Right card (Available + Gold Rewards):
   Замени: p-6 → p-5
   Gap между AVAILABLE и GOLD REWARDS:
   Замени: mt-4 → mt-3
   Кнопки Invest, Withdraw, Reinvest:
   Замени: gap-3 → gap-2

3. TABS (Active 3 / Completed 1):
   Замени: mt-6 → mt-5
   Замени: mb-6 или mb-4 → mb-4 (gap tabs → first card)

4. POSITION CARDS (PositionCard) — КЛЮЧЕВОЙ ФИКС:

=== ФАЙЛ: src/components/portfolio/PositionCard.tsx (или где он определён) ===

   Внешний padding:
   Замени: p-6 (24px) → px-5 py-4 (20px horizontal, 16px vertical)
   
   Title row ("Position #1" + "12 months · ends Dec 18, 2026" + Active badge):
   Замени: mb-4 → mb-2 (gap title → invested/earned)
   Subtitle (date range): text-body-sm уже 12px — ок
   
   Invested / Earned row:
   Замени: gap-6 → gap-4 между Invested и Earned
   Замени: mb-4 → mb-2 (gap → progress bar)
   
   Progress bar:
   Замени: h-1.5 (6px) → h-1 (4px)
   Замени: mb-2 → mb-1.5
   
   Progress label row ("21% complete" + "10 months remaining"):
   Замени: mb-3 → mb-1.5 (gap → next payout text)
   
   Next payout text:
   Замени: mb-4 → mb-2 (gap → expand button)
   
   "Expand ⌄" button area:
   Замени: py-2 → py-1.5
   Замени: mt-2 → mt-1

   ИТОГО экономия на карточку: ~60px
   
5. GAP BETWEEN POSITION CARDS:
   Замени: gap-4 (16px) или gap-5 → gap-3 (12px) между карточками в списке

6. "SHOW ADVANCED DETAILS" TOGGLE:
   Замени: mt-6 → mt-4

=== ПРОВЕРКА ===

Все 3 position cards + overview header должны быть видны на одном экране 1080p.
Карточки должны быть компактными, но readable — не жертвуй readability.
```

---

## ПРОМТ 4: ActivityPage

```
Задача: применить density фиксы к ActivityPage (/activity).
Главная проблема — row height activity items (~72-80px) слишком большая для feed.

=== ФАЙЛ: src/app/ActivityPage.tsx ===

1. PAGE HEADER:
   "Activity":
   Замени: text-heading-1 → уже 28px через токен
   Замени: mb-4 → mb-3

2. FILTER TABS (All / Earnings / Payments / Payouts / System):
   Замени: tab padding px-4 py-2 → px-3 py-1.5
   Замени: text-sm (14px) → text-[13px]
   Замени: gap-2 → gap-1.5
   Замени: mb-6 → mb-4 (gap tabs → first group)

3. GROUP HEADERS ("YESTERDAY", "THIS WEEK"):
   Замени: mt-6 mb-3 → mt-5 mb-2
   Первая группа: mt-0 mb-2 (нет лишнего top margin)
   Замени: text-label-sm — оставить (11px uppercase)

4. ACTIVITY ITEMS — КЛЮЧЕВОЙ ФИКС:

=== ФАЙЛ: src/components/activity/ActivityItem.tsx (или где он определён) ===

   Row container:
   Замени: py-4 (16px vertical) → py-3 (12px vertical)
   Замени: px-4 → px-3 или px-0 (если items внутри card)
   
   Icon:
   Замени: w-10 h-10 (40px) → w-8 h-8 (32px)
   Замени: icon internal size: w-5 h-5 → w-4 h-4
   
   Gap icon → text:
   Замени: ml-4 (16px) → ml-3 (12px)
   
   Title text:
   Замени: text-body-md (15px) → text-body-md (теперь 14px через токен)
   
   Detail/date text:
   Замени: text-body-sm (13px) → text-body-sm (теперь 12px через токен)
   Замени: mt-1 → mt-0.5
   
   Conversion detail ("80 USDT → 309.97 AYNI"):
   Если отдельная строка — замени mt-1 → mt-0.5
   
   Amount column ("+$0.39" справа):
   Замени: text-body-md → text-[15px] или text-body-md (14px через токен — ок)
   
   Divider between items:
   Замени: border-opacity-10 → border-opacity-[0.06] (тоньше визуально)

   Для SYSTEM items без суммы (notifications):
   Добавь: если item.type === "system" — py-2.5 вместо py-3 (компактнее)

5. "LOAD MORE" BUTTON:
   Замени: mt-6 → mt-4
   Замени: py-2.5 → py-2

=== ПРОВЕРКА ===

~10 activity items должны помещаться на экране без скролла.
Items должны быть визуально разделены, но компактнее текущего.
System notifications визуально легче (меньше высота).
```

---

## ПРОМТ 5: MyMinePage (Gamification)

```
Задача: применить density фиксы к My Mine page — самому длинному экрану.
Цель — сократить scroll depth на ~25% без потери gamification feel.

=== ФАЙЛ: src/app/MyMinePage.tsx (или аналог) ===

1. PAGE HEADER:
   Title zone ("My Mine" + "Level 1: Explorer" + streak badge):
   Замени: flex-col gap-2 → flex-row items-baseline gap-3 flex-wrap
   Streak badge ("2 day streak"): оставить справа, но:
   Замени: absolute right-0 top-0 → ml-auto (flex-row right alignment)
   Замени: mb-6 → mb-4 (gap header → illustration)

2. ISOMETRIC ILLUSTRATION:
   Замени: h-[240px] или h-60 → h-[180px] или max-h-[180px]
   Замени: object-cover или object-contain → object-cover с overflow-hidden
   Замени: mb-4 → mb-2 (gap illustration → progress bar)

3. LEVEL PROGRESS BAR:
   Замени: py-3 → py-2
   "Explorer ███░░ Prospector":
   Замени: mb-2 → mb-1 (gap bar → "Invest $585 more" text)

4. STATS GRID (Today's production + 4 small cards):
   Замени: mt-6 → mt-4
   Замени: gap-4 → gap-3 между grid items
   
   Large card (Today's production):
   Замени: p-6 → p-4
   Gold icon: замени w-10 h-10 → w-8 h-8
   "0.0020g" number: text оставить
   "≈ $0.39": оставить
   Streak badge + week total: mt-2 → mt-1.5
   
   Small cards (Workers, Equipment, Output, Efficiency):
   Замени: p-5 → p-3.5 (14px)
   Icon: w-5 h-5 → w-4 h-4
   Label: text-body-sm → text-[11px]
   Value: font-size оставить (через токен уже уменьшен)

5. UPGRADE CTA ("Upgrade your mine"):
   Замени: mt-6 → mt-4
   Замени: p-6 → p-4
   CTA button: h-11 (44px через системный фикс)
   Замени: mt-4 → mt-3 (gap text → button)

6. ACHIEVEMENTS GRID:
   Замени: mt-8 → mt-5
   Section heading "Achievements": mb-4 → mb-3
   
   Achievement cards (2 columns):
   Замени: gap-3 → gap-2
   Замени каждый card: p-4 → p-3
   
   Icon в achievement: w-8 h-8 → w-7 h-7 (28px)
   Gap icon → text: ml-3 → ml-2.5
   
   Title font: text-body-md → оставить (14px через токен)
   Description: text-body-sm → оставить (12px через токен)
   Date: text-[11px] — оставить
   
   Locked achievements:
   Замени: opacity-40 → opacity-30

7. MINE HISTORY (Timeline):
   Замени: mt-8 → mt-5
   Section heading: mb-4 → mb-3
   
   Timeline items:
   Замени: py-3 (или gap-5) → py-2 (или gap-3.5)
   Замени: pl-6 → pl-5 (если есть timeline line offset)
   Dot size: w-3 h-3 → w-2.5 h-2.5
   Date text: text-[11px] — оставить

=== ПРОВЕРКА ===

Illustration + stats grid + upgrade CTA должны быть видны без скролла.
Achievements и mine history — scrollable но компактнее.
Gamification feel сохраняется — уменьшаем spacing, не content.
```

---

## ПРОМТ 6: LearnPage

```
Задача: применить density фиксы к LearnPage (/learn).
Главные проблемы: Getting Started карточки с большим пустым area, 
FAQ items разрежены, "How it works" diagram занимает ~100px.

=== ФАЙЛ: src/app/LearnPage.tsx ===

1. PAGE HEADER:
   "Learn" + subtitle:
   Замени: text-heading-1 → уже 28px
   Замени: mb-2 → mb-1 (gap title → subtitle)
   Замени: mb-6 → mb-4 (gap subtitle → search)

2. SEARCH BAR:
   Замени: py-4 px-5 → py-3 px-4
   Замени: h-[52px] → h-11 (44px)
   Замени: text-body-md → text-sm (14px)
   Замени: mb-8 → mb-5 (gap search → "Getting started")

3. "GETTING STARTED" SECTION:
   Heading: mb-4 → mb-3
   
   Article cards (3 штуки):
   Замени: min-h-[160px] → убрать min-h (auto height)
   Video icon placeholder area:
   Замени: h-[96px] или pt-[60%] → h-16 (64px) или aspect-video с max-h-16
   Замени: p-5 → p-4
   
   Card title: text-body-md → оставить (14px)
   Duration label "2 min": text-body-sm → text-[11px]
   
   Gap между cards: gap-4 → gap-3

4. FAQ SECTION:
   Замени: mt-8 → mt-5 (gap "Getting started" → "FAQ")
   Heading: mb-4 → mb-3
   
   FAQ accordion items:

=== ФАЙЛ: src/components/learn/FaqSection.tsx (или Accordion usage) ===

   Каждый item:
   Замени: py-4 px-5 → py-3 px-4
   Минимальная высота closed state: ~52px → ~44px
   
   Gap между items:
   Замени: gap-2 (8px) → gap-1 (4px)
   Или если border-bottom разделитель → gap-0 с border-b
   
   Chevron icon:
   Замени: w-5 h-5 → w-4 h-4

5. "HOW YOUR INVESTMENT WORKS" FLOW:
   Замени: mt-8 → mt-5
   
   5 icons в горизонтальной линии (Invest → Mining → Gold → PAXG → Wallet):
   Замени: icon size w-11 h-11 (44px) → w-9 h-9 (36px)
   Замени: gap-6 → gap-4 между steps
   Arrow icons: w-5 → w-4
   Labels: text-body-sm → text-[12px]
   Total height ~100px → ~80px

6. "NEED HELP?" SECTION:
   Замени: mt-8 → mt-5
   Links (Email, Live chat, Full docs):
   Замени: gap-6 → gap-4

=== ПРОВЕРКА ===

Search + Getting Started cards + начало FAQ должны быть видны на одном экране.
FAQ не "рыхлый" — items плотно друг к другу.
```

---

## ПРОМТ 7: Глобальные компоненты (NavBar + Layout)

```
Задача: финальные density фиксы для глобальных компонентов — NavBar и PageLayout.

=== ФАЙЛ: src/components/nav/NavBar.tsx ===

Nav items spacing:
Замени: gap-8 (32px) → gap-6 (24px) между nav items
Замени: text-sm (14px) → text-[13px] для nav item labels

CTA button ("Start Earning"):
Замени: h-10 → h-9 (36px)
Замени: px-5 → px-4
Замени: text-sm → text-[13px]

Navbar height: оставить 64px (--nav-height-desktop)

=== ФАЙЛ: src/app/RootLayout.tsx (или PageLayout wrapper) ===

Content area:
Замени: px-12 → px-8 (через обновлённый --content-padding-desktop: 32px)
Замени: py-8 → py-5
Замени: max-w-content → оставить (1200px)

=== ФАЙЛ: src/components/nav/MobileTabBar.tsx ===

Замени: h-16 (64px) → h-[60px]
Замени: text-[11px] → text-[10px] для labels
Замени: gap-1 → gap-0.5 между icon и label
Icon: w-6 h-6 → w-5 h-5 (20px)

=== ПРОВЕРКА ===

Навбар визуально такой же, но nav items чуть плотнее.
Content area начинается выше и использует больше ширины экрана.
На mobile tab bar чуть компактнее.
```

---

## ПРОМТ 8: Dark Mode Polish (bonus)

```
Задача: дополнительные фиксы для dark mode после density changes.
Не обязательный, но рекомендуемый.

=== ФАЙЛ: src/styles/tokens.css ===

В секции [data-theme="dark"]:

1. Card surface contrast:
   Замени: --color-surface-card: #242428 → --color-surface-card: #282830
   (lightness +2% для лучшего различения card от background)

2. Gold progress bar:
   Замени: --color-gold: #D4B55A → --color-gold: #D9BC62
   (чуть ярче для visibility на тёмном фоне при уменьшенных элементах)

3. Border opacity для table dividers:
   Добавь: --color-border-subtle: rgba(255, 255, 255, 0.06);
   
   Используй в table rows и activity feed dividers вместо --color-border-light.

4. Success text (для credited/positive amounts):
   Замени: --color-success: #3DA564 → --color-success: #45B56E
   (lightness +5% для WCAG AA на тёмном фоне при уменьшенном font-size)

=== ФАЙЛ: компоненты с border-radius ===

Стандартизируй border-radius:
   Все Card компоненты: rounded-xl (16px) → rounded-lg (12px)
   CTA buttons: если rounded-full (pill) → rounded-lg (8px) для premium feel
   Badges: оставить rounded-full
   Inputs: оставить rounded-md (10px)

=== ПРОВЕРКА ===

В dark mode карточки должны чётко выделяться от фона.
Золотой цвет должен быть достаточно ярким на progress bars.
Green text (earned amounts, credited status) должен быть readable при 12px.
```

---

# Порядок применения

| # | Промт | Файлы | Зависимости | Примерное время |
|---|-------|-------|-------------|-----------------|
| 0 | Системные токены | tokens.css, tailwind.config.ts, Card, Button, StatCard, Badge | Нет | 15 мин |
| 1 | HomePage | HomePage.tsx, HeroEarningsCard, ProgressRing | Промт 0 | 20 мин |
| 2 | EarnPage | EarnPage.tsx, EarningCalculator, HowItWorks | Промт 0 | 20 мин |
| 3 | PortfolioPage | PortfolioPage.tsx, PositionCard | Промт 0 | 15 мин |
| 4 | ActivityPage | ActivityPage.tsx, ActivityItem | Промт 0 | 15 мин |
| 5 | MyMinePage | MyMinePage.tsx, achievements, stats grid | Промт 0 | 20 мин |
| 6 | LearnPage | LearnPage.tsx, FaqSection | Промт 0 | 15 мин |
| 7 | Global (Nav + Layout) | NavBar, RootLayout, MobileTabBar | Промт 0 | 10 мин |
| 8 | Dark Mode Polish | tokens.css, Card border-radius | Промт 0-7 | 10 мин |

**Итого: ~2.5 часа для всех фиксов.**

---

# Важные заметки для Claude Code

- Все файлы в проекте используют TypeScript + Tailwind CSS 3 классы + CSS custom properties из tokens.css
- cn() utility из src/lib/cn.ts (clsx + tailwind-merge) — используй для conditional classes
- НЕ трогай информационную архитектуру, контент, или бизнес-логику
- НЕ трогай цвета (кроме Промта 8 dark mode)
- НЕ трогай анимации и transitions
- Все изменения — только spacing, font-sizes, padding, gap, heights
- Если компонент имеет responsive variants (mobile/desktop) — фиксить оба, но mobile менее агрессивно
- При сомнениях — предпочитай меньший padding. Лучше потом добавить, чем убирать.
