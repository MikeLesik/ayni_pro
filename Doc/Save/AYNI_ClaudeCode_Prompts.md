# AYNI Gold — Пошаговое руководство для Claude Code

## Подготовка (сделай ДО запуска Claude Code)

### Шаг 0.1 — Создай папку проекта

```bash
mkdir ayni-gold
cd ayni-gold
git init
```

### Шаг 0.2 — Скачай и положи бриф в корень

Скачай файл `AYNI_Technical_Implementation_Brief.md` из чата и положи в `ayni-gold/`.

### Шаг 0.3 — Создай файл CLAUDE.md

Создай файл `CLAUDE.md` в корне `ayni-gold/` с этим содержимым:

```markdown
# AYNI Gold — Frontend Platform

## Что это
Фронтенд личного кабинета AYNI Gold (ayni.gold) — инвестиционная платформа, 
где пользователь вкладывает в токены, привязанные к золотодобыче, стейкает их 
и получает доход в PAXG (gold-backed token).

## Главный документ
Полная техническая спецификация: `AYNI_Technical_Implementation_Brief.md`
Всегда сверяйся с этим файлом для: цветов, типографики, интерфейсов компонентов, 
API-контрактов, стилей, breakpoints.

## Стек
- React 18 + Vite 5 + TypeScript 5.5 (strict)
- Tailwind CSS 3.4 + CSS Custom Properties для design tokens
- Zustand 4 (client state) + TanStack Query 5 (server state)
- Framer Motion 11 (анимации)
- Recharts 2 (графики)
- Radix UI (headless UI primitives)
- Lucide React (иконки)
- React Hook Form + Zod (формы + валидация)
- React Router 6 (routing)
- ky (HTTP client)
- date-fns (даты)

## Правила кода
- TypeScript strict mode, запрещён `any`
- Только functional components с hooks
- Tailwind + CSS variables для стилей (НЕ css-in-js, НЕ styled-components)
- Все цвета через CSS custom properties из tokens.css
- Dark mode через `[data-theme="dark"]` selector на <html>
- Шрифты self-hosted через @font-face (НЕ Google Fonts CDN)
- Все интерактивные элементы: min 44px touch target, focus-visible outline
- API: snake_case от сервера → camelCase во фронтенде
- На данном этапе — mock API, реального бэкенда нет
- Path aliases: @/ → src/

## Структура папок
src/
├── app/         — App.tsx, routes.tsx, providers.tsx
├── components/
│   ├── ui/      — атомарные: Button, Card, Input, Badge, Modal...
│   ├── layout/  — NavBar, BottomTabBar, PageLayout, AuthLayout
│   ├── home/    — компоненты Home-экрана
│   ├── earn/    — компоненты Earn-экрана
│   ├── portfolio/
│   ├── activity/
│   ├── learn/
│   ├── onboarding/
│   ├── settings/
│   └── shared/  — переиспользуемые бизнес-компоненты
├── hooks/       — кастомные хуки
├── stores/      — Zustand stores
├── services/    — API клиент + mock data
├── types/       — TypeScript типы и интерфейсы
├── lib/         — утилиты (cn, formatters, validators, constants)
├── styles/      — tokens.css, fonts.css, global.css
└── assets/      — шрифты, изображения, кастомные иконки

## Design tokens
Все значения цветов, теней, радиусов — в AYNI_Technical_Implementation_Brief.md, Секция 2.
Ключевые цвета:
- Primary: #1B3A4B (petrol blue)
- Gold: #C9A84C (muted gold)
- Background: #FAFAF7 (warm off-white)
- Text: #1A1A1A
- Success: #2D8A4E
- Error: #C53030

## Типографика
- Display/H1: DM Serif Display (serif) — ТОЛЬКО hero-числа и H1
- UI/Body: Inter (sans-serif) — всё остальное
- Mono: JetBrains Mono — wallet addresses, tx hashes
```

### Шаг 0.4 — Запусти Claude Code

```bash
claude
```

---

## ФАЗА 1: Foundation (Design System + UI Kit)

### Промт 1.1 — Инициализация проекта

Скопируй и вставь в Claude Code:

```
Прочитай файл AYNI_Technical_Implementation_Brief.md — Секцию 1 (Tech Stack) и Секцию 2 (Design Tokens).

Создай проект:

1. Инициализируй Vite + React + TypeScript:
   npm create vite@latest . -- --template react-ts
   
2. Установи ВСЕ зависимости:
   npm install react-router-dom@6 @tanstack/react-query@5 zustand@4 framer-motion@11 recharts@2 lucide-react ky@1 date-fns@3 clsx tailwind-merge react-hook-form@7 zod@3 @hookform/resolvers @radix-ui/react-tooltip @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-checkbox @radix-ui/react-switch @radix-ui/react-select
   
   npm install -D tailwindcss@3 postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom

3. Настрой Tailwind:
   npx tailwindcss init -p
   Замени tailwind.config.ts на ПОЛНЫЙ конфиг из Секции 2.2 документа.

4. Настрой tsconfig.json — добавь path aliases:
   "@/*": ["src/*"]
   Добавь в vite.config.ts resolve alias: '@' → './src'

5. Создай файл src/styles/tokens.css — скопируй ПОЛНОСТЬЮ из Секции 2.1 документа. 
   Включи ВСЕ: light mode переменные, dark mode через [data-theme="dark"], 
   типографические классы, skeleton shimmer keyframes, reduced motion media query, 
   bg-noise и bg-dots.

6. Создай src/styles/fonts.css с @font-face для:
   - DM Serif Display Regular (woff2)
   - Inter Regular, Medium, SemiBold (woff2)  
   - JetBrains Mono Regular (woff2)
   Пока используй Google Fonts CDN как fallback (@import), 
   потом заменим на self-hosted.

7. Создай src/styles/global.css:
   @import './tokens.css';
   @import './fonts.css';
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

8. Создай всю структуру папок из Секции 3 документа (пустые файлы пока не нужны, 
   только папки).

9. Создай утилиту src/lib/cn.ts:
   import { clsx, type ClassValue } from 'clsx';
   import { twMerge } from 'tailwind-merge';
   export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

10. Создай src/lib/formatters.ts с функциями:
    formatCurrency(value, currency='USD'), formatPercent(value), 
    formatDate(isoString), formatGrams(value)

11. Создай src/types/theme.ts из Секции 2.3 документа.

Убедись что npm run dev запускается без ошибок.
```

### Промт 1.2 — UI-компоненты (часть 1: Button, Card, Badge, Input)

```
Прочитай AYNI_Technical_Implementation_Brief.md — Секцию 4 (Component Interfaces) 
и секцию 2.1 (tokens.css) для точных стилей.

Также прочитай в документе описание стилей кнопок (строки с "Primary", "Secondary", 
"Ghost", "Danger", "Gold CTA" из Секции 2, раздел компонентный стиль).

Реализуй следующие компоненты:

1. src/components/ui/Button.tsx
   - TypeScript interface ButtonProps из Секции 4
   - 5 вариантов с ТОЧНЫМИ стилями:
     primary: bg primary (#1B3A4B), text white, rounded-[12px], py-[14px] px-[28px], 
       shadow "0 1px 3px rgba(27,58,75,0.15)", 
       hover: bg #152F3D, shadow "0 2px 8px rgba(27,58,75,0.25)", translateY(-1px)
     secondary: bg transparent, text primary, border 1.5px solid var(--color-border), rounded-[12px],
       hover: bg primary-light, border-color primary
     ghost: bg transparent, text text-secondary, rounded-[8px], py-[10px] px-[16px],
       hover: bg bg-secondary, text text-primary
     danger: bg transparent, text error, border 1.5px solid error/30, rounded-[12px],
       hover: bg error-light
     gold-cta: bg primary, text white, rounded-[12px], shadow "0 2px 8px rgba(27,58,75,0.2)",
       ПЛЮС 2px gradient border снизу (gold gradient), 
       hover: shadow "0 4px 16px rgba(201,168,76,0.3)"
   - 3 размера: sm (py-2 px-4 text-sm), md (py-3.5 px-7 text-[15px]), lg (py-3.5 px-7 text-base)
   - States: disabled (opacity-40 cursor-not-allowed), 
     active (scale-[0.98]), 
     focus-visible (outline 2px solid primary, offset 2px)
   - Loading: Loader2 icon from lucide-react, animate-spin, replace children
   - Transition: all 0.2s ease
   - Используй cn() для merge классов

2. src/components/ui/Card.tsx
   - 5 вариантов: stat, position, action, premium, glass
   - stat: bg var(--color-surface-card), border 1px border-light, rounded-[16px], 
     shadow "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)", p-6,
     hover: shadow усиливается
   - position: bg surface-card, border 1px border, rounded-[16px], shadow-sm, p-5,
     hover: border-color primary/30
   - action: bg surface-card + gold gradient overlay (linear-gradient 135deg, rgba(201,168,76,0.03), transparent),
     border border-light, rounded-[16px]
   - premium: bg primary, text white, rounded-[20px], shadow-lg, p-7
   - glass: bg white/5, border white/8, rounded-[16px], backdrop-blur-[20px] (dark mode only)
   - Props: variant, children, className, hoverable, onClick, padding

3. src/components/ui/Badge.tsx
   - 5 статусов: active, pending, completed, claimed, locked
   - active: bg success-light, text success
   - pending: bg warning-light, text warning
   - completed: bg primary-light, text primary
   - claimed: bg gold-light, text gold-dark
   - locked: bg bg-secondary, text text-muted
   - Общее: rounded-full, px-3, py-1, text-xs font-medium
   - Props: status, label (optional — если не передан, показывай название статуса)

4. src/components/ui/Input.tsx
   - Props из Секции 4: label, placeholder, value, onChange, type, error, helperText, disabled, icon
   - Default: bg surface-card, border 1.5px border, rounded-[10px], px-4 py-3.5, text-[15px]
   - Focus: border primary, box-shadow "0 0 0 3px rgba(27,58,75,0.1)"
   - Error: border error, + error text below (text-error text-xs)
   - Disabled: bg bg-secondary, border border-light, text text-muted
   - Label: mb-1.5, text-[13px] font-medium text-text-secondary
   - Helper text: mt-1, text-xs text-text-muted
   - Правильные aria атрибуты: aria-describedby для error/helper

Каждый компонент должен:
- Экспортироваться как named export
- Поддерживать className prop для кастомизации
- Использовать cn() из lib/cn
- Работать в light и dark mode (через CSS variables)
```

### Промт 1.3 — UI-компоненты (часть 2: Tooltip, Modal, Tabs, Toggle, Checkbox, Select)

```
Продолжай реализацию UI-компонентов. Сверяйся с AYNI_Technical_Implementation_Brief.md, 
Секция 4 для интерфейсов и Секция 2 для стилей.

1. src/components/ui/Tooltip.tsx
   - Используй @radix-ui/react-tooltip
   - Стиль: bg text-primary (#1A1A1A), text white, text-xs, rounded-lg, 
     px-3 py-2, shadow "0 4px 12px rgba(0,0,0,0.15)", max-w-[280px]
   - Animation: fade-in 0.15s + translateY(4px → 0)
   - Props: content, children, side ('top'|'bottom'|'left'|'right'), delayMs

2. src/components/ui/Modal.tsx
   - Используй @radix-ui/react-dialog
   - Desktop (>=768px): 
     Overlay: bg black/40, backdrop-blur-[4px]
     Content: bg surface-card, rounded-[20px], shadow-lg, p-8, max-w-[480px], mx-auto
     Animation: fade + scale(0.95→1) 0.2s ease
   - Mobile (<768px): 
     Bottom sheet: bg surface-card, rounded-t-[20px], shadow, full-width
     Drag handle: 36px × 4px, bg border, rounded-sm, mx-auto mt-3
     Animation: slide-up from bottom 0.3s ease
   - Close button (X) в правом верхнем углу
   - Escape to close
   - Focus trap (Radix делает автоматически)
   - Props: open, onClose, title, children, maxWidth, showCloseButton

3. src/components/ui/Tabs.tsx
   - Используй @radix-ui/react-tabs
   - 2 варианта: pill и underline
   - pill: 
     Active: bg primary, text white, rounded-full, px-3 py-1
     Inactive: bg transparent, text text-secondary, hover: bg bg-secondary
   - underline:
     Active: text text-primary, border-b-2 border-gold, font-semibold
     Inactive: text text-secondary, border-b-2 border-transparent
   - Props: items (id, label, count?), activeId, onChange, variant, size

4. src/components/ui/Toggle.tsx (Switch)
   - Используй @radix-ui/react-switch
   - Track: 44px × 24px, bg border (off) / bg primary (on), rounded-full, transition
   - Thumb: 20px circle, bg white, shadow-xs, translate-x animation
   - Props: checked, onChange, label, disabled, aria-label

5. src/components/ui/Checkbox.tsx
   - Используй @radix-ui/react-checkbox
   - Box: 20px × 20px, border 1.5px border, rounded-md
   - Checked: bg primary, border primary, white checkmark icon (Check from lucide, 14px)
   - Label рядом: text body-md, text-text-primary
   - Description под label: text body-sm, text-text-secondary
   - Props: checked, onChange, label, description, disabled

6. src/components/ui/Select.tsx
   - Используй @radix-ui/react-select
   - Trigger: стиль как Input + ChevronDown icon справа
   - Content: bg surface-card, rounded-lg, shadow-md, border border-light, p-1
   - Item: px-3 py-2, rounded-md, hover: bg bg-secondary
   - Selected item: bg primary-light, text primary
   - Props: options, value, onChange, label, placeholder

Проверь что все компоненты рендерятся: создай временную страницу /dev 
с примерами всех компонентов.
```

### Промт 1.4 — UI-компоненты (часть 3: SkeletonLoader, Avatar, NotificationBell, Icon, EmptyState)

```
Продолжай. Сверяйся с AYNI_Technical_Implementation_Brief.md Секция 4.

1. src/components/ui/SkeletonLoader.tsx
   - Используй CSS класс .skeleton из tokens.css (shimmer анимация)
   - Variants:
     text: h-4 w-full rounded-md
     heading: h-8 w-3/4 rounded-md
     number: h-12 w-1/2 rounded-md
     card: h-32 w-full rounded-xl
     chart: h-[200px] w-full rounded-xl
     avatar: h-9 w-9 rounded-full
     ring: h-[120px] w-[120px] rounded-full
   - Props: variant, width?, height?, lines? (для text — рендерит N строк с разной шириной)
   - Для lines: последняя строка 60% ширины

2. src/components/ui/Avatar.tsx
   - Круг с изображением или инициалами
   - Размеры: sm (32px), md (36px), lg (64px)
   - С изображением: img object-cover rounded-full
   - Без: bg primary-light, text primary, font-semibold, инициалы из name
   - showEditOverlay: camera icon overlay при hover (для Settings)
   - Props: src?, name?, size, showEditOverlay?, onClick?

3. src/components/ui/NotificationBell.tsx
   - Иконка Bell из lucide-react, size 20px, text text-secondary
   - Если count > 0: красный кружок (8px) в правом верхнем углу, bg error
   - Hover: text text-primary
   - Button wrapper: min 44px touch target
   - Props: count, onClick

4. src/components/ui/Icon.tsx
   - Wrapper для Lucide icons с size tokens из спеки
   - Props: icon (LucideIcon), size ('sm'|'md'|'lg'|'xl'), color?, className?
   - Размеры: sm=16px, md=20px, lg=24px, xl=32px
   - strokeWidth всегда 1.5

5. src/components/ui/EmptyState.tsx
   - Container: centered, py-16, px-8
   - Background: bg-dots pattern (из tokens.css)
   - Illustration slot (ReactNode) — centered, mb-6
   - Title: heading-2, text-text-primary, centered
   - Description: body-lg, text-text-secondary, centered, max-w-[420px]
   - CTA button (optional): Gold CTA, mt-6
   - Social proof (optional): body-sm, text-text-muted, mt-4
   - Props: illustration?, title, description, ctaLabel?, onCtaClick?, socialProof?
```

### Промт 1.5 — Layout компоненты + Routing

```
Прочитай AYNI_Technical_Implementation_Brief.md — Секцию 8 (Routing), 
Секцию 10 (Responsive), Секцию 11 (Dark Mode).

1. src/components/layout/NavBar.tsx
   Desktop only (hidden below lg breakpoint):
   - Position: sticky top-0, z-[100]
   - Height: 64px
   - Background: var(--color-surface-elevated) = rgba(255,255,255,0.85)
   - backdrop-filter: blur(20px) saturate(1.2)
   - border-bottom: 1px solid var(--color-border-light)
   - shadow: 0 1px 3px rgba(0,0,0,0.03)
   - Padding: 0 32px
   - Layout: flex items-center
     [Logo "AYNI" text, font-display, text-xl, text-primary] 
     [gap-10] 
     [Nav items: Home, Earn, Portfolio, Activity, Learn]
     [flex-1 spacer]
     [Button "Start Earning" variant="primary" size="sm"]
     [NotificationBell]
     [Avatar size="md" + dropdown trigger]
   - Nav items: text-sm font-medium, text-text-secondary
     Active: text-text-primary + border-b-2 border-gold (under text, not under nav)
     Hover: text-text-primary
     Gap: 32px
   - Используй react-router NavLink для active state
   - На мобильном (<1024px): скрыт полностью (hidden lg:flex)

2. src/components/layout/BottomTabBar.tsx
   Mobile only (visible below lg breakpoint):
   - Position: fixed bottom-0 left-0 right-0, z-[100]
   - Height: 64px
   - Background: var(--color-surface-elevated), backdrop-blur-[20px]
   - border-top: 1px solid var(--color-border-light)
   - 5 tabs: flex justify-around items-center
     Home (Home icon), Earn (TrendingUp icon), Portfolio (PieChart icon), 
     Activity (Clock icon), More (Menu icon)
   - Each tab: flex-col items-center gap-1, min-w-[48px], py-2
     Icon: 20px
     Label: text-[11px]
     Active: text-primary
     Inactive: text-text-muted
   - Используй react-router NavLink
   - На десктопе (>=1024px): скрыт (lg:hidden)

3. src/components/layout/PageLayout.tsx
   - Основной layout wrapper для authenticated страниц
   - Структура: NavBar + main content + BottomTabBar
   - Main content:
     max-w-[1200px] mx-auto
     Desktop: px-12 pt-8 pb-8
     Tablet: px-8 pt-6 pb-6
     Mobile: px-4 pt-5 pb-20 (pb-20 для bottom tab)
   - Background: bg-bg-primary, min-h-screen
   - Pseudo-element noise overlay (bg-noise class, position relative)
   - Использует react-router Outlet для children

4. src/components/layout/AuthLayout.tsx
   - Для auth страниц (без nav)
   - Centered: flex items-center justify-center min-h-screen
   - Background: bg-bg-primary
   - Card container: max-w-[420px] w-full
   - На desktop: опционально — двухколоночный layout 
     (left: auth card, right: subtle illustration/gradient)
   - Использует react-router Outlet

5. src/app/routes.tsx
   - Скопируй конфигурацию роутера из Секции 8 документа ПОЛНОСТЬЮ
   - Все страницы пока — lazy placeholder компоненты: 
     просто <div className="pt-8"><h1 className="font-display text-heading-1">Page Name</h1></div>
   - Создай placeholder файлы: src/pages/HomePage.tsx, EarnPage.tsx, CheckoutPage.tsx, 
     PortfolioPage.tsx, PositionDetailPage.tsx, ActivityPage.tsx, LearnPage.tsx, 
     LearnArticlePage.tsx, SettingsPage.tsx, SecuritySettingsPage.tsx, WalletSettingsPage.tsx, 
     AuthPage.tsx, NotFoundPage.tsx
   - Route guard пока — просто проверка localStorage('ayni-auth'), 
     если нет → redirect /auth

6. src/app/providers.tsx
   - QueryClientProvider (TanStack Query)
   - Потом добавим theme init

7. src/app/App.tsx
   - RouterProvider с нашим router
   - Обёрнут в providers

8. src/hooks/useTheme.ts
   - Реализуй useThemeInit из Секции 11 документа
   - Вызывай в App.tsx
   - Читает theme из uiStore (Zustand)
   - Ставит data-theme атрибут на <html>
   - Слушает prefers-color-scheme если theme='system'

9. src/stores/uiStore.ts
   - Реализуй из Секции 7 документа
   - persist: theme, advancedView → localStorage 'ayni-ui'

Проверь: npm run dev → должен открыться app с NavBar, 
навигация между placeholder страницами работает, 
BottomTabBar на mobile viewport, тема переключается.
```

---

## Проверка после Фазы 1

```bash
npm run dev
```

Открой в браузере. Проверь:
- [ ] NavBar видно на desktop, BottomTabBar на mobile
- [ ] Навигация между страницами работает
- [ ] /auth показывает AuthLayout (без nav)
- [ ] Все UI компоненты рендерятся на /dev странице
- [ ] Dark mode: добавь `data-theme="dark"` на html → всё переключается
- [ ] Типографика: DM Serif Display для заголовков, Inter для body

Если что-то сломано — скажи Claude Code:
```
Проверь ошибки в консоли и почини. Запусти npm run dev и убедись что нет ошибок TypeScript.
```

---

## ФАЗА 2: Auth + Onboarding

### Промт 2.1 — Stores + Auth Service

```
Прочитай AYNI_Technical_Implementation_Brief.md — Секцию 7 (State Management) 
и Секцию 6 (API-контракты, раздел Auth).

1. src/stores/authStore.ts — реализуй ПОЛНОСТЬЮ из Секции 7:
   - State: user (AuthUser | null), accessToken, refreshToken, isAuthenticated
   - Actions: setAuth, updateUser, logout
   - Persist: accessToken, refreshToken → localStorage 'ayni-auth'

2. src/stores/onboardingStore.ts — реализуй ПОЛНОСТЬЮ из Секции 7:
   - State: carouselCompleted, hintsShown (Record<string, boolean>)
   - Actions: completeCarousel, markHintShown, isHintShown, resetOnboarding
   - Persist → localStorage 'ayni-onboarding'

3. src/services/api.ts:
   - Создай ky instance с:
     prefixUrl: import.meta.env.VITE_API_URL || '/api'
     hooks: beforeRequest → добавь Authorization header из authStore
     hooks: afterResponse → если 401 → authStore.logout() + redirect /auth
   - Export default instance

4. src/services/authService.ts:
   - login(email, password): пока mock — возвращает через 500ms:
     { accessToken: 'mock-token-xxx', refreshToken: 'mock-refresh-xxx', 
       user: { id: '1', email, firstName: 'Alex', lastName: null, 
       avatarUrl: null, tier: 'standard', kycStatus: 'none', 
       createdAt: '2025-12-18T00:00:00Z' }}
   - register(email, password): такой же mock
   - logout(): очищает authStore

5. Обнови route guard в routes.tsx:
   - Проверяй authStore.isAuthenticated (или accessToken в localStorage)
   - Если не авторизован → redirect на /auth?redirect=current_path
   - После логина → redirect back на redirect param или /home
```

### Промт 2.2 — Auth Form

```
Реализуй страницу авторизации.

1. src/pages/AuthPage.tsx:
   - Просто рендерит AuthForm

2. src/components/onboarding/AuthForm.tsx:
   - Два режима: 'register' и 'login' (state внутри компонента)
   - Используй React Hook Form + Zod для валидации:
     const schema = z.object({
       email: z.string().email('Enter a valid email'),
       password: z.string().min(8, 'Password must be at least 8 characters'),
     });
   
   - Layout (внутри AuthLayout):
     [AYNI Logo — "AYNI" font-display text-2xl text-primary, centered, mb-8]
     
     [Title: register ? "Start earning from gold mining" : "Welcome back"
      — heading-2, centered]
     [Subtitle: register ? "Create your free account in 30 seconds" : "Sign in to your account"
      — body-lg, text-text-secondary, centered, mb-8]
     
     [Button "Continue with Google" — secondary, full-width, с Google icon]
     [Button "Continue with Apple" — secondary, full-width, с Apple icon, mt-3]
     
     [Divider: "── or ──" — flex с border lines и text text-muted, my-6]
     
     [Input email — label="Email", type="email", autoComplete="email"]
     [Input password — label="Password", type="password", autoComplete="current-password" / "new-password"]
     
     [Button "Continue" / "Sign In" — primary, full-width, mt-4, loading state при submit]
     
     [Toggle link: "Already have an account? Sign in" / "Don't have an account? Sign up"
      — body-sm, text-primary, centered, mt-4]
     
     [Terms: "By signing up you agree to terms and privacy policy"
      — body-sm, text-text-muted, centered, mt-6, links underlined]
   
   - onSubmit: 
     register → authService.register → authStore.setAuth → navigate(/home)
     login → authService.login → authStore.setAuth → navigate(redirect || /home)
   
   - Error handling: показывай ошибку под формой в text-error
   - Google/Apple OAuth: пока disabled с tooltip "Coming soon"
```

### Промт 2.3 — Welcome Carousel + Contextual Hints

```
1. src/components/onboarding/WelcomeCarousel.tsx:
   - Показывается ОДИН раз после регистрации (проверка: !onboardingStore.carouselCompleted)
   - Modal/overlay на весь экран, bg-bg-primary
   - 3 слайда:
     Slide 1: title="Invest in gold mining", description="Your investment powers real mining operations in South America. Start from just $100."
     Slide 2: title="Earn daily rewards", description="Every day, gold is mined and converted to PAXG — a gold-backed digital asset that grows your balance."
     Slide 3: title="Withdraw anytime after your term", description="Choose 6 to 48 months. At the end, withdraw your rewards or reinvest for compound growth."
   - Каждый слайд: [placeholder illustration div 200px, centered, bg-bg-secondary rounded-xl] + title (heading-2) + description (body-lg, text-secondary, max-w-[400px])
   - Dot indicators: 3 circles, 8px, active: bg-primary, inactive: bg-border
   - Кнопки: "Next" (primary) → "Next" → "Let's start" (gold-cta) → navigate(/earn) + onboardingStore.completeCarousel()
   - "Skip" text link → navigate(/home) + completeCarousel()
   - Анимация: Framer Motion AnimatePresence, slide + fade

2. src/components/onboarding/ContextualHint.tsx:
   - Bubble tooltip, positioned absolute, bg-surface-card, shadow-md, rounded-xl, p-4, max-w-[280px]
   - Arrow pointing to target element
   - Text: body-md, text-text-secondary
   - Close X button (Ghost, top-right)
   - Props: id (string), text, targetRef?, position ('top'|'bottom')
   - При dismiss → onboardingStore.markHintShown(id)
   - Показывается только если !onboardingStore.isHintShown(id)

3. Обнови flow в App / routes:
   - После register → показать WelcomeCarousel → потом redirect
   - На каждой странице (Home, Earn, Portfolio, Activity) — 
     добавь ContextualHint при первом посещении (тексты из спеки)

Проверь полный flow: 
/auth (register) → Welcome carousel → Skip/Complete → /home с hint → dismiss hint → 
refresh → hint не показывается → logout → /auth (login) → /home без carousel
```

---

## Проверка после Фазы 2

```
Проверь полный auth flow:
1. Открой / → должен redirect на /auth
2. Зарегистрируйся → Welcome carousel показывается
3. Пройди carousel → попадаешь на /earn (или /home если skip)
4. Hint показывается на каждой странице при первом посещении
5. Logout → попадаешь на /auth
6. Login → попадаешь на /home, carousel НЕ показывается
7. Hints НЕ показываются повторно
8. Refresh страницы → остаёшься залогинен (токен в localStorage)
```

---

## ФАЗА 3: Home (Dashboard)

### Промт 3.1 — Hooks + Mock Data

```
Прочитай AYNI_Technical_Implementation_Brief.md — Секцию 6 (API контракт DashboardResponse) 
и Секцию 9 (useCountUp hook).

1. src/services/mockData.ts — добавь mock для dashboard:
   export const mockDashboard: DashboardResponse = {
     user: { firstName: 'Alex', joinedAt: '2025-12-18T00:00:00Z', tier: 'standard' },
     earnings: { 
       totalEarned: 8.63, totalEarnedPaxg: 0.00166, 
       todayEarning: 0.39, dailyRate: 0.39, startDate: '2025-12-18T00:00:00Z' 
     },
     nextPayout: { 
       date: '2026-04-28T00:00:00Z', daysRemaining: 60, 
       progressPercent: 67, estimatedAmount: 3.35 
     },
     positions: { totalInvested: 414.68, activeCount: 3, completedCount: 1 },
     chartData: [генерируй массив ~90 дней с нарастающим earnedCumulative от 0 до 8.63],
     dailyRewards: [
       { date: '2026-02-27', netRewardUsd: 0.39, netRewardPaxg: 0.000075, 
         status: 'credited', goldMinedGrams: 0.002, extractionCostUsd: 0.08, platformFeeUsd: 0.04 },
       ... ещё 6 дней с похожими числами, убывающие даты
     ],
     socialProof: { totalInvestors: 1247 }
   };

2. src/services/dashboardService.ts:
   export async function getDashboard(): Promise<DashboardResponse> {
     // Mock: возвращает с задержкой
     await new Promise(r => setTimeout(r, 800));
     return mockDashboard;
   }

3. src/hooks/useDashboard.ts:
   import { useQuery } from '@tanstack/react-query';
   export function useDashboard() {
     return useQuery({ queryKey: ['dashboard'], queryFn: getDashboard, staleTime: 60_000 });
   }

4. src/hooks/useCountUp.ts — ПОЛНОСТЬЮ из Секции 9 документа (уже есть код)

5. src/hooks/useReducedMotion.ts — ПОЛНОСТЬЮ из Секции 9

6. src/hooks/useGreeting.ts:
   Возвращает строку на основе часа:
   <12 → "Good morning", <18 → "Good afternoon", else → "Good evening"
   + ", {firstName}" если есть firstName из authStore
   Если нет имени → "Welcome back"

7. src/hooks/useMediaQuery.ts:
   export function useMediaQuery(query: string): boolean — standard hook
```

### Промт 3.2 — Компоненты Home

```
Прочитай AYNI_Technical_Implementation_Brief.md — часть wireframe Home (Секция 5.1) 
и полное описание в исходном дизайн-спеке (информация про Home уже есть в brief).

Реализуй ВСЕ компоненты Home-экрана:

1. src/components/ui/ProgressRing.tsx:
   - SVG circle с animated fill
   - Props: percent, size (default 120), strokeWidth (default 4), centerContent, animated, className
   - Track: stroke var(--color-border-light), strokeWidth 4
   - Fill: stroke с SVG linearGradient (gold gradient), strokeWidth 4, strokeLinecap round
   - Анимация: Framer Motion, stroke-dashoffset от circumference до target, 1.5s ease-out
   - Center: абсолютно позиционированный div для centerContent
   - rotation: -90deg чтобы начиналось сверху
   - aria: role="progressbar", aria-valuenow, aria-valuemin=0, aria-valuemax=100

2. src/components/ui/CountUpNumber.tsx:
   - Используй useCountUp hook
   - Props: value, prefix ('$'), suffix, decimals (2), duration (1200), className, aria-label
   - Render: <span aria-hidden="true">{prefix}{displayValue}{suffix}</span>
   - + скрытый <span className="sr-only" aria-live="polite">{aria-label || prefix+value+suffix}</span>

3. src/components/home/GreetingSection.tsx:
   - useGreeting hook
   - heading-3, text-text-secondary, pt-8 pb-2

4. src/components/home/HeroEarningsCard.tsx:
   - Card variant="stat" с p-8 (desktop) / p-6 (mobile)
   - Layout: desktop — flex row (left: numbers, right: ring), mobile — flex col centered
   - Left side:
     "TOTAL EARNED" — label-sm, text-muted, uppercase
     CountUpNumber value={earnings.totalEarned} prefix="$" — font-display text-display-hero
     Gold accent line: div 40px × 2px, bg gold, opacity-50, mx-auto (mobile) / mx-0 (desktop), mt-2
     "since you started · {formatDate(startDate)}" — body-sm, text-muted, mt-2
     Daily badge: inline-flex, bg success-light, text success, rounded-full, px-3 py-1, mt-3
       "+${todayEarning} today · ↑ earning daily"
   - Right side (desktop) / Below (mobile):
     ProgressRing size={120} (desktop) / size={96} (mobile) percent={nextPayout.progressPercent}
     centerContent: 
       <div className="text-center">
         <div className="text-number-lg font-body">{daysRemaining}</div>
         <div className="text-body-sm text-text-muted">days to payout</div>
       </div>
   - Trust badge под карточкой: "🛡️ Backed by real mining" — body-sm, text-text-secondary, 
     clickable → future link to /trust

5. src/components/home/QuickStatsRow.tsx:
   - 3 StatCard:
     [1] icon=DollarSign (gold), label="Invested", value=formatCurrency(totalInvested)
     [2] icon=TrendingUp (primary), label="Daily earnings", value=formatCurrency(dailyRate)+"/day", trend: success
     [3] icon=Clock (muted), label="Next payout", value=formatDate(nextPayout.date)
   - Desktop: grid grid-cols-3 gap-4
   - Mobile: flex overflow-x-auto snap-x snap-mandatory gap-4, 
     each card min-w-[140px] snap-start, scrollbar-hide
   - Нужен StatCard компонент: src/components/ui/StatCard.tsx
     Card variant="stat", p-5
     [Icon (24px, colored)] mt-0
     [label — label-sm, text-muted, mt-3]
     [value — number-lg, text-primary (или success для trend), mt-1]

6. src/components/home/EarningsChart.tsx:
   - Recharts AreaChart, responsive container
   - Period tabs (Tabs variant="pill" size="sm"): 7D, 1M, 3M, ALL — right-aligned
   - Chart config:
     <AreaChart data={filteredData}>
       <defs><linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.15}/>
         <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0.02}/>
       </linearGradient></defs>
       <CartesianGrid horizontal={true} vertical={false} stroke="var(--color-border-light)" strokeDasharray="3 3"/>
       <XAxis dataKey="date" tick body-sm text-muted, tickFormatter → short date />
       <YAxis tick body-sm text-muted, tickFormatter → $X />
       <Tooltip content={CustomTooltip} />
       <Area type="monotone" dataKey="earnedCumulative" stroke="var(--color-gold)" strokeWidth={2} fill="url(#goldArea)"/>
     </AreaChart>
   - Custom Tooltip: bg #1A1A1A, text white, rounded-lg, p-2, body-sm, shadow
   - Height: 200px desktop / 160px mobile
   - Toggle: "Show in USD" / "Show in gold (g)" — ghost button, right, body-sm
   - Card wrapper: variant="stat", p-6
   - Heading: "Earnings over time" — heading-3

7. src/components/home/DailyBreakdown.tsx:
   - Table компонент
   - Heading: "Daily earnings" heading-3 + info tooltip + "Show mining details" toggle link (right)
   - Default columns: Date, Earned ($), Status
   - Advanced columns (когда advancedView из uiStore): + Gold mined (g), Costs, Platform fee, Net (g)
   - Status column: "✓ Credited" text success / "⏳ Pending" text warning
   - "View all →" link bottom, body-sm, text-primary
   - Card wrapper: variant="stat", p-6

8. src/components/home/CtaBanner.tsx:
   - bg-primary, text white, rounded-xl, p-7
   - "Earn more from gold mining" — heading-2, white
   - "Start earning with as little as $100. Your rewards grow daily." — body-lg, white/80
   - Button: bg white, text primary, shadow-gold, rounded-lg → navigate('/earn')
   - Desktop: flex row, button right-aligned, left side text
   - Mobile: flex col, button full-width

9. src/components/home/HomeEmptyState.tsx:
   - Показывается когда positions.activeCount === 0
   - EmptyState component:
     illustration: placeholder div 200×150, bg-bg-secondary, rounded-xl, 
       с иконкой TrendingUp + Gem (gold), centered
     title: "Start earning from real gold mining"
     description: "Invest from $100 and receive daily rewards backed by physical gold extraction."
     ctaLabel: "Start Earning"
     onCtaClick: navigate('/earn')
     socialProof: "{totalInvestors} people are already earning"

10. src/pages/HomePage.tsx:
    - Используй useDashboard hook
    - Loading: показывай skeletons (GreetingSection skeleton, HeroEarnings skeleton, 3 stat skeletons, chart skeleton)
    - Error: "Failed to load dashboard. Try again." + retry button
    - Empty (no positions): GreetingSection + HomeEmptyState
    - Data: GreetingSection + HeroEarningsCard + QuickStatsRow + EarningsChart + DailyBreakdown + CtaBanner
    - Wrap в AnimatedPage для page transition
    - Spacing: flex flex-col gap-6

Проверь: npm run dev → /home должен показать полный dashboard с данными, 
count-up анимация на hero числе, progress ring анимируется, 
chart рендерится с period switching.
```

---

## Проверка после Фазы 3

```
Открой /home и проверь:
- [ ] Greeting показывает правильное время суток + имя
- [ ] Hero число анимируется от 0 до $8.63
- [ ] Progress ring анимируется до 67%
- [ ] Gold accent line под числом
- [ ] Daily badge "+$0.39 today"
- [ ] 3 stat cards: Invested, Daily earnings, Next payout
- [ ] На mobile stat cards скроллятся горизонтально
- [ ] Chart рендерится, tabs 7D/1M/3M/ALL переключаются
- [ ] Daily breakdown table с данными
- [ ] CTA banner внизу
- [ ] Loading state: skeletons при первой загрузке
```

---

## ФАЗА 4: Earn

### Промт 4.1 — Earn калькулятор

```
Прочитай AYNI_Technical_Implementation_Brief.md — Секции 4 (AmountInput, Slider, ProjectionCard interfaces), 
Секцию 6 (EarnProjectionResponse, CreateInvestmentRequest/Response) и Секцию 7 (earnStore).

1. src/stores/earnStore.ts — реализуй из Секции 7 (уже есть полный код в документе)

2. src/services/earnService.ts:
   - getProjection(amount, months): mock, возвращает через 300ms:
     { investmentAmount: amount, termMonths: months,
       estimatedEarnings: amount * 0.175 * (months/12),
       annualReturnPercent: 17.5, 
       monthlyEarnings: amount * 0.175 / 12,
       dailyEarnings: amount * 0.175 / 365,
       firstPayoutDate: [дата через 3 месяца от сейчас],
       goldPriceUsed: 2650, tokensReceived: amount / 0.29,
       disclaimer: 'Projections are estimates...' }

3. src/hooks/useEarnProjection.ts:
   - useQuery с queryKey ['earn-projection', amount, termMonths]
   - enabled: amount >= 100
   - debounce: используй keepPreviousData: true + внутренний debounced state (300ms)

4. src/components/ui/AmountInput.tsx:
   Props: value, onChange, currency, min(100), max, quickAmounts, error, helperText
   - Большой input: text-center, font-display text-[40px], h-16, border 1.5px, rounded-lg
   - Prefix "$" внутри: absolute left, text-text-muted, same font size
   - Quick amount buttons ниже: flex gap-2 justify-center mt-3
     Каждая: rounded-full px-4 py-2, text body-md font-medium
     Active (selected): bg-primary text-white
     Inactive: bg-bg-secondary text-text-secondary hover:bg-border
     Buttons: $100, $500, $1,000, $5,000, Custom
     При клике Custom — фокус на input
   - "Minimum investment: $100" — body-sm, text-muted, mt-2, center

5. src/components/ui/Slider.tsx:
   Props: min(6), max(48), step(1), value, onChange, snapPoints([6,12,24,36,48]), labels, formatValue
   - Track: w-full h-1 bg-border rounded-sm, relative
   - Fill: absolute left-0 top-0 h-1 rounded-sm, background: gold gradient, width по проценту
   - Thumb: absolute, 24px circle, bg-surface-card, border-2 border-gold, shadow-sm, cursor-grab
     Hover: shadow-md
     Active: cursor-grabbing
   - Snap: при mouseup/touchend — snap к ближайшему snapPoint если в пределах 2 months
   - Labels под track: flex justify-between, mt-2
     "6mo" "12mo" "24mo" "36mo" "48mo"
     Active (closest snap): text-text-primary font-semibold
     Inactive: text-text-muted
   - Native <input type="range"> скрытый для accessibility, aria-label

6. src/components/earn/ProjectionCard.tsx:
   Props: estimatedEarnings, annualReturnPercent, monthlyEarnings, dailyEarnings, firstPayoutDate, termMonths, loading
   - bg gold-light, rounded-lg, p-6, border 1px gold/15
   - "ESTIMATED EARNINGS FOR {termMonths} MONTHS" — label-sm, text-gold-dark, uppercase
   - CountUpNumber value={estimatedEarnings} prefix="$" — font-display text-[40px], mt-2
   - "~{annualReturnPercent}% annual return" — number-md, text-success, mt-1
   - Breakdown rows: flex justify-between, mt-4, py-2, border-t border-gold/10
     Monthly: ~${monthlyEarnings}
     Daily: ~${dailyEarnings}  
     First payout: {formatDate(firstPayoutDate)}
     Paid in: PAXG (gold-backed token)
     Labels: body-md text-secondary, Values: body-md text-primary font-medium
   - Disclaimer: body-sm, text-muted, italic, mt-4
   - Loading: skeleton overlay

7. src/components/earn/EarningCalculator.tsx:
   - Card variant="stat", p-8
   - "How much would you like to invest?" — heading-3
   - AmountInput (связан с earnStore.amount)
   - "For how long?" — heading-4, mt-8
   - Slider (связан с earnStore.termMonths)
   - ProjectionCard (данные из useEarnProjection), mt-6
   - Checkbox "Auto-start earning" (earnStore.autoStake), mt-6
     Описание: "Your investment starts working immediately after purchase."
   - Gold CTA button: "Invest ${amount} and start earning →", full-width, h-14, mt-6
     onClick → navigate('/earn/checkout')
     disabled если amount < 100
   - "By investing, you agree to the terms of service" — body-sm, text-muted, center, mt-3

8. src/components/earn/HowItWorks.tsx:
   - "How it works" — heading-2, centered
   - 3 step cards: flex gap-5 mt-6 (desktop: row, mobile: col)
   - Каждый: Card variant="stat", p-6, text-center
     Step circle: 40px, rounded-full, bg primary-light text-primary (1,2) / bg gold-light text-gold (3)
       font-semibold, centered
     Title: heading-3, mt-4 ("Invest", "We mine", "You earn")
     Description: body-md, text-muted, mt-2

9. src/components/earn/TrustBadges.tsx:
   - bg bg-secondary, rounded-xl, p-8, mt-2
   - Row: flex gap-6 justify-center (desktop) / horizontal scroll (mobile)
   - Badges: [Shield] "PeckShield Audited", [Shield] "Certik Verified", 
     [Pickaxe] "Licensed Mining", [Lock] "Funds Protected"
   - Каждый: flex items-center gap-2, body-sm, text-text-secondary

10. src/pages/EarnPage.tsx:
    - EarnHeader: "Start Earning" heading-1, description body-lg text-secondary
    - EarningCalculator
    - HowItWorks, mt-12
    - TrustBadges
    - Внизу: "Investing more than $5,000? Contact our team →" — body-sm, text-primary, centered
    - Mobile: StickyCtaBar fixed bottom (duplicate of main CTA, visible on scroll past original)

Проверь: Earn page полностью работает, projection пересчитывается при изменении суммы/срока, 
кнопка ведёт на /earn/checkout.
```

### Промт 4.2 — Checkout

```
Реализуй checkout flow:

1. src/components/earn/OrderSummary.tsx:
   - Card p-6
   - "Order summary" — heading-3
   - Строки (flex justify-between, py-2):
     Investment amount: ${amount}
     Term: {months} months
     Estimated annual return: ~17.5%
     First payout: {date}
     ─── divider (border-t border-light) ───
     Processing fee: ${fee} (0.5%)
     ─── divider ───
     Total: ${total} — heading-3, text-primary, font-bold
   - Числа: right-aligned, text-primary

2. src/components/earn/PaymentMethods.tsx:
   - Tabs pill: "Card" | "Crypto"
   - Card tab:
     3 selectable cards (grid gap-3):
       [Apple Pay] [Google Pay] [Card/SEPA]
       Каждый: border 1.5px, rounded-lg, p-4, flex items-center gap-3
       Selected: border-primary, shadow-sm, bg primary-light
       Inactive: border-border, hover border-primary/50
       Icon + label (body-md)
     Currency dropdown: [EUR ▾] — Select component
     "You'll pay €{amount} (rate: 1 EUR = $1.075)" — body-sm, text-secondary
     "Card processing fee: €{fee} included above" — body-sm, text-muted
   - Crypto tab:
     Selectable: [Binance Pay] [USDT] [USDC] [ETH]
     Same card style

3. src/components/earn/CheckoutFlow.tsx:
   - Читает из earnStore: amount, termMonths, autoStake
   - Если store пуст (amount=0 или не задан) → redirect /earn
   - Layout: max-w-[560px] mx-auto
   - OrderSummary
   - PaymentMethods, mt-6
   - Button: "Pay ${total}" — primary, full-width, h-14, mt-6
   - "Investing more than $5,000? Contact our team →" — body-sm, text-primary, centered, mt-4
   - onSubmit: earnService.createInvestment() → success modal → navigate('/portfolio')
   - Success modal: "Investment confirmed! 🎉" + summary + "Go to Portfolio" button

4. src/pages/CheckoutPage.tsx:
   - Heading: "Checkout" heading-1
   - CheckoutFlow
```

---

## ФАЗА 5: Portfolio

### Промт 5.1

```
Прочитай AYNI_Technical_Implementation_Brief.md — Секции 4 (PositionCard, ProgressBar interfaces), 
Секцию 6 (PortfolioResponse, PositionDetailResponse, CancelPositionResponse).

1. src/services/mockData.ts — добавь mock portfolio:
   3 active positions (разные суммы, сроки, прогресс) + 1 completed
   Детальные данные: investedAmount, earnedAmount, termMonths, startDate, endDate, 
   progressPercent, monthsRemaining, nextPayoutDate, nextPayoutEstimate, dailyRate

2. src/services/portfolioService.ts:
   - getPortfolio(): mock PortfolioResponse
   - getPositionDetail(id): mock PositionDetailResponse
   - cancelPosition(id): mock, задержка 1s, возвращает CancelPositionResponse
   - reinvest(amountPaxg, termMonths): mock ReinvestResponse

3. src/hooks/usePortfolio.ts:
   - useQuery('portfolio', getPortfolio)

4. src/components/ui/ProgressBar.tsx:
   Props: percent, label, sublabel, animated(true), height(6)
   - Track: w-full, bg bg-secondary, rounded-full, h-[6px]
   - Fill: bg gold-gradient, rounded-full, h-full
   - Animated: Framer Motion, width from 0 to percent%, 1s ease-out
   - Label right: "{percent}% complete" body-sm text-text-secondary
   - Sublabel: "{months} months remaining" body-sm text-muted

5. src/components/portfolio/PortfolioOverview.tsx:
   - Desktop: flex gap-4, Mobile: flex-col gap-4
   - Main balance card (Card stat, p-7):
     "PORTFOLIO VALUE" label-sm
     display-lg CountUpNumber ${portfolioValue}
     "{activeCount} active positions" body-sm text-secondary
     "All time earned: ${totalEarned}" body-sm text-success
   - Right card (Card stat, p-5):
     "AVAILABLE" label-sm → number-lg ${availableBalance} → [Invest] secondary btn sm
     divider
     "GOLD REWARDS" label-sm → number-lg text-gold ${goldRewards} → [Withdraw][Reinvest] ghost btns

6. src/components/portfolio/PositionCard.tsx:
   - Card variant="position", expandable
   - Header row: "Position #{positionNumber}" heading-4 + Badge (status)
   - Info: "{termMonths} months · ends {formatDate(endDate)}" body-sm text-muted
   - Stats row (flex gap-8):
     "Invested" label → number-md ${invested}
     "Earned" label → number-md text-success ${earned}
     ProgressBar percent={progressPercent}
   - Payout: "Next payout: {date} · ~${estimate} estimated" body-sm text-secondary
   - Expand toggle: [Expand ▾] ghost btn right
   - Expanded section (AnimatePresence, height animate):
     [Cancel position] danger ghost btn
     [View on-chain ↗] ghost link (visible only if advancedView)
   - Cancel → confirmation Modal: "Are you sure? Early cancellation may incur penalties."
     → cancelPosition API → optimistic update

7. src/components/portfolio/CompletedPosition.tsx:
   - Similar to PositionCard but:
     Badge: "Completed" 
     No progress bar
     Shows: Invested, Earned, Claimed
     CTA: [Reinvest →] primary btn ("Reinvest and earn more")
     [View details →] ghost link

8. src/components/portfolio/PositionTabs.tsx:
   - Tabs variant="underline": "Active ({N})" | "Completed ({M})"
   - Switch between PositionCard list and CompletedPosition list

9. src/components/portfolio/AdvancedToggle.tsx:
   - Bottom of page, mt-8
   - "Show advanced details" + Toggle switch
   - Connected to uiStore.advancedView
   - When on: position cards show wallet address, AYNI/PAXG amounts, contract address

10. src/pages/PortfolioPage.tsx:
    - "Your Portfolio" heading-1
    - PortfolioOverview
    - PositionTabs + position cards
    - AdvancedToggle
    - Empty state если нет позиций
```

---

## ФАЗА 6: Activity

### Промт 6.1

```
1. src/services/mockData.ts — добавь 20 mock activity events:
   Типы: reward_credited, investment_confirmed, payout_completed, system_announcement
   Разные даты (сегодня, вчера, прошлая неделя, прошлый месяц)

2. src/services/activityService.ts:
   - getActivity(filter, page, limit): mock, paginated (возвращает 10 per page)

3. src/hooks/useActivity.ts:
   - useInfiniteQuery с getNextPageParam на основе hasMore

4. src/components/activity/ActivityFilterBar.tsx:
   - Tabs variant="pill": All, Earnings, Payments, Payouts, System

5. src/components/activity/ActivityItem.tsx:
   - Layout: flex, [icon circle 36px] [title + timestamp] [amount right-aligned]
   - Icon circle colors по type:
     reward: bg success-light, icon TrendingUp success
     investment: bg info-light, icon ArrowUpRight info
     payout: bg gold-light, icon Download gold
     system: bg bg-secondary, icon Bell muted
   - Title: body-md text-primary
   - Timestamp: body-sm text-muted, "Feb 23, 2026 · 13:45 UTC"
   - Amount: number-md, right, color по type (success for rewards, etc)
   - Subtitle (optional): body-sm text-muted ("80 USDT → 309.97 AYNI")
   - Border-bottom border-light, py-4, hover bg-bg-primary/50

6. src/components/activity/ActivityGroup.tsx:
   - Date header: label-sm text-muted mt-4 mb-2 ("Today", "Yesterday", "Last week", etc)
   - List of ActivityItem

7. src/components/activity/ActivityFeed.tsx:
   - Group events by date
   - Infinite scroll: IntersectionObserver на "Load more" button
   - Loading: spinner при загрузке следующей страницы

8. src/pages/ActivityPage.tsx:
   - "Activity" heading-1
   - ActivityFilterBar
   - ActivityFeed
   - Empty state: "All your transactions and earnings will show up in this feed."
```

---

## ФАЗА 7: Learn

### Промт 7.1

```
1. src/components/ui/Accordion.tsx:
   - Используй @radix-ui/react-accordion
   - Item: bg surface-card, rounded-lg, p-5, mb-2
   - Trigger: flex justify-between, heading-4, + ChevronDown icon (rotates 180° on open)
   - Content: body-lg text-secondary, pt-3, animated height
   - Props: items (id, title, content), defaultOpenId?, allowMultiple?

2. src/components/learn/LearnSearch.tsx:
   - Input с Search icon, full-width, rounded-lg
   - "Search articles and guides..." placeholder

3. src/components/learn/TutorialCards.tsx:
   - 3 cards horizontal: "How it works" (2 min), "Your first investment" (3 min), "Understanding your earnings" (1 min)
   - Each: Card, [video placeholder div bg-bg-secondary rounded-lg h-32] + title heading-4 + duration body-sm muted
   - Mobile: horizontal scroll

4. src/components/learn/FaqSection.tsx:
   - "Frequently asked questions" heading-2
   - Accordion с 6 items:
     "What is AYNI and how does it work?"
     "How are my earnings calculated?"
     "When do I receive my payouts?"
     "Is my investment safe?"
     "How do I withdraw my earnings?"
     "What is PAXG?"
   - Ответы: 2-3 предложения каждый (hardcoded)

5. src/components/learn/HowItWorksDiagram.tsx:
   - "How your investment works" heading-2
   - 5-step horizontal flow (desktop) / vertical (mobile):
     Invest → Mining → Gold Extracted → PAXG → Your Wallet
   - Each step: icon circle + label, connected by arrows/lines
   - Clickable: tooltip with more detail

6. src/components/learn/ContactSection.tsx:
   - "Need help?" heading-3
   - 3 buttons: [Email support] [Live chat] [Full documentation]
   - Ghost buttons с иконками

7. src/pages/LearnPage.tsx:
   - "Learn" heading-1 + "Everything you need to know about earning with AYNI" body-lg
   - LearnSearch
   - TutorialCards ("Getting started" heading-2)
   - FaqSection
   - HowItWorksDiagram
   - ContactSection
```

---

## ФАЗА 8: Settings

### Промт 8.1

```
1. src/services/userService.ts:
   - getSettings(): mock UserSettingsResponse
   - updateSettings(data): mock, returns updated

2. src/components/settings/ProfileSection.tsx:
   - Card, p-6
   - Avatar lg (64px) с camera overlay
   - Name heading-3 (или email если нет имени)
   - Email body-md text-secondary
   - [Edit profile] ghost button

3. src/components/settings/SettingsList.tsx:
   - Card, rounded-xl, overflow-hidden
   - List items: p-5, border-b border-light, flex items-center
     [icon 20px text-muted] [label body-md] [spacer] [value/chevron ›]
   - Items:
     🔒 Security → /settings/security
     💳 Payment methods → /settings/payments (future)
     🌙 Appearance → inline dropdown (Light/Dark/System) → uiStore.setTheme
     🔔 Notifications → /settings/notifications (future)
     🌐 Language → inline dropdown [English]
     📊 Advanced view → inline Toggle → uiStore.toggleAdvancedView
     🔗 Connected wallets → /settings/wallets
     👥 Referral → future

4. src/components/settings/DangerZone.tsx:
   - mt-8
   - [Sign out] ghost button → authStore.logout → /auth
   - [Delete account] danger ghost button, body-sm → confirmation modal

5. src/pages/SettingsPage.tsx:
   - "Settings" heading-1
   - ProfileSection
   - SettingsList
   - DangerZone
```

---

## ФАЗА 9-12: Polish

### Промт 9 — Dark Mode Polish

```
Проверь ВСЕ компоненты в dark mode. Для каждого:
1. Добавь data-theme="dark" на html и пройди по каждой странице
2. Проверь: достаточный контраст текста, border видимость, shadow visibility, 
   chart colors, skeleton shimmer, focus ring видимость
3. NavBar: должен использовать rgba(28,28,34,0.9) + blur в dark mode
4. Glass card: добавь в HeroEarningsCard — если dark mode, используй glass variant
5. Gold цвет: должен быть #D4B55A (ярче) в dark mode
6. Убедись что все semantic colors (success, error, warning) читаемы на тёмном фоне
```

### Промт 10 — Animations

```
1. Добавь AnimatePresence в router для page transitions:
   Каждая страница обёрнута в motion.div с:
   initial={{ opacity: 0, y: 8 }}, animate={{ opacity: 1, y: 0 }}, exit={{ opacity: 0 }}
   transition: 0.3s ease-out

2. Card stagger appear на Home:
   Используй Framer Motion variants + staggerChildren: 0.1
   Каждая карточка: initial opacity 0 translateY 12px, animate opacity 1 y 0

3. Chart line draw: включи isAnimationActive={true} animationDuration={1000} в Recharts

4. Button :active scale: добавь если ещё нет — active:scale-[0.98] transition

5. Success pulse: после claim/invest success — компонент пульсирует 
   scale 1→1.05→1 + gold glow shadow, 0.6s

6. Проверь prefers-reduced-motion: все анимации должны отключаться
```

### Промт 11 — HNW Features (если дошёл)

```
1. Определи premium tier: user.tier === 'premium' (>$10k invested)
2. NavBar: добавь "Premium" badge (gold text, bg gold-light, rounded-full) рядом с avatar
3. HeroEarningsCard: если premium — dark gradient bg (#1B3A4B → #0F2533), text white
4. Personal manager card: sticky bottom-right на desktop, banner на mobile
   Avatar 36px + "Maria S." + "Your personal advisor" + [Chat] [Schedule call]
5. На Earn page: если amount > 5000, показать OTC flow вместо стандартного
```

---

## Полезные команды для отладки

Если Claude Code что-то сломал:

```
Запусти npm run dev и покажи мне все ошибки из консоли. Исправь их.
```

```
Запусти npx tsc --noEmit и исправь все TypeScript ошибки.
```

```
Компонент Button не выглядит правильно. Перечитай AYNI_Technical_Implementation_Brief.md 
секцию 4 (ButtonProps) и секцию 2 (стили кнопок). Исправь стили чтобы точно 
соответствовали спецификации.
```

```
Проверь responsive: открой /home на viewport 375px. Stat cards должны скроллиться 
горизонтально с snap. NavBar должен быть скрыт, BottomTabBar видимый.
```
