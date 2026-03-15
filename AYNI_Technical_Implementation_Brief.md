# AYNI GOLD — Technical Implementation Brief

## Для передачи в Claude Code / dev-команду

**Версия:** 1.0
**Дата:** Февраль 2026
**Роль:** Lead Frontend Architect
**На основе:** AYNI_Redesign_DesignSpec_v1.md

---

# СЕКЦИЯ 1: Tech Stack Decision

## 1.1 Сводная таблица стека

| Категория | Выбор | Версия | Почему | Альтернатива |
|-----------|-------|--------|--------|-------------|
| Framework | **React + Vite** | React 18.3, Vite 5.4 | SPA post-login, SSR/SEO не нужен. Vite — быстрая сборка, HMR. React — крупнейшая экосистема Web3. | Next.js (избыточен без SEO), Remix |
| Language | **TypeScript** | 5.5+ strict | Type-safety для финансовых данных, API-контрактов, props | — |
| Styling | **Tailwind CSS 3.4** | 3.4 | Утилитарные классы + CSS variables для dark mode. Отлично интегрируется с design tokens. | CSS Modules (больше boilerplate), styled-components (css-in-js запрещён) |
| State (client) | **Zustand 4.5** | 4.5 | Минимальный API, не требует Provider wrapping, excellent TS support. Для UI state, auth, theme. | Jotai (атомарный — переусложнение), Redux Toolkit (boilerplate) |
| Data fetching | **TanStack Query (React Query) 5** | 5.x | Серверный кэш, stale-while-revalidate, retry, optimistic updates. Разделение server/client state. | SWR (менее фичастый), RTK Query (привязка к Redux) |
| Routing | **React Router 6** | 6.22+ | Стандарт для React SPA, loader/action поддержка, nested layouts. | TanStack Router (менее зрелый) |
| UI primitives | **Radix UI** | latest | Headless, accessible, unstyled. Для Modal, Tooltip, Dropdown, Tabs, Accordion. | shadcn/ui (надстройка над Radix — можно cherry-pick), Headless UI |
| Charts | **Recharts 2.12** | 2.12 | React-native charts, AreaChart с кастомизацией, gradient fills. Указан в дизайн-спеке. | Visx (ниже уровень), Chart.js (не React-native) |
| Animation | **Framer Motion 11** | 11.x | Declarative animations, AnimatePresence для page transitions, layout animations. | CSS transitions (для простого), GSAP (overkill) |
| Icons | **Lucide React** | 0.400+ | Указан в дизайн-спеке. Tree-shakeable, 1000+ иконок. | — |
| Fonts | **Self-hosted @font-face** | — | DM Serif Display + Inter + JetBrains Mono. Self-host для privacy/performance. НЕ Google Fonts CDN. | fontsource (npm packages) |
| Web3 | **wagmi 2 + viem** | wagmi 2.x, viem 2.x | Hooks-based Web3 для connect wallet, read contract. Только для advanced view. | ethers.js (imperative API, тяжелее) |
| Forms | **React Hook Form 7** | 7.x | Uncontrolled forms, minimal re-renders, Zod validation интеграция. | Formik (больше re-renders) |
| Validation | **Zod 3.23** | 3.23 | Runtime + compile-time validation. API responses, form data. | Yup (менее type-safe) |
| Testing | **Vitest + Playwright** | Vitest 2.x, Playwright 1.x | Vitest — unit/integration (совместим с Vite). Playwright — E2E. | Jest (медленнее с Vite) |
| Build | **Vite 5.4** | 5.4 | Уже выбран как bundler. ESBuild для dev, Rollup для prod. | — |
| Lint/Format | **ESLint 9 + Prettier 3** | ESLint 9, Prettier 3 | Стандарт индустрии. + eslint-plugin-react-hooks, @typescript-eslint. | Biome (менее зрелый) |
| HTTP client | **ky 1.x** | 1.x | Tiny wrapper over fetch, hooks, retry, JSON by default. | axios (тяжелее), native fetch (нет retry) |
| Date | **date-fns 3** | 3.x | Tree-shakeable, functional. Для форматирования дат в Activity, Portfolio. | dayjs (тоже ok), Temporal (не везде поддерживается) |
| Number format | **Intl.NumberFormat** | native | Встроенный в браузер. Для валют, процентов. | — |

## 1.2 TypeScript Config

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": false,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/services/*": ["./src/services/*"],
      "@/types/*": ["./src/types/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/assets/*": ["./src/assets/*"]
    },
    "skipLibCheck": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

# СЕКЦИЯ 2: Design Tokens → Code

## 2.1 CSS Custom Properties — `tokens.css`

```css
/* ==========================================================================
   AYNI GOLD — Design Tokens
   Source: AYNI_Redesign_DesignSpec_v1.md
   ========================================================================== */

:root {
  /* ── PRIMARY ───────────────────────────────────────────────────────── */
  --color-primary: #1B3A4B;
  --color-primary-hover: #152F3D;
  --color-primary-light: #E8F0F4;

  /* ── GOLD ACCENT ───────────────────────────────────────────────────── */
  --color-gold: #C9A84C;
  --color-gold-light: #F5EFD7;
  --color-gold-gradient: linear-gradient(135deg, #C9A84C 0%, #E8D48B 50%, #C9A84C 100%);
  --color-gold-dark: #A68B3C;

  /* ── NEUTRAL / BACKGROUNDS ─────────────────────────────────────────── */
  --color-bg-primary: #FAFAF7;
  --color-bg-secondary: #F4F3EF;
  --color-surface-card: #FFFFFF;
  --color-surface-elevated: rgba(255, 255, 255, 0.85);

  /* ── BORDERS ───────────────────────────────────────────────────────── */
  --color-border: #E8E6E1;
  --color-border-light: #F0EEEA;

  /* ── TEXT ───────────────────────────────────────────────────────────── */
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #6B6B6B;
  --color-text-muted: #9B9B9B;
  --color-text-on-primary: #FFFFFF;

  /* ── SEMANTIC ──────────────────────────────────────────────────────── */
  --color-success: #2D8A4E;
  --color-success-light: #E8F5EC;
  --color-warning: #D4920A;
  --color-warning-light: #FFF8E6;
  --color-error: #C53030;
  --color-error-light: #FEE8E8;
  --color-info: #2B6CB0;
  --color-info-light: #E6F0FA;

  /* ── SHADOWS (Elevation System) ────────────────────────────────────── */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
  --shadow-md: 0 2px 6px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.08), 0 16px 48px rgba(0, 0, 0, 0.08);
  --shadow-gold: 0 2px 12px rgba(201, 168, 76, 0.15);

  /* ── BORDER RADIUS ─────────────────────────────────────────────────── */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  /* ── SPACING ───────────────────────────────────────────────────────── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ── ICON SIZES ────────────────────────────────────────────────────── */
  --icon-sm: 16px;
  --icon-md: 20px;
  --icon-lg: 24px;
  --icon-xl: 32px;

  /* ── LAYOUT ────────────────────────────────────────────────────────── */
  --content-max-width: 1200px;
  --nav-height-desktop: 64px;
  --nav-height-mobile: 56px;
  --tab-bar-height: 64px;
  --content-padding-desktop: 32px;    /* was 48px → tighter */
  --content-padding-mobile: 16px;
  --section-gap: 16px;                /* gap between cards/sections */
  --card-padding-sm: 16px;            /* stat cards, small cards */
  --card-padding-md: 20px;            /* charts, tables, large cards */
  --card-padding-lg: 24px;            /* hero card, premium */
  --page-top-padding: 20px;           /* top of page content */

  /* ── TRANSITIONS ───────────────────────────────────────────────────── */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease-out;
  --transition-spring: 0.4s ease-out;
}

/* ══════════════════════════════════════════════════════════════════════════
   DARK MODE
   ══════════════════════════════════════════════════════════════════════════ */

[data-theme="dark"] {
  --color-bg-primary: #141418;
  --color-bg-secondary: #1C1C22;
  --color-surface-card: #242428;
  --color-surface-elevated: rgba(28, 28, 34, 0.9);

  --color-border: #2E2E35;
  --color-border-light: #252530;

  --color-text-primary: #F0F0F0;
  --color-text-secondary: #A0A0A8;
  --color-text-muted: #6B6B75;

  --color-gold: #D4B55A;
  --color-primary: #3A8CC0;
  --color-primary-hover: #2E7AAD;
  --color-primary-light: rgba(58, 140, 192, 0.15);

  --color-success: #3DA564;
  --color-success-light: rgba(61, 165, 100, 0.15);
  --color-warning: #E0A30E;
  --color-warning-light: rgba(224, 163, 14, 0.15);
  --color-error: #E05252;
  --color-error-light: rgba(224, 82, 82, 0.15);
  --color-info: #4A90D9;
  --color-info-light: rgba(74, 144, 217, 0.15);

  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-md: 0 2px 6px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.3), 0 16px 48px rgba(0, 0, 0, 0.25);
  --shadow-gold: 0 2px 12px rgba(212, 181, 90, 0.2);
}
```

## 2.2 Tailwind Config — `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      /* ── COLORS ──────────────────────────────────────────────── */
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
        },
        gold: {
          DEFAULT: "var(--color-gold)",
          light: "var(--color-gold-light)",
          dark: "var(--color-gold-dark)",
        },
        surface: {
          bg: "var(--color-bg-primary)",
          secondary: "var(--color-bg-secondary)",
          card: "var(--color-surface-card)",
          elevated: "var(--color-surface-elevated)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          light: "var(--color-border-light)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          "on-primary": "var(--color-text-on-primary)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          light: "var(--color-success-light)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          light: "var(--color-warning-light)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          light: "var(--color-error-light)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          light: "var(--color-info-light)",
        },
      },

      /* ── TYPOGRAPHY ──────────────────────────────────────────── */
      fontFamily: {
        display: ['"DM Serif Display"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "Consolas", "monospace"],
      },
      fontSize: {
        "display-hero": [
          "56px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" },
        ],
        "display-hero-mobile": [
          "40px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" },
        ],
        "display-lg": [
          "40px",
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        "display-lg-mobile": [
          "32px",
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        "heading-1": [
          "32px",
          { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        "heading-1-mobile": [
          "28px",
          { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        "heading-2": [
          "24px",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "heading-2-mobile": [
          "20px",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "heading-3": [
          "18px",
          { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" },
        ],
        "heading-3-mobile": [
          "16px",
          { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" },
        ],
        "heading-4": [
          "15px",
          { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "600" },
        ],
        "heading-4-mobile": [
          "14px",
          { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "600" },
        ],
        "body-lg": [
          "16px",
          { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" },
        ],
        "body-lg-mobile": [
          "15px",
          { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" },
        ],
        "body-md": [
          "14px",
          { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" },
        ],
        "body-md-mobile": [
          "13px",
          { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" },
        ],
        "body-sm": [
          "12px",
          { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "400" },
        ],
        "label-sm": [
          "11px",
          { lineHeight: "1.3", letterSpacing: "0.05em", fontWeight: "500" },
        ],
        "number-lg": [
          "28px",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        "number-lg-mobile": [
          "24px",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        "number-md": [
          "20px",
          { lineHeight: "1.2", letterSpacing: "0", fontWeight: "500" },
        ],
        "number-md-mobile": [
          "18px",
          { lineHeight: "1.2", letterSpacing: "0", fontWeight: "500" },
        ],
        "mono-sm": [
          "12px",
          { lineHeight: "1.4", letterSpacing: "0", fontWeight: "400" },
        ],
      },

      /* ── SHADOWS ─────────────────────────────────────────────── */
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        gold: "var(--shadow-gold)",
      },

      /* ── BORDER RADIUS ───────────────────────────────────────── */
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },

      /* ── SPACING ─────────────────────────────────────────────── */
      spacing: {
        "content-padding": "var(--content-padding-desktop)",
        "nav-height": "var(--nav-height-desktop)",
        "tab-bar": "var(--tab-bar-height)",
      },

      /* ── MAX WIDTH ───────────────────────────────────────────── */
      maxWidth: {
        content: "var(--content-max-width)",
      },

      /* ── BACKDROP BLUR ───────────────────────────────────────── */
      backdropBlur: {
        nav: "20px",
      },

      /* ── ANIMATIONS ──────────────────────────────────────────── */
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "card-appear": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up-sheet": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        "draw-ring": {
          from: { strokeDashoffset: "var(--ring-circumference)" },
          to: { strokeDashoffset: "var(--ring-offset)" },
        },
        "success-pulse": {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(201,168,76,0.3)" },
          "50%": { transform: "scale(1.05)", boxShadow: "0 0 0 8px rgba(201,168,76,0)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(201,168,76,0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "card-appear": "card-appear 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease",
        "slide-up-sheet": "slide-up-sheet 0.3s ease-out",
        shimmer: "shimmer 1.5s linear infinite",
        "draw-ring": "draw-ring 1.5s ease-out forwards",
        "success-pulse": "success-pulse 0.6s ease",
      },
    },

    /* ── SCREENS (Breakpoints) ─────────────────────────────────── */
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
  },
  plugins: [],
};

export default config;
```

## 2.2.1 КРИТИЧНО: Правила плотности (Density Rules)

**Все значения spacing в этом документе — в пикселях, НЕ в Tailwind классах.**
Когда спека пишет "p-24" — это значит padding: 24px, что в Tailwind = `p-6`.

### Таблица соответствия (spec px → Tailwind class)

| Spec значение | Пиксели | Tailwind class | Где используется |
|:---:|:---:|:---:|:---|
| p-4 / p-sm | 16px | `p-4` | Stat cards, small cards, compact items |
| p-5 / p-md | 20px | `p-5` | Charts, tables, large content cards |
| p-6 / p-lg | 24px | `p-6` | Hero card (desktop only), premium cards |
| gap-3 | 12px | `gap-3` | Between position cards, achievement cards |
| gap-4 | 16px | `gap-4` | Between sections on page (PRIMARY gap) |
| mt-3 | 12px | `mt-3` | Minor spacing within sections |
| mt-4 | 16px | `mt-4` | Between sections |
| mt-5 | 20px | `mt-5` | Major section breaks |

### Golden Rules — Density

1. **Section gap = 16px** (`gap-4`) — между карточками/секциями на странице
2. **Card padding = 16px** (`p-4`) для stat-карточек, **20px** (`p-5`) для больших
3. **Page top = 20px** (`pt-5`) — от навбара до контента
4. **Labels = 11px** (`text-[11px]`) — "TOTAL EARNED", "INVESTED", stat labels
5. **Values = 18-20px** (`text-lg` / `text-xl`) — числа в stat cards
6. **Hero number = 40-48px** (`text-[40px] md:text-[48px]`) — главное число
7. **Section headings = 16px** (`text-base font-semibold`) — "Earnings over time", "Daily earnings"
8. **Table rows = 10px** (`py-2.5`) — vertical padding в строках таблиц
9. **Home page** должен помещаться в 1 экран (1440×900) до CTA banner
10. **Earn desktop** — 2 колонки: calc (60%) + projection (40%, sticky)

### Анти-паттерны (НЕ ДЕЛАТЬ)

- ❌ `p-8` (32px) для обычных карточек — слишком жирно
- ❌ `gap-6` (24px) между секциями — слишком разреженно
- ❌ `text-[56px]` для hero числа — слишком крупно для кабинета
- ❌ `pt-8` (32px) top padding страницы — пустое пространство сверху
- ❌ Progress ring 120px — слишком большой, max 96px

## 2.3 TypeScript Theme Type

```typescript
// src/types/theme.ts

export type ThemeMode = "light" | "dark" | "system";

export interface ColorTokens {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  gold: string;
  goldLight: string;
  goldDark: string;
  bgPrimary: string;
  bgSecondary: string;
  surfaceCard: string;
  surfaceElevated: string;
  border: string;
  borderLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;
}

export interface ShadowTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  gold: string;
}

export interface RadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  full: string;
}

export type SpacingScale = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

export interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

export type TypographyToken =
  | "display-hero"
  | "display-lg"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "label-sm"
  | "number-lg"
  | "number-md"
  | "mono-sm";
```

---

# СЕКЦИЯ 3: Файловая структура проекта

```
ayni-cabinet/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
├── public/
│   ├── favicon.ico
│   ├── noise.svg                     # Subtle texture overlay
│   └── illustrations/                # Empty state illustrations
│       ├── gold-bars.svg
│       ├── mining-pick.svg
│       └── welcome.svg
├── src/
│   ├── main.tsx                      # Entry point
│   ├── App.tsx                       # Root component + providers
│   ├── vite-env.d.ts
│   │
│   ├── app/                          # Route-level page components
│   │   ├── RootLayout.tsx            # Shared layout: NavBar + content area + TabBar
│   │   ├── AuthLayout.tsx            # Layout for login/signup (no nav)
│   │   ├── HomePage.tsx              # Dashboard / Home
│   │   ├── EarnPage.tsx              # Calculator + buy + stake
│   │   ├── CheckoutPage.tsx          # Payment flow
│   │   ├── PortfolioPage.tsx         # Positions overview
│   │   ├── PositionDetailPage.tsx    # Single position details
│   │   ├── ActivityPage.tsx          # Activity feed
│   │   ├── LearnPage.tsx             # Guides + FAQ
│   │   ├── ArticlePage.tsx           # Single article
│   │   ├── SettingsPage.tsx          # Profile + settings
│   │   ├── OnboardingPage.tsx        # Welcome carousel (post-signup)
│   │   ├── LoginPage.tsx             # Sign in
│   │   ├── RegisterPage.tsx          # Sign up
│   │   └── NotFoundPage.tsx          # 404
│   │
│   ├── components/
│   │   ├── ui/                       # Atomic / reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── AmountInput.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── ProgressRing.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Accordion.tsx
│   │   │   ├── Toggle.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── CountUpNumber.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   ├── layout/
│   │   │   ├── NavBar.tsx            # Desktop top nav
│   │   │   ├── MobileTabBar.tsx      # Mobile bottom tab bar
│   │   │   ├── PageLayout.tsx        # Content wrapper (max-width, padding)
│   │   │   ├── PageHeader.tsx        # Title + subtitle section
│   │   │   └── index.ts
│   │   │
│   │   ├── home/
│   │   │   ├── GreetingSection.tsx   # "Good morning, {Name}"
│   │   │   ├── HeroEarningsCard.tsx  # Total earned + progress ring
│   │   │   ├── QuickStatsRow.tsx     # 3 stat cards horizontal
│   │   │   ├── EarningsChart.tsx     # Area chart with period tabs
│   │   │   ├── DailyBreakdown.tsx    # Daily earnings table
│   │   │   ├── CtaBanner.tsx         # "Earn more from gold mining"
│   │   │   ├── EmptyHomeState.tsx    # For new users (0 investments)
│   │   │   └── index.ts
│   │   │
│   │   ├── earn/
│   │   │   ├── EarningCalculator.tsx # Amount input + slider + projection
│   │   │   ├── ProjectionCard.tsx    # Estimated earnings display
│   │   │   ├── HowItWorks.tsx        # 3-step explanation cards
│   │   │   ├── TrustBadges.tsx       # Security badges row
│   │   │   ├── AutoStakeCheckbox.tsx # Auto-start earning toggle
│   │   │   └── index.ts
│   │   │
│   │   ├── checkout/
│   │   │   ├── OrderSummary.tsx      # Investment details summary
│   │   │   ├── PaymentMethodTabs.tsx # Card / Crypto tabs
│   │   │   ├── CardPaymentForm.tsx   # Apple Pay / Google Pay / Card / SEPA
│   │   │   ├── CryptoPaymentForm.tsx # Binance Pay / USDT / USDC / ETH
│   │   │   ├── OtcBanner.tsx         # ">$5k? Contact team" link
│   │   │   └── index.ts
│   │   │
│   │   ├── portfolio/
│   │   │   ├── PortfolioOverview.tsx # Balance cards (portfolio value + available)
│   │   │   ├── PositionCard.tsx      # Single position card (expandable)
│   │   │   ├── PositionList.tsx      # Active/Completed tabs + list
│   │   │   ├── GoldRewardsCard.tsx   # Available gold rewards + withdraw/reinvest
│   │   │   ├── AdvancedToggle.tsx    # Show crypto details toggle
│   │   │   ├── CancelPositionModal.tsx # Confirm cancellation
│   │   │   ├── ReinvestModal.tsx     # PAXG → AYNI swap confirmation
│   │   │   └── index.ts
│   │   │
│   │   ├── activity/
│   │   │   ├── ActivityFeed.tsx      # Feed list with date groups
│   │   │   ├── ActivityItem.tsx      # Single activity item
│   │   │   ├── ActivityFilters.tsx   # Pill filter tabs
│   │   │   └── index.ts
│   │   │
│   │   ├── learn/
│   │   │   ├── FeaturedArticles.tsx  # Tutorial card row
│   │   │   ├── ArticleCard.tsx       # Single article/video card
│   │   │   ├── FaqSection.tsx        # Accordion FAQ
│   │   │   ├── HowItWorksDiagram.tsx # Interactive flow diagram
│   │   │   ├── ContactSection.tsx    # Support links
│   │   │   └── index.ts
│   │   │
│   │   ├── onboarding/
│   │   │   ├── OnboardingCarousel.tsx # 3-slide welcome carousel
│   │   │   ├── OnboardingSlide.tsx    # Single slide
│   │   │   ├── ContextualHint.tsx     # Tooltip hint (dismissable)
│   │   │   └── index.ts
│   │   │
│   │   ├── settings/
│   │   │   ├── ProfileSection.tsx     # Avatar + name + email
│   │   │   ├── SettingsList.tsx       # Settings menu items
│   │   │   ├── SettingsItem.tsx       # Single setting row
│   │   │   ├── AppearanceSelect.tsx   # Light/Dark/System dropdown
│   │   │   ├── DangerZone.tsx         # Sign out + delete account
│   │   │   └── index.ts
│   │   │
│   │   ├── mine/
│   │   │   ├── MineIllustration.tsx  # Isometric SVG/CSS mine scene (5 levels)
│   │   │   ├── MineHeader.tsx        # "My Mine" + level name + badge
│   │   │   ├── MineLevelProgress.tsx # Progress bar to next level
│   │   │   ├── DailyProductionCard.tsx # Gold nugget glow + today's production
│   │   │   ├── MineStatsGrid.tsx     # 2×2 grid: Workers, Equipment, Output, Efficiency
│   │   │   ├── UpgradeCTA.tsx        # "Invest more to reach next level"
│   │   │   ├── AchievementsSection.tsx # Grid of unlocked/locked achievements
│   │   │   ├── MinePreviewCard.tsx   # Compact card for Home page
│   │   │   ├── MineTimeline.tsx      # History timeline of mine events
│   │   │   └── index.ts
│   │   │
│   │   └── shared/
│   │       ├── NotificationBell.tsx   # Bell icon with unread count
│   │       ├── UserMenu.tsx           # Avatar dropdown menu
│   │       ├── GoldAccentLine.tsx     # Decorative gold line under numbers
│   │       ├── TrustBadge.tsx         # Shield badge "Backed by real mining"
│   │       ├── TimelineStep.tsx       # Step indicator (number + title + desc)
│   │       └── index.ts
│   │
│   ├── hooks/
│   │   ├── useTheme.ts               # Theme toggle + system detection
│   │   ├── useAuth.ts                # Auth state hook
│   │   ├── useMediaQuery.ts          # Responsive breakpoint hook
│   │   ├── useCountUp.ts             # Number count-up animation
│   │   ├── useInView.ts              # Intersection observer for scroll animations
│   │   ├── useGreeting.ts            # Time-based greeting text
│   │   ├── usePullToRefresh.ts       # Mobile pull-to-refresh
│   │   ├── useMine.ts               # React Query hook for Mine stats
│   │   └── useReducedMotion.ts       # prefers-reduced-motion
│   │
│   ├── stores/
│   │   ├── authStore.ts              # Auth token, user session
│   │   ├── uiStore.ts                # Theme, sidebar, modals, contextual hints
│   │   ├── earnStore.ts              # Calculator state (amount, term)
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── api.ts                    # Base API client (ky instance)
│   │   ├── dashboard.ts              # GET /api/dashboard
│   │   ├── earn.ts                   # Earn-related API calls
│   │   ├── portfolio.ts              # Portfolio API calls
│   │   ├── activity.ts               # Activity feed API
│   │   ├── learn.ts                  # Learn articles API
│   │   ├── user.ts                   # User settings, wallets
│   │   ├── auth.ts                   # Auth API (login, register, refresh)
│   │   ├── prices.ts                 # AYNI + PAXG prices
│   │   ├── mine.ts                   # Mine gamification API
│   │   └── mock/                     # Mock data for dev without backend
│   │       ├── handlers.ts           # MSW request handlers
│   │       ├── browser.ts            # MSW browser setup
│   │       ├── data/
│   │       │   ├── dashboard.ts
│   │       │   ├── portfolio.ts
│   │       │   ├── activity.ts
│   │       │   ├── learn.ts
│   │       │   └── user.ts
│   │       └── index.ts
│   │
│   ├── types/
│   │   ├── api.ts                    # All API response/request types
│   │   ├── theme.ts                  # Theme types
│   │   ├── mine.ts                   # Mine levels, stats, achievements types
│   │   ├── navigation.ts             # Route types
│   │   └── index.ts
│   │
│   ├── lib/
│   │   ├── formatCurrency.ts         # $1,234.56 formatting
│   │   ├── formatDate.ts             # Date formatting helpers
│   │   ├── formatNumber.ts           # Number formatting (%, grams)
│   │   ├── cn.ts                     # clsx + twMerge utility
│   │   ├── constants.ts              # App constants (min investment, etc.)
│   │   ├── mineConfig.ts             # Mine level thresholds, names, descriptions
│   │   └── queryKeys.ts              # React Query key factory
│   │
│   ├── styles/
│   │   ├── tokens.css                # CSS custom properties (section 2.1)
│   │   ├── globals.css               # Tailwind directives + global resets
│   │   ├── fonts.css                 # @font-face declarations
│   │   └── noise.css                 # Subtle background texture
│   │
│   └── assets/
│       └── fonts/
│           ├── DMSerifDisplay-Regular.woff2
│           ├── Inter-Regular.woff2
│           ├── Inter-Medium.woff2
│           ├── Inter-SemiBold.woff2
│           └── JetBrainsMono-Regular.woff2
```

---

# СЕКЦИЯ 4: Компонентная архитектура (TypeScript Interfaces)

```typescript
// src/types/components.ts

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   UI PRIMITIVES
   ═══════════════════════════════════════════════════════════════════════ */

// ── Button ──────────────────────────────────────────────────────────────

export interface ButtonProps {
  variant: "primary" | "secondary" | "ghost" | "danger" | "gold-cta";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
}

// ── Card ────────────────────────────────────────────────────────────────

export type CardVariant = "stat" | "position" | "action" | "premium" | "glass";

export interface CardProps {
  variant?: CardVariant;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: "sm" | "md" | "lg";
}

export interface StatCardProps {
  label: string;
  value: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  icon?: LucideIcon;
  iconColor?: "gold" | "primary" | "muted" | "success";
  tooltip?: string;
  onClick?: () => void;
}

// ── Input ───────────────────────────────────────────────────────────────

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "number";
  error?: string;
  helperText?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  className?: string;
  id?: string;
  autoFocus?: boolean;
}

// ── AmountInput ─────────────────────────────────────────────────────────

export interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  currency?: string;
  quickAmounts?: number[];
  error?: string;
  helperText?: string;
}

// ── Slider ──────────────────────────────────────────────────────────────

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  snapPoints?: number[];
  labels?: Array<{ value: number; label: string }>;
  "aria-label"?: string;
}

// ── ProgressRing ────────────────────────────────────────────────────────

export interface ProgressRingProps {
  progress: number;         // 0-100
  size?: number;            // px, default 120 desktop / 96 mobile
  strokeWidth?: number;     // px, default 4
  centerLabel: string;      // "23"
  centerSublabel: string;   // "days to payout"
  animate?: boolean;        // default true
  className?: string;
}

// ── ProgressBar ─────────────────────────────────────────────────────────

export interface ProgressBarProps {
  progress: number;         // 0-100
  height?: number;          // px, default 6
  label?: string;           // "67% complete"
  sublabel?: string;        // "8 months remaining"
  animate?: boolean;
  className?: string;
}

// ── Badge ───────────────────────────────────────────────────────────────

export type BadgeStatus = "active" | "pending" | "completed" | "claimed" | "locked";

export interface BadgeProps {
  status: BadgeStatus;
  label?: string;           // Override default status label
  size?: "sm" | "md";
  className?: string;
}

// ── Table ───────────────────────────────────────────────────────────────

export interface TableColumn<T> {
  key: keyof T & string;
  header: string;
  align?: "left" | "right" | "center";
  render?: (value: T[keyof T], row: T) => ReactNode;
  hideOnMobile?: boolean;
  width?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  mobileCardView?: boolean;  // Render as cards on mobile
  mobileCardRender?: (row: T) => ReactNode;
  compact?: boolean;
}

// ── Tooltip ─────────────────────────────────────────────────────────────

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  maxWidth?: number;
  delayMs?: number;
}

// ── Modal ───────────────────────────────────────────────────────────────

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: number;        // px, default 480
  showClose?: boolean;
  preventClose?: boolean;   // Disable backdrop click / escape
}

// ── BottomSheet (mobile) ────────────────────────────────────────────────

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  snapPoints?: number[];    // Height percentages [0.5, 0.9]
  dragToDismiss?: boolean;
}

// ── Tabs ────────────────────────────────────────────────────────────────

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: LucideIcon;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: "pill" | "underline";
  size?: "sm" | "md";
  className?: string;
}

// ── Accordion ───────────────────────────────────────────────────────────

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
}

// ── Toggle ──────────────────────────────────────────────────────────────

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

// ── Checkbox ────────────────────────────────────────────────────────────

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

// ── Avatar ──────────────────────────────────────────────────────────────

export interface AvatarProps {
  src?: string;
  name?: string;            // Fallback initials
  size?: "sm" | "md" | "lg" | "xl";
  showEdit?: boolean;
  onClick?: () => void;
}

// ── CountUpNumber ───────────────────────────────────────────────────────

export interface CountUpNumberProps {
  value: number;
  prefix?: string;          // "$"
  suffix?: string;          // "%"
  decimals?: number;
  duration?: number;        // ms, default 1200
  className?: string;
  formatFn?: (value: number) => string;
  "aria-label"?: string;
}

// ── SkeletonLoader ──────────────────────────────────────────────────────

export interface SkeletonProps {
  variant?: "text" | "circle" | "rect" | "card";
  width?: string | number;
  height?: string | number;
  count?: number;           // Repeat for text lines
  className?: string;
}

// ── EmptyState ──────────────────────────────────────────────────────────

export interface EmptyStateProps {
  illustration?: "gold-bars" | "mining-pick" | "welcome" | "activity" | "portfolio";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps["variant"];
  };
  socialProof?: string;     // "1,247 people are already earning"
}

// ── Dropdown ────────────────────────────────────────────────────────────

export interface DropdownOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

/* ═══════════════════════════════════════════════════════════════════════
   BUSINESS COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */

// ── ProjectionCard ──────────────────────────────────────────────────────

export interface ProjectionCardProps {
  estimatedEarnings: number;  // USD
  annualReturn: number;       // percentage
  monthlyEarning: number;
  dailyEarning: number;
  firstPayoutDate: string;    // ISO date
  paymentToken: string;       // "PAXG"
  disclaimer: string;
}

// ── TimelineStep ────────────────────────────────────────────────────────

export interface TimelineStepProps {
  step: number;
  title: string;
  description: string;
  accentColor?: "primary" | "gold";
  isLast?: boolean;
}

// ── ActivityItem ────────────────────────────────────────────────────────

export type ActivityType = "reward" | "investment" | "payout" | "system" | "withdrawal";

export interface ActivityItemProps {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string;         // ISO date
  amount?: {
    value: string;
    direction: "positive" | "negative" | "neutral";
  };
  details?: string;          // "80 USDT → 309.97 AYNI"
  onClick?: () => void;
}

// ── NotificationBell ────────────────────────────────────────────────────

export interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
}

// ── OnboardingCarousel ──────────────────────────────────────────────────

export interface OnboardingSlide {
  illustration: string;
  title: string;
  description: string;
}

export interface OnboardingCarouselProps {
  slides: OnboardingSlide[];
  onComplete: () => void;
  onSkip: () => void;
}

// ── EarningsChart ───────────────────────────────────────────────────────

export type ChartPeriod = "7D" | "1M" | "3M" | "ALL";

export interface EarningsChartProps {
  data: Array<{ date: string; earned: number }>;
  activePeriod: ChartPeriod;
  onPeriodChange: (period: ChartPeriod) => void;
  showInGold?: boolean;
  onToggleUnit?: () => void;
  loading?: boolean;
}

// ── PositionCard ────────────────────────────────────────────────────────

export interface PositionCardData {
  id: string;
  positionNumber: number;
  status: "active" | "completed" | "cancelled";
  termMonths: number;
  startDate: string;
  endDate: string;
  investedAmount: number;
  earnedAmount: number;
  progressPercent: number;
  monthsRemaining: number;
  nextPayoutDate: string;
  nextPayoutEstimate: number;
  claimedAmount?: number;
}

export interface PositionCardComponentProps {
  position: PositionCardData;
  expanded?: boolean;
  onExpand?: () => void;
  onCancel?: () => void;
  onReinvest?: () => void;
  onViewOnChain?: () => void;
  showAdvanced?: boolean;
}

// ── NavBar ──────────────────────────────────────────────────────────────

export interface NavBarProps {
  currentPath: string;
  userName?: string;
  avatarUrl?: string;
  unreadNotifications: number;
  isPremium?: boolean;
}

// ── MobileTabBar ────────────────────────────────────────────────────────

export interface MobileTabBarProps {
  currentPath: string;
}
```

---

# СЕКЦИЯ 5: Экранные компоненты (Page Components)

## 5.1 HomePage

**Компоненты:** GreetingSection, HeroEarningsCard (или EmptyHomeState для новых), QuickStatsRow, EarningsChart, DailyBreakdown, CtaBanner

**Layout:**
```
desktop: flex-col, max-w-content, mx-auto, px-12, py-8
mobile: flex-col, px-4, py-5, pb-20 (tab bar offset)
```

**API calls:**
- `GET /api/dashboard` — все данные для Home

**Loading state:** Skeleton для HeroCard (rect 200px), 3 skeleton stat cards, skeleton chart (rect 200px), skeleton table (5 rows)

**Empty state (0 investments):** EmptyHomeState с illustration, CTA "Start Earning", social proof

**Error state:** Card с иконкой ошибки, "Unable to load dashboard", retry button

## 5.2 EarnPage

**Компоненты:** PageHeader, EarningCalculator (AmountInput + Slider + ProjectionCard + AutoStakeCheckbox + Gold CTA Button), HowItWorks (3x TimelineStep), TrustBadges

**Layout:**
```
desktop: flex-col, max-w-[720px] для калькулятора, max-w-content для HowItWorks
mobile: flex-col, px-4
```

**API calls:**
- `GET /api/earn/projection?amount=X&months=Y` — debounced (300ms) на изменение amount/term

**Loading state:** Projection card shimmer при пересчёте

**Error state:** Inline error под калькулятором

## 5.3 CheckoutPage

**Компоненты:** OrderSummary, PaymentMethodTabs (CardPaymentForm, CryptoPaymentForm), OtcBanner

**Layout:**
```
desktop: 2 columns (order summary left 40%, payment right 60%), max-w-[900px]
mobile: flex-col, order summary top → payment below
```

**API calls:**
- `POST /api/earn/invest` — при клике Pay

**Loading state:** Processing overlay на кнопку Pay

**Error state:** Toast с ошибкой платежа + retry

## 5.4 PortfolioPage

**Компоненты:** PageHeader, PortfolioOverview (2 карточки: balance + available/rewards), PositionList (Tabs: Active/Completed + PositionCards), AdvancedToggle

**Layout:**
```
desktop: flex-col. Overview = flex-row (70%/30%). Positions = full-width cards stack
mobile: flex-col, all stacked
```

**API calls:**
- `GET /api/portfolio` — overview + all positions

**Loading state:** 2 skeleton cards (overview) + 3 skeleton position cards

**Empty state:** EmptyState "Your active investments will appear here" + CTA "Start Earning"

## 5.5 PositionDetailPage

**Компоненты:** Back button, PositionCard (expanded), detailed chart (earnings over time for this position), daily breakdown table, Cancel/Reinvest actions

**API calls:**
- `GET /api/portfolio/:id`

## 5.6 ActivityPage

**Компоненты:** PageHeader, ActivityFilters (pill tabs), ActivityFeed (grouped by date), "Load more" button

**Layout:**
```
desktop: flex-col, max-w-[720px], mx-auto
mobile: flex-col, px-4
```

**API calls:**
- `GET /api/activity?page=1&filter=all` — paginated, filter = all|earnings|payments|payouts|system

**Loading state:** 5 skeleton ActivityItem rows

**Empty state:** "All your transactions and earnings will show up in this feed."

## 5.7 LearnPage

**Компоненты:** PageHeader, Search Input, FeaturedArticles (3 cards), FaqSection (Accordion), HowItWorksDiagram, ContactSection

**API calls:**
- `GET /api/learn/articles`

## 5.8 OnboardingFlow

**Компоненты:** OnboardingCarousel (3 slides), CTA buttons ("Let's start" → /earn, "Skip" → /home)

**Trigger:** Показывается один раз после регистрации. Tracked в localStorage + user settings.

## 5.9 SettingsPage

**Компоненты:** ProfileSection, SettingsList (SettingsItem × N), AppearanceSelect, DangerZone

**API calls:**
- `GET /api/user/settings`
- `PUT /api/user/settings` — при изменении

---

# СЕКЦИЯ 6: API-контракты

```typescript
// src/types/api.ts

/* ═══════════════════════════════════════════════════════════════════════
   COMMON TYPES
   ═══════════════════════════════════════════════════════════════════════ */

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

/* ═══════════════════════════════════════════════════════════════════════
   GET /api/dashboard
   Used by: HomePage
   ═══════════════════════════════════════════════════════════════════════ */

export interface DashboardResponse {
  user: {
    firstName: string;
    email: string;
    joinedAt: string;                  // ISO date
    tier: "standard" | "premium";
    avatarUrl: string | null;
  };
  earnings: {
    totalEarned: number;               // USD value
    totalEarnedPaxg: number;           // PAXG amount
    todayEarning: number;              // USD
    dailyRate: number;                 // USD per day
    totalEarnedChange: number;         // percentage change (e.g. +2.3)
  };
  nextPayout: {
    date: string;                      // ISO date
    daysRemaining: number;
    progressPercent: number;           // 0-100
    estimatedAmount: number;           // USD
  };
  portfolio: {
    totalInvested: number;             // USD
    activePositions: number;
    availableBalance: number;          // USD (unlocked AYNI)
    goldRewards: number;               // USD value of unclaimed PAXG
    goldRewardsPaxg: number;           // PAXG amount
  };
  chartData: Array<{
    date: string;                      // ISO date
    earnedCumulative: number;          // cumulative USD
    earnedDaily: number;               // daily USD
    goldGrams?: number;                // daily grams (for advanced view)
  }>;
  dailyRewards: Array<{
    date: string;
    netRewardUsd: number;
    netRewardPaxg: number;
    status: "credited" | "pending" | "processing";
    // Advanced view fields
    goldProducedGrams?: number;
    extractionCostUsd?: number;
    platformFeeUsd?: number;
  }>;
  notifications: {
    unreadCount: number;
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   GET /api/earn/projection?amount=X&months=Y
   Used by: EarnPage (calculator)
   ═══════════════════════════════════════════════════════════════════════ */

export interface EarnProjectionRequest {
  amount: number;                      // USD
  months: number;                      // 6-48
}

export interface EarnProjectionResponse {
  estimatedEarnings: number;           // USD total for term
  annualReturnPercent: number;         // e.g. 17.5
  monthlyEarning: number;             // USD per month
  dailyEarning: number;               // USD per day
  firstPayoutDate: string;            // ISO date
  totalPayouts: number;               // number of quarterly payouts
  ayniTokenAmount: number;            // how many AYNI tokens
  ayniPriceUsed: number;              // AYNI price at calculation time
  goldPriceUsed: number;              // Gold spot price used
  disclaimer: string;
}

/* ═══════════════════════════════════════════════════════════════════════
   POST /api/earn/invest
   Used by: CheckoutPage
   ═══════════════════════════════════════════════════════════════════════ */

export interface InvestRequest {
  amountUsd: number;
  termMonths: number;
  autoStake: boolean;
  paymentMethod: "card" | "apple_pay" | "google_pay" | "sepa" | "binance_pay" | "crypto";
  currency: string;                    // "USD" | "EUR" | "USDT" | "USDC" | "ETH"
}

export interface InvestResponse {
  positionId: string;
  status: "pending" | "confirmed";
  paymentUrl?: string;                 // Redirect URL for external payment
  paymentDetails?: {
    amount: number;
    currency: string;
    reference: string;
    processingFee: number;
    totalCharged: number;
    exchangeRate?: number;             // For non-USD currencies
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   GET /api/portfolio
   Used by: PortfolioPage
   ═══════════════════════════════════════════════════════════════════════ */

export interface PortfolioResponse {
  overview: {
    portfolioValue: number;            // USD total invested
    availableBalance: number;          // USD (unlocked)
    totalEarned: number;               // USD all-time
    goldRewardsUsd: number;
    goldRewardsPaxg: number;
    activePositions: number;
    completedPositions: number;
  };
  positions: PositionData[];
}

export interface PositionData {
  id: string;
  positionNumber: number;
  status: "active" | "completed" | "cancelled" | "pending";
  termMonths: number;
  startDate: string;
  endDate: string;
  investedAmountUsd: number;
  investedAmountAyni: number;
  earnedUsd: number;
  earnedPaxg: number;
  claimedUsd: number;
  claimedPaxg: number;
  progressPercent: number;
  monthsRemaining: number;
  nextPayoutDate: string | null;
  nextPayoutEstimate: number;
  dailyEarningRate: number;
  // Advanced view
  walletAddress?: string;
  contractAddress?: string;
  transactionHash?: string;
  onChainUrl?: string;
}

/* ═══════════════════════════════════════════════════════════════════════
   GET /api/portfolio/:id
   Used by: PositionDetailPage
   ═══════════════════════════════════════════════════════════════════════ */

export interface PositionDetailResponse extends PositionData {
  chartData: Array<{
    date: string;
    earned: number;
  }>;
  payoutHistory: Array<{
    date: string;
    amountUsd: number;
    amountPaxg: number;
    status: "paid" | "pending" | "scheduled";
    transactionHash?: string;
  }>;
  dailyBreakdown: Array<{
    date: string;
    rewardUsd: number;
    rewardPaxg: number;
    goldGrams?: number;
    costs?: number;
    fee?: number;
  }>;
}

/* ═══════════════════════════════════════════════════════════════════════
   POST /api/portfolio/:id/cancel
   Used by: PortfolioPage (cancel modal)
   ═══════════════════════════════════════════════════════════════════════ */

export interface CancelPositionRequest {
  positionId: string;
  reason?: string;
}

export interface CancelPositionResponse {
  status: "cancelled";
  refundAmount: number;
  refundCurrency: string;
  penaltyPercent: number;
  estimatedRefundDate: string;
}

/* ═══════════════════════════════════════════════════════════════════════
   POST /api/portfolio/reinvest
   Used by: PortfolioPage (reinvest modal)
   ═══════════════════════════════════════════════════════════════════════ */

export interface ReinvestRequest {
  amountPaxg: number;
  termMonths: number;
}

export interface ReinvestResponse {
  newPositionId: string;
  paxgConverted: number;
  ayniReceived: number;
  exchangeRate: number;
  status: "confirmed" | "pending";
}

/* ═══════════════════════════════════════════════════════════════════════
   GET /api/activity?page=1&pageSize=20&filter=all
   Used by: ActivityPage
   ═══════════════════════════════════════════════════════════════════════ */

export type ActivityFilter = "all" | "earnings" | "payments" | "payouts" | "system";

export interface ActivityItemData {
  id: string;
  type: "reward" | "investment" | "payout" | "withdrawal" | "system";
  title: string;
  description?: string;
  timestamp: string;
  amount?: {
    value: number;
    currency: string;
    direction: "in" | "out";
  };
  details?: string;                    // "80 USDT → 309.97 AYNI"
  relatedPositionId?: string;
  transactionHash?: string;
  onChainUrl?: string;
}

export type ActivityResponse = PaginatedResponse<ActivityItemData>;

/* ═══════════════════════════════════════════════════════════════════════
   GET /api/learn/articles
   Used by: LearnPage
   ═══════════════════════════════════════════════════════════════════════ */

export interface LearnArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "getting-started" | "security" | "earning" | "faq" | "advanced";
  type: "article" | "video" | "guide";
  thumbnailUrl?: string;
  durationMinutes?: number;
  content?: string;                    // Markdown/HTML content
  publishedAt: string;
}

export interface LearnResponse {
  featured: LearnArticle[];
  faq: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    articles: LearnArticle[];
  }>;
}

/* ═══════════════════════════════════════════════════════════════════════
   GET /api/user/settings
   PUT /api/user/settings
   Used by: SettingsPage
   ═══════════════════════════════════════════════════════════════════════ */

export interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    phone?: string;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;                  // "en", "es", "ru"
    advancedView: boolean;
    currency: string;                  // "USD", "EUR"
  };
  notifications: {
    emailRewards: boolean;
    emailPayouts: boolean;
    emailMarketing: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
  };
  security: {
    hasPassword: boolean;
    twoFactorEnabled: boolean;
    kycStatus: "none" | "pending" | "verified" | "rejected";
    kycLevel: number;
    lastLoginAt: string;
    activeSessions: number;
  };
}

export interface UpdateSettingsRequest {
  profile?: Partial<UserSettings["profile"]>;
  preferences?: Partial<UserSettings["preferences"]>;
  notifications?: Partial<UserSettings["notifications"]>;
}

/* ═══════════════════════════════════════════════════════════════════════
   GET /api/user/wallets
   Used by: Settings → Connected wallets
   ═══════════════════════════════════════════════════════════════════════ */

export interface WalletData {
  id: string;
  address: string;
  chain: "ethereum" | "bsc" | "polygon";
  label: string;
  isPrimary: boolean;
  connectedAt: string;
}

export interface WalletsResponse {
  wallets: WalletData[];
  internalWallet: {
    address: string;
    ayniBalance: number;
    paxgBalance: number;
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   POST /api/auth/login
   POST /api/auth/register
   Used by: LoginPage, RegisterPage
   ═══════════════════════════════════════════════════════════════════════ */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  referralCode?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;                   // seconds
  user: {
    id: string;
    email: string;
    firstName: string;
    isNewUser: boolean;                // Show onboarding
    tier: "standard" | "premium";
  };
}

/* ═══════════════════════════════════════════════════════════════════════
   GET /api/mine
   Used by: My Mine page, Home (preview card)
   ═══════════════════════════════════════════════════════════════════════ */

export type MineLevel = 1 | 2 | 3 | 4 | 5;

export interface MineStats {
  currentLevel: MineLevel;
  levelName: string;
  totalStaked: number;
  nextLevelThreshold: number | null;
  amountToNextLevel: number | null;
  progressToNextLevel: number;
  nextLevelName: string | null;
  dailyProduction: { goldGrams: number; usdValue: number };
  weeklyProduction: { goldGrams: number; usdValue: number };
  totalProduction: { goldGrams: number; usdValue: number };
  streak: { currentDays: number; longestDays: number; lastVisit: string };
  mineDetails: {
    workers: number;
    equipment: string;
    efficiency: number;
    outputPerDay: string;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string | null;
    category: 'production' | 'streak' | 'investment' | 'milestone';
  }>;
}

/* ═══════════════════════════════════════════════════════════════════════
   GET /api/prices
   Used by: Advanced view, Portfolio advanced
   ═══════════════════════════════════════════════════════════════════════ */

export interface PricesResponse {
  ayni: {
    priceUsd: number;
    change24h: number;
    change7d: number;
    marketCap: number;
    volume24h: number;
  };
  paxg: {
    priceUsd: number;
    change24h: number;
  };
  gold: {
    spotPriceUsd: number;              // per troy ounce
    change24h: number;
  };
  lastUpdated: string;                 // ISO date
}
```

---

# СЕКЦИЯ 7: State Management

## 7.1 Архитектура: Server State vs Client State

- **Server State** (React Query / TanStack Query): dashboard, portfolio, activity, learn, prices — всё что приходит от API. Кэшируется, рефетчится, инвалидируется.
- **Client State** (Zustand): auth tokens, UI preferences (theme, modals, hints), earn calculator inputs.

## 7.2 Store Shapes

```typescript
// src/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    tier: "standard" | "premium";
    isNewUser: boolean;
  } | null;

  // Actions
  setAuth: (tokens: { accessToken: string; refreshToken: string }, user: AuthState["user"]) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setAuth: (tokens, user) =>
        set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user }),

      logout: () => set({ accessToken: null, refreshToken: null, user: null }),

      isAuthenticated: () => get().accessToken !== null,
    }),
    { name: "ayni-auth" }
  )
);
```

```typescript
// src/stores/uiStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeMode } from "@/types/theme";

interface UIState {
  theme: ThemeMode;
  advancedView: boolean;
  dismissedHints: string[];           // IDs of dismissed contextual hints
  stickyCtaVisible: boolean;          // Mobile earn sticky CTA

  // Actions
  setTheme: (theme: ThemeMode) => void;
  toggleAdvancedView: () => void;
  dismissHint: (hintId: string) => void;
  isHintDismissed: (hintId: string) => boolean;
  setStickyCtaVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "system",
      advancedView: false,
      dismissedHints: [],
      stickyCtaVisible: false,

      setTheme: (theme) => set({ theme }),
      toggleAdvancedView: () => set((s) => ({ advancedView: !s.advancedView })),
      dismissHint: (hintId) =>
        set((s) => ({ dismissedHints: [...s.dismissedHints, hintId] })),
      isHintDismissed: (hintId) => get().dismissedHints.includes(hintId),
      setStickyCtaVisible: (visible) => set({ stickyCtaVisible: visible }),
    }),
    { name: "ayni-ui", partialize: (s) => ({ theme: s.theme, advancedView: s.advancedView, dismissedHints: s.dismissedHints }) }
  )
);
```

```typescript
// src/stores/earnStore.ts
import { create } from "zustand";

interface EarnState {
  amount: number;
  termMonths: number;
  autoStake: boolean;
  selectedPaymentMethod: "card" | "apple_pay" | "google_pay" | "sepa" | "binance_pay" | "crypto" | null;
  selectedCurrency: string;

  // Actions
  setAmount: (amount: number) => void;
  setTermMonths: (months: number) => void;
  setAutoStake: (autoStake: boolean) => void;
  setPaymentMethod: (method: EarnState["selectedPaymentMethod"]) => void;
  setCurrency: (currency: string) => void;
  reset: () => void;
}

export const useEarnStore = create<EarnState>()((set) => ({
  amount: 500,
  termMonths: 12,
  autoStake: true,
  selectedPaymentMethod: null,
  selectedCurrency: "USD",

  setAmount: (amount) => set({ amount }),
  setTermMonths: (months) => set({ termMonths: months }),
  setAutoStake: (autoStake) => set({ autoStake }),
  setPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
  setCurrency: (currency) => set({ selectedCurrency: currency }),
  reset: () =>
    set({
      amount: 500,
      termMonths: 12,
      autoStake: true,
      selectedPaymentMethod: null,
      selectedCurrency: "USD",
    }),
}));
```

## 7.3 React Query Key Factory

```typescript
// src/lib/queryKeys.ts

export const queryKeys = {
  dashboard: {
    all: ["dashboard"] as const,
    data: () => [...queryKeys.dashboard.all, "data"] as const,
  },
  earn: {
    all: ["earn"] as const,
    projection: (amount: number, months: number) =>
      [...queryKeys.earn.all, "projection", amount, months] as const,
  },
  portfolio: {
    all: ["portfolio"] as const,
    overview: () => [...queryKeys.portfolio.all, "overview"] as const,
    position: (id: string) => [...queryKeys.portfolio.all, "position", id] as const,
  },
  activity: {
    all: ["activity"] as const,
    list: (filter: string, page: number) =>
      [...queryKeys.activity.all, "list", filter, page] as const,
  },
  learn: {
    all: ["learn"] as const,
    articles: () => [...queryKeys.learn.all, "articles"] as const,
    article: (slug: string) => [...queryKeys.learn.all, "article", slug] as const,
  },
  user: {
    all: ["user"] as const,
    settings: () => [...queryKeys.user.all, "settings"] as const,
    wallets: () => [...queryKeys.user.all, "wallets"] as const,
  },
  prices: {
    all: ["prices"] as const,
  },
} as const;
```

## 7.4 Optimistic Updates

Optimistic updates нужны для:
- **Dismiss hint** — мгновенно скрыть (Zustand, sync)
- **Theme toggle** — мгновенно переключить (Zustand, sync)
- **Cancel position** — показать "Cancelling..." badge мгновенно, откатить при ошибке API
- **Reinvest** — показать "Processing..." мгновенно
- **Update settings** — мгновенно отобразить новое значение, откатить при ошибке

---

# СЕКЦИЯ 8: Routing

```typescript
// src/App.tsx — Router configuration

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

const router = createBrowserRouter([
  // ── Public routes (no auth) ────────────────────────────
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },

  // ── Protected routes (auth required) ───────────────────
  {
    path: "/",
    element: <AuthGuard><RootLayout /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <HomePage /> },
      { path: "earn", element: <EarnPage /> },
      { path: "earn/checkout", element: <CheckoutPage /> },
      { path: "portfolio", element: <PortfolioPage /> },
      { path: "portfolio/:id", element: <PositionDetailPage /> },
      { path: "activity", element: <ActivityPage /> },
      { path: "learn", element: <LearnPage /> },
      { path: "learn/:slug", element: <ArticlePage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "settings/security", element: <SettingsPage /> },
      { path: "settings/wallets", element: <SettingsPage /> },
      { path: "onboarding", element: <OnboardingPage /> },
    ],
  },

  // ── Catch-all ──────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);

// AuthGuard component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const isNewUser = useAuthStore((s) => s.user?.isNewUser);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // Redirect new users to onboarding (one-time)
  // Tracked via localStorage + user.isNewUser
  return <>{children}</>;
}
```

**Guards:**
- `AuthGuard` — проверяет `accessToken` в Zustand. Если нет → `/login`
- `KYCGuard` (будущее) — для операций >$X, проверяет `kycStatus === "verified"`

**Layouts:**
- `AuthLayout` — логин/регистрация, без навигации, с фоновой иллюстрацией
- `RootLayout` — NavBar (desktop) + MobileTabBar (mobile) + PageLayout (content area)

**Redirects:**
- `/` → `/home`
- После логина → `/home` (или `/onboarding` если `isNewUser`)
- После регистрации → `/onboarding`
- После onboarding → `/earn`

---

# СЕКЦИЯ 9: Анимации и переходы

## 9.1 Библиотечная стратегия

| Тип анимации | Инструмент | Обоснование |
|-------------|------------|-------------|
| Page transitions | Framer Motion `AnimatePresence` | Декларативные exit/enter анимации |
| Number count-up | Custom hook `useCountUp` | Легковесный, не нужна внешняя библиотека |
| Card appear on scroll | Framer Motion `useInView` + `motion.div` | Stagger анимации |
| Button press | CSS `:active` | Простой scale, не нужна библиотека |
| Progress ring draw | CSS `stroke-dashoffset` + CSS animation | SVG native, лёгкий |
| Chart line draw | Recharts built-in `isAnimationActive` | Встроенная анимация |
| Skeleton shimmer | CSS gradient animation | Чистый CSS |
| Modal/sheet enter | Framer Motion | AnimatePresence для mount/unmount |
| Tooltip appear | CSS transition | Простой fade+translate |

## 9.2 Count-Up Number Hook

```typescript
// src/hooks/useCountUp.ts
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface UseCountUpOptions {
  duration?: number;       // ms, default 1200
  decimals?: number;       // default 2
  startOnMount?: boolean;  // default true
}

export function useCountUp(
  target: number,
  options: UseCountUpOptions = {}
) {
  const { duration = 1200, decimals = 2, startOnMount = true } = options;
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(startOnMount && !prefersReducedMotion ? 0 : target);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const previousTargetRef = useRef(target);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(target);
      return;
    }

    const startValue = previousTargetRef.current !== target
      ? previousTargetRef.current
      : 0;
    previousTargetRef.current = target;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) startTimeRef.current = currentTime;
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out decelerate curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * eased;

      setDisplayValue(Number(current.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, decimals, prefersReducedMotion]);

  return displayValue;
}
```

## 9.3 Page Transitions

```typescript
// В RootLayout.tsx — обёртка для page content
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
```

## 9.4 Skeleton Shimmer (CSS)

```css
/* В globals.css */
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    var(--color-bg-secondary) 25%,
    var(--color-border-light) 50%,
    var(--color-bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s linear infinite;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  from { background-position: -200% 0; }
  to { background-position: 200% 0; }
}
```

## 9.5 Progress Ring Draw

```typescript
// Внутри ProgressRing.tsx
// SVG circle с анимированным stroke-dashoffset

const circumference = 2 * Math.PI * radius;
const offset = circumference - (progress / 100) * circumference;

<svg>
  {/* Track */}
  <circle cx={center} cy={center} r={radius}
    stroke="var(--color-border-light)" strokeWidth={strokeWidth}
    fill="none" />
  {/* Fill — animated */}
  <circle cx={center} cy={center} r={radius}
    stroke="url(#goldGradient)" strokeWidth={strokeWidth}
    fill="none" strokeLinecap="round"
    strokeDasharray={circumference}
    strokeDashoffset={offset}
    style={{
      transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 1.5s ease-out',
      transform: 'rotate(-90deg)',
      transformOrigin: 'center',
    }} />
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#C9A84C" />
      <stop offset="50%" stopColor="#E8D48B" />
      <stop offset="100%" stopColor="#C9A84C" />
    </linearGradient>
  </defs>
</svg>
```

## 9.6 prefers-reduced-motion

```typescript
// src/hooks/useReducedMotion.ts
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}
```

При `prefersReducedMotion === true`:
- Count-up → мгновенно показывает target
- Page transitions → мгновенный switch (duration: 0)
- Card appear → мгновенно видимые
- Progress ring → без draw анимации
- Skeleton → статичный цвет без shimmer

---

# СЕКЦИЯ 10: Responsive Strategy

## 10.1 Breakpoints

| Breakpoint | Значение | Описание |
|-----------|---------|----------|
| `sm` | 375px | Минимальный mobile |
| `md` | 768px | Tablet / большие телефоны |
| `lg` | 1024px | Desktop начало |
| `xl` | 1280px | Большой desktop |
| `2xl` | 1440px | Full width |

## 10.2 Изменения по экранам

| Компонент | < 768px (Mobile) | 768-1024px (Tablet) | > 1024px (Desktop) |
|----------|------------------|--------------------|--------------------|
| Navigation | Bottom tab bar (64px) | Bottom tab bar | Top nav bar (64px) |
| Hero number | 40px (display-hero-mobile) | 48px | 56px (display-hero) |
| Quick stats | Horizontal scroll, snap, min-w 140px | 3 columns | 3 columns |
| Stat cards padding | 16px | 20px | 24px |
| Charts height | 160px | 180px | 200px |
| Tables | Card view или 2-3 columns | Compact (12px padding) | Full (16px padding, 5+ columns) |
| Modals | Bottom sheet (full-width, radius top only) | Center modal 480px | Center modal 480px |
| Content padding | 16px sides | 24px sides | 48px sides |
| Section spacing | 24px | 28px | 32px |
| Page max-width | 100% | 100% | 1200px centered |
| CTA buttons | Fixed bottom bar (key pages) | Inline | Inline |
| Portfolio overview | Stack vertical | 2 columns | 2 columns (70/30) |
| Earn calculator | Full-width | max-w-[720px] center | max-w-[720px] center |
| How It Works cards | Vertical stack gap-16 | 3 columns | 3 columns gap-20 |

## 10.3 Bottom Tab Bar

- **Показывать:** на `< 1024px`
- **Скрывать:** на `>= 1024px`
- **Items:** Home, Earn, Portfolio, Activity, More
- **Style:** fixed bottom, height 64px, backdrop-blur, z-50
- **Active state:** icon + label color = `--color-primary`, остальные `--color-text-muted`

## 10.4 Touch Targets

- Все кнопки: `min-height: 44px`
- Tab bar items: `min-height: 48px`, tap area `48x48px`
- Table rows (mobile): `min-height: 48px`
- Icon buttons: `min-size: 44x44px` (padding вокруг иконки)

## 10.5 Horizontal Scroll

- Quick Stats (Home): `overflow-x: auto`, `scroll-snap-type: x mandatory`, `scroll-snap-align: start` на каждой карточке, `gap: 12px`, `padding-right: 16px` (чтобы было видно что есть ещё)
- Hide scrollbar: `-webkit-overflow-scrolling: touch`, `scrollbar-width: none`

---

# СЕКЦИЯ 11: Dark Mode

## 11.1 Механизм

```typescript
// src/hooks/useTheme.ts
import { useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";

export function useTheme() {
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const isDark =
        theme === "dark" || (theme === "system" && systemDark.matches);
      root.setAttribute("data-theme", isDark ? "dark" : "light");
    };

    apply();
    systemDark.addEventListener("change", apply);
    return () => systemDark.removeEventListener("change", apply);
  }, [theme]);

  return { theme, setTheme };
}
```

## 11.2 Что меняется beyond цвет

- **Glassmorphism:** В dark mode навбар и hero-карточка получают `backdrop-filter: blur(20px)` + `border: 1px solid rgba(255,255,255,0.08)`. В light mode — solid backgrounds.
- **Glass Card:** В dark mode появляется `bg: rgba(255,255,255,0.05)` + blur. Не существует в light mode.
- **Gold gradient:** В dark mode `--color-gold` чуть ярче (`#D4B55A`) для контраста.
- **Shadows:** В dark mode тени глубже (больше opacity) так как фон тёмный.
- **Noise texture:** В dark mode opacity noise увеличивается до 4-5% (с 2-3% в light).

## 11.3 Persistence

Theme preference сохраняется в Zustand persist (localStorage key `ayni-ui`). При загрузке приложения:
1. Читаем из localStorage
2. Если "system" → слушаем `prefers-color-scheme`
3. Применяем `data-theme` атрибут до рендера (в `index.html` скрипт) чтобы избежать flash

```html
<!-- В index.html, перед React mount -->
<script>
  (function() {
    try {
      var stored = JSON.parse(localStorage.getItem('ayni-ui') || '{}');
      var theme = stored.state?.theme || 'system';
      var isDark = theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } catch(e) {}
  })();
</script>
```

---

# СЕКЦИЯ 12: Accessibility

## 12.1 Конкретная реализация

**ARIA-labels для иконок:**
```tsx
// Все декоративные иконки
<TrendingUp aria-hidden="true" />

// Все интерактивные иконки
<button aria-label="Notifications, 3 unread">
  <Bell aria-hidden="true" />
  <span className="sr-only">3 unread notifications</span>
</button>
```

**Графики (Recharts):**
```tsx
<div role="img" aria-label="Earnings chart showing $8.63 earned over the last 7 days with a positive trend">
  <AreaChart ... />
</div>
```

**Focus management в modals:**
```tsx
// Radix Dialog автоматически:
// 1. Trap focus внутри modal
// 2. Return focus на trigger при закрытии
// 3. Escape закрывает

<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content aria-describedby="modal-desc">
      <Dialog.Title>{title}</Dialog.Title>
      <p id="modal-desc">{description}</p>
      {children}
      <Dialog.Close asChild>
        <button aria-label="Close">✕</button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

**Keyboard navigation:**
- Tab order: логичный, следует визуальному порядку
- Skip-to-content link: первый focusable элемент → `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>`
- Escape: закрывает modals, dropdowns, tooltips
- Enter/Space: активирует кнопки, ссылки, toggles
- Arrow keys: навигация в tabs, slider, dropdown options

**Screen reader для count-up:**
```tsx
// Не анонсируем промежуточные значения, только финальное
<span aria-live="polite" aria-atomic="true">
  Total earned: ${formatCurrency(finalValue)}
</span>
// Визуальный count-up в отдельном элементе aria-hidden
<span aria-hidden="true">${formatCurrency(animatedValue)}</span>
```

**Live regions для обновления данных:**
```tsx
// Для dashboard данных которые обновляются
<div aria-live="polite" aria-atomic="true" className="sr-only">
  Your daily earning: ${dailyRate} per day. Next payout in {days} days.
</div>
```

**Color not sole indicator:**
- Badges: цвет + текст + иконка (✓ Credited, ⏳ Pending)
- Charts: Tooltip с конкретными числами (не только цвет линии)
- Trend indicators: ↑/↓ стрелка + текст + цвет

---

# СЕКЦИЯ 13: Порядок реализации (Implementation Phases)

## Фаза 1: Foundation (Неделя 1-2)

**Что делаем:**
- Инициализация проекта (Vite + React + TypeScript)
- Design tokens (tokens.css, tailwind.config.ts, fonts)
- Файловая структура
- UI Kit: Button, Card, Input, Badge, Tooltip, Modal, BottomSheet, Tabs, Toggle, Checkbox, Avatar, SkeletonLoader, EmptyState
- Layout: NavBar, MobileTabBar, PageLayout, PageHeader
- Routing скелет (все маршруты с placeholder страницами)
- Mock API с MSW (dashboard, portfolio основные данные)
- Theme provider (dark mode toggle)

**От бэкенда:** Ничего. Всё на mock data.

**Definition of Done:**
- Все UI компоненты рендерятся в Storybook / dev page
- Роутинг работает между всеми страницами
- Dark mode переключается
- Mobile tab bar видна на < 1024px
- Все компоненты type-safe (no `any`)

## Фаза 2: Auth + Onboarding (Неделя 2-3)

**Что делаем:**
- LoginPage, RegisterPage (email/password + social buttons placeholder)
- AuthGuard компонент
- Auth store (Zustand persist)
- OnboardingCarousel (3 slides)
- ContextualHint компонент

**От бэкенда:** POST /api/auth/login, POST /api/auth/register (или mock)

**Definition of Done:**
- Можно зарегистрироваться и залогиниться (mock)
- Новые пользователи видят onboarding
- Защищённые маршруты редиректят на /login

## Фаза 3: Home / Dashboard (Неделя 3-4)

**Что делаем:**
- GreetingSection (time-based greeting)
- HeroEarningsCard с CountUpNumber + ProgressRing + GoldAccentLine
- QuickStatsRow (3 StatCards, horizontal scroll mobile)
- EarningsChart (Recharts AreaChart + period tabs)
- DailyBreakdown (Table + Advanced view toggle)
- CtaBanner
- EmptyHomeState (для 0 investments)
- Все loading/error/empty states

**От бэкенда:** GET /api/dashboard (или детальный mock)

**Definition of Done:**
- Home показывает все секции с mock данными
- Count-up анимируется при загрузке
- Progress ring draw-in работает
- Chart переключается между периодами
- Advanced view toggle показывает/скрывает колонки
- Mobile: horizontal scroll stats, stacked layout
- Empty state для нового юзера

## Фаза 4: Earn (Неделя 4-5)

**Что делаем:**
- AmountInput с quick amount buttons
- Slider (term 6-48 месяцев, snap points)
- ProjectionCard (animated на изменение inputs)
- AutoStakeCheckbox
- HowItWorks (3 TimelineStep cards)
- TrustBadges
- EarnStore (Zustand)

**От бэкенда:** GET /api/earn/projection

**Definition of Done:**
- Калькулятор интерактивный: изменение amount/term пересчитывает проекцию
- Slider снэпается на 6, 12, 24, 36, 48
- Проекция анимируется при пересчёте
- Auto-stake по умолчанию ON
- "Invest and start earning" кнопка ведёт на /earn/checkout

## Фаза 5: Checkout (Неделя 5-6)

**Что делаем:**
- OrderSummary (из earnStore)
- PaymentMethodTabs (Card / Crypto)
- CardPaymentForm (Apple Pay, Google Pay, Card/SEPA — placeholder интеграции)
- CryptoPaymentForm (Binance Pay, USDT/USDC — placeholder)
- OtcBanner (>$5k link)
- Processing states

**От бэкенда:** POST /api/earn/invest

**Definition of Done:**
- Order summary показывает корректные данные из калькулятора
- Payment method selection работает
- Fee breakdown показан (processing fee)
- Currency conversion отображается для EUR
- Submit → success / error state

## Фаза 6: Portfolio (Неделя 6-7)

**Что делаем:**
- PortfolioOverview (balance cards)
- GoldRewardsCard (withdraw / reinvest buttons)
- PositionList (Active/Completed tabs)
- PositionCard (expandable, with ProgressBar)
- PositionDetailPage (chart + daily breakdown + payouts)
- CancelPositionModal
- ReinvestModal
- AdvancedToggle (wallet addresses, on-chain links)

**От бэкенда:** GET /api/portfolio, GET /api/portfolio/:id, POST cancel, POST reinvest

**Definition of Done:**
- Все позиции отображаются с progress bars
- Expand/collapse работает
- Cancel → confirmation modal → API call
- Reinvest → modal → API call
- Advanced view показывает wallet/contract data
- Empty state для 0 позиций

## Фаза 7: Activity (Неделя 7)

**Что делаем:**
- ActivityFilters (pill tabs)
- ActivityFeed (grouped by date: Today, Yesterday, Last week, Earlier)
- ActivityItem (icon + title + amount + details)
- Pagination (Load more button)
- Pull-to-refresh (mobile)

**От бэкенда:** GET /api/activity (paginated)

**Definition of Done:**
- Feed показывает сгруппированные по дате события
- Фильтры работают
- Load more подгружает следующую страницу
- Каждый item кликабельный (expanded details)

## Фаза 8: Learn (Неделя 7-8)

**Что делаем:**
- Search input
- FeaturedArticles (3 tutorial cards)
- FaqSection (Accordion)
- HowItWorksDiagram (interactive flow)
- ContactSection
- ArticlePage (single article view)

**От бэкенда:** GET /api/learn/articles

## Фаза 9: Settings (Неделя 8)

**Что делаем:**
- ProfileSection (avatar + name + email)
- SettingsList (all items from spec)
- AppearanceSelect (Light/Dark/System)
- DangerZone (sign out, delete)

**От бэкенда:** GET/PUT /api/user/settings

## Фаза 10: Dark Mode Polish (Неделя 8-9)

**Что делаем:**
- Glassmorphism в dark mode (навбар, hero card)
- Glass Card компонент
- Тонкая настройка теней
- Gold gradient яркость в dark
- Noise texture opacity
- Тестирование всех экранов в обоих режимах

## Фаза 11: Animations Polish (Неделя 9)

**Что делаем:**
- Page transitions (Framer Motion AnimatePresence)
- Card appear on scroll (stagger 100ms)
- Success pulse при claim reward
- Chart line draw animation
- Bottom sheet drag-to-dismiss
- Button press microinteraction
- prefers-reduced-motion: полное отключение

## Фаза 12: HNW / Premium Features (Неделя 10+)

**Что делаем:**
- Premium badge в навбаре
- Premium card dark gradient
- Personal Manager sticky card (desktop) / banner (mobile)
- OTC purchase flow (simplified for >$5k)
- Advanced Analytics tab в Portfolio
- Tax reporting (CSV download)

**От бэкенда:** Premium detection, OTC API, reports API

## Фаза 13: My Mine / Gamification (Будущее)

- Визуализация шахты по уровням
- Achievement badges
- Level progression

---

# СЕКЦИЯ 14: Инструкции для Claude Code

## ФАЗА 1: Foundation

```
Создай React + Vite + TypeScript проект для AYNI Gold — личного кабинета 
инвестиционной платформы (gold-backed staking).

### Шаг 1: Инициализация
- Создай проект: `npm create vite@latest ayni-cabinet -- --template react-ts`
- Установи зависимости:
  npm install react-router-dom@6 zustand@4 @tanstack/react-query@5 
  framer-motion@11 recharts@2 lucide-react @radix-ui/react-dialog 
  @radix-ui/react-tooltip @radix-ui/react-tabs @radix-ui/react-accordion 
  @radix-ui/react-toggle @radix-ui/react-dropdown-menu 
  @radix-ui/react-checkbox @radix-ui/react-switch
  react-hook-form@7 zod @hookform/resolvers ky date-fns clsx tailwind-merge
  
  npm install -D tailwindcss@3 postcss autoprefixer @types/react @types/react-dom
  eslint@9 prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
  eslint-plugin-react-hooks msw@2

### Шаг 2: Конфигурация
- Настрой tailwind.config.ts с ПОЛНОЙ конфигурацией из Секции 2.2 этого документа
- Создай src/styles/tokens.css с ПОЛНЫМИ CSS variables из Секции 2.1
- Создай src/styles/globals.css:
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  (+ импорт tokens.css и fonts.css)
- Создай src/styles/fonts.css с @font-face для:
  DM Serif Display (Regular, woff2)
  Inter (Regular 400, Medium 500, SemiBold 600, woff2)
  JetBrains Mono (Regular, woff2)
  Скачай шрифты и положи в src/assets/fonts/
- Настрой tsconfig.json с path aliases (@/ → ./src/)
- Настрой vite.config.ts с resolve.alias

### Шаг 3: Файловая структура
Создай полную структуру папок из Секции 3 этого документа (пустые файлы с barrel exports).

### Шаг 4: Утилиты
- src/lib/cn.ts — экспортирует функцию cn(…classes) через clsx + tailwind-merge
- src/lib/formatCurrency.ts — formatCurrency(amount: number): string → "$1,234.56"
- src/lib/formatDate.ts — formatDate, formatRelativeDate, getGreeting
- src/lib/formatNumber.ts — formatPercent, formatGrams
- src/lib/constants.ts — MIN_INVESTMENT = 100, MAX_INVESTMENT = 1000000,
  MIN_TERM_MONTHS = 6, MAX_TERM_MONTHS = 48, SNAP_POINTS = [6, 12, 24, 36, 48]

### Шаг 5: UI Компоненты
Реализуй каждый из следующих компонентов. Для КАЖДОГО:
- TypeScript interface из Секции 4 этого документа
- Стили через Tailwind + CSS variables (из tokens.css)
- Dark mode через [data-theme="dark"] (автоматически через CSS variables)
- Responsive варианты (mobile/desktop)
- WCAG 2.1 AA (focus-visible, aria-label где нужно, min touch 44px)
- НЕ используй styled-components. Только Tailwind utilities + cn() для conditional classes.

Компоненты к реализации:

1. Button — 5 вариантов (primary, secondary, ghost, danger, gold-cta).
   Primary: bg primary, text white, shadow-sm, hover: bg primary-hover shadow-md translateY(-1px)
   Secondary: transparent, border 1.5px border, text primary. Hover: bg primary-light
   Ghost: transparent, text text-secondary. Hover: bg bg-secondary
   Danger: transparent, border 1.5px error 30% opacity, text error. Hover: bg error-light
   Gold CTA: bg primary, text white, снизу 2px gold gradient line. Hover: shadow-gold
   Все: radius-lg, padding 14px 28px, transition all 0.2s, active: scale(0.98)
   Disabled: opacity 0.4, cursor not-allowed
   Focus-visible: outline 2px primary, offset 2px
   Loading: spinner icon replacing content

2. Card — variant prop (stat, position, action, premium, glass)
   Stat: bg surface-card, border 1px border-light, radius-xl, shadow-sm, p-24.
   Hover: shadow-md
   Остальные варианты по спеке.

3. StatCard — icon + label (label-sm uppercase muted) + value (number-lg) + optional trend
   Trend up: text success, "↑" prefix. Down: text error, "↓".

4. Input — с label сверху (13px/500 text-secondary, mb 6px)
   Default: bg surface-card, border 1.5px border, radius-md, p 14px 16px, Inter 15px
   Focus: border primary, box-shadow 0 0 0 3px rgba(primary, 0.1)
   Error: border error, error message ниже (body-sm error)
   Disabled: bg bg-secondary, text muted

5. AmountInput — large centered input (display-lg 40px), "$" prefix.
   Quick amount buttons (pill style, radius-full) underneath.
   Active pill: bg primary, text white. Inactive: bg bg-secondary, text text-secondary.

6. Slider — Radix UI Slider с кастомным стилем:
   Track: bg border, h 4px, radius 2px
   Fill (Range): gold gradient
   Thumb: 24px circle, bg surface-card, border 2px gold, shadow-sm
   Snap point labels underneath (body-sm, active = text-primary font-600)

7. ProgressRing — SVG circle.
   Track: stroke border-light, width 4px.
   Fill: stroke goldGradient, animated stroke-dashoffset.
   Center: large number + sublabel.
   Размеры: 120px desktop, 96px mobile.

8. ProgressBar — div с inner div.
   Track: bg bg-secondary, h 6px, radius 3px.
   Fill: gold gradient background, animated width.
   Optional label + sublabel below.

9. Badge — status variant (active, pending, completed, claimed, locked).
   Каждый с своим bg/text цветом из спеки, radius-full, px-12 py-4, body-sm/500.

10. Table — с responsive: full table на desktop, card view на mobile.
    Header: bg bg-secondary, label-sm uppercase muted.
    Rows: border-bottom border-light, hover bg-primary.
    Cell padding: 16px 20px. Compact: 12px 16px.

11. Tooltip — Radix UI Tooltip.
    Dark background (text-primary), white text, body-sm.
    Radius-md, p 8px 12px, shadow lg, max-width 280px.
    Animation: fade + translateY(4px → 0) 0.15s.

12. Modal — Radix UI Dialog.
    Desktop: centered, max-w 480px, radius-2xl, shadow-lg, p-32.
    Backdrop: rgba(0,0,0,0.4) + blur(4px).
    Animation: fade + scale(0.95 → 1) 0.2s (Framer Motion).

13. BottomSheet — для mobile (< 768px).
    Full-width, radius 20px 20px 0 0, shadow top.
    Handle bar: 36px × 4px, bg border, radius 2px, mt-12.
    Slide-up animation 0.3s.

14. Tabs — variant: "pill" и "underline".
    Pill: radius-full, px-12 py-4, body-sm/500.
    Active pill: bg primary, text white. Inactive: bg transparent, text text-secondary.
    Underline: border-bottom 2px, active = text-primary + gold border.

15. Accordion — Radix UI Accordion.
    Items: bg surface-card, radius-lg, p-20, mb-8.
    Expand animation: height 0.3s ease.
    Chevron rotation 180deg.

16. Toggle — Radix UI Switch.
    Track: bg border (off), bg primary (on). H 24px, w 44px, radius-full.
    Thumb: white circle 20px, shadow-xs.

17. Checkbox — Radix UI Checkbox.
    Box: 20px, radius-sm, border 1.5px border.
    Checked: bg primary, checkmark white.

18. Avatar — circle image или initials.
    Sizes: sm=32px, md=36px, lg=48px, xl=64px.
    Initials: bg primary-light, text primary.
    Optional camera overlay (для edit).

19. CountUpNumber — uses useCountUp hook.
    Renders animated number with formatCurrency/formatNumber.
    aria-live для screen readers с final value.

20. SkeletonLoader — shimmer gradient.
    Variants: text (h 16px), circle, rect (custom w/h), card (full card shape).

21. EmptyState — centered: illustration + title + description + optional CTA button + social proof.
    Dot grid background pattern.

22. Dropdown — Radix UI DropdownMenu.
    Options with optional icons.

### Шаг 6: Layout
1. NavBar — sticky top, h 64px, backdrop blur, border-bottom.
   Logo + nav items (Home, Earn, Portfolio, Activity, Learn) + spacer + CTA btn + NotificationBell + Avatar.
   Active item: text-primary + 2px bottom border gold.

2. MobileTabBar — fixed bottom, h 64px, 5 items (Home, Earn, Portfolio, Activity, More).
   Icon + label (11px). Active: color primary.
   Backdrop blur, border-top.
   Visible only < 1024px.

3. PageLayout — max-w content, mx-auto, px content-padding.
   Mobile: pb 80px (tab bar offset).

4. PageHeader — heading-1 (DM Serif Display) + optional subtitle (body-lg text-secondary).

### Шаг 7: Routing
Настрой React Router из Секции 8 с:
- Все маршруты с placeholder pages (просто заголовок страницы)
- AuthGuard компонент
- RootLayout для protected routes
- AuthLayout для login/register

### Шаг 8: Stores
Создай Zustand stores из Секции 7:
- authStore (с persist)
- uiStore (с persist для theme, advancedView, dismissedHints)
- earnStore

### Шаг 9: Mock API
Настрой MSW (Mock Service Worker) для:
- GET /api/dashboard — вернуть mock DashboardResponse
- GET /api/portfolio — вернуть mock PortfolioResponse
- GET /api/activity — вернуть mock ActivityResponse (paginated)
Типы данных из Секции 6.

### Шаг 10: Theme
- useTheme hook из Секции 11
- Inline script в index.html для flash prevention
- ThemeProvider в App.tsx

Проверь что:
- npm run dev запускается без ошибок
- Все компоненты рендерятся
- Routing работает между страницами
- Dark mode toggle переключает цвета
- Mobile tab bar появляется на узком viewport
- TypeScript: zero errors в strict mode
```

## ФАЗА 2: Auth + Onboarding

```
На основе Foundation из Фазы 1, реализуй Auth + Onboarding:

### LoginPage (/login)
- Центрированная форма, max-w 400px
- AYNI логотип сверху (48px, centered)
- "Start earning from gold mining" — heading-2
- "Sign in to your account" — body-lg, text-secondary
- Social buttons: "Continue with Google", "Continue with Apple" — secondary buttons, full-width
- Divider: "── or ──"
- Email input + Password input (React Hook Form + Zod validation)
- "Continue" — primary button, full-width
- "Don't have an account? Sign up" — link text
- Terms link внизу (body-sm, muted)
- Background: subtle gold gradient right side (desktop), скрыт на mobile

### RegisterPage (/register)
- Аналогично LoginPage но:
- Заголовок "Create your free account in 30 seconds"
- Поля: email, password (с требованиями)
- После submit → mock POST /api/auth/register → store tokens → redirect to /onboarding

### OnboardingPage (/onboarding)
- Full-screen overlay
- OnboardingCarousel с 3 slides:
  Slide 1: illustration + "Invest in gold mining" + description
  Slide 2: illustration + "Earn daily rewards in gold" + description
  Slide 3: illustration + "Withdraw anytime after your term" + description
- Dot indicators + "Next" button + "Skip" link
- Last slide: "Let's start →" → navigate to /earn
- "Skip" → navigate to /home

### AuthGuard
- Проверяет authStore.isAuthenticated()
- Если false → redirect /login
- Если true + isNewUser → redirect /onboarding (one-time)

### ContextualHint
- Tooltip bubble component, positioned relative to parent
- Dismissable (X button), persisted in uiStore.dismissedHints
- Показывается при первом посещении каждого экрана
```

## ФАЗА 3: Home (Dashboard)

```
Реализуй HomePage (/home) — главный дашборд приложения.

Данные берём из GET /api/dashboard (MSW mock).

### Layout
- PageLayout wrapper (max-w content, padding)
- Vertical stack: Greeting → Hero → Stats → Chart → Table → CTA

### GreetingSection
- useGreeting hook: morning (<12), afternoon (<18), evening (>=18)
- "Good morning, {firstName}" — heading-3, text-secondary
- Если нет firstName → "Welcome back"

### HeroEarningsCard
- Card variant="stat" с p-32 (desktop) / p-24 (mobile)
- Layout desktop: flex-row, number left, ProgressRing right
- Layout mobile: flex-col, centered

- "TOTAL EARNED" — label-sm, uppercase, text-muted
- CountUpNumber: "$8.63" — font-display, text-display-hero (56px desktop / 40px mobile)
- GoldAccentLine: 40px wide, 2px height, gold color, 50% opacity, centered under number
- "since you started · Dec 18, 2025" — body-sm, text-muted
- Inline badge: "+$0.39 today · ↑ earning daily" — body-md, text-success
- ProgressRing: 120px desktop / 96px mobile, gold gradient fill, center "23" + "days to payout"
- TrustBadge under card: shield icon + "Backed by real mining" — clickable

### QuickStatsRow
- 3 StatCards в flex row, gap-16
- Mobile: horizontal scroll with snap, min-w 140px per card
- Card 1: 💰 gold icon, "Invested", "$414.68"
- Card 2: 📊 primary icon, "Daily earnings", "$1.51/day", text-success
- Card 3: ⏳ muted icon, "Next payout", "Apr 28"

### EarningsChart
- Card wrapper
- "Earnings over time" — heading-3
- Period tabs (pill): 7D, 1M, 3M, ALL — right-aligned
- Recharts AreaChart:
  - Line: gold color, 2px, monotone
  - Area: gradient gold 15% → 2% (top → bottom)
  - Grid: horizontal dashed, border-light
  - Y-axis: USD amounts, body-sm, text-muted
  - X-axis: dates, body-sm, text-muted
  - Tooltip: dark card, white text, radius-md
  - Height: 200px desktop / 160px mobile
- Toggle: "Show in USD" / "Show in gold (g)" — ghost toggle, right, body-sm

### DailyBreakdown
- Card wrapper
- "Daily earnings" heading-3 + tooltip icon + "Advanced view →" toggle link
- Table: Date | Earned | Status
- Rows: body-md, status = Badge "✓ Credited" (success)
- "View all →" link at bottom
- Advanced view (toggle ON): add columns Gold mined (g), Costs, Platform fee, Net (g)
- Mobile: simplified 2 columns or card view

### CtaBanner
- bg primary, radius-xl, p-28
- "Earn more from gold mining" — heading-2, white
- Description — body-lg, white opacity 0.8
- "Start Earning →" — button: bg white, text primary, shadow-gold
- Desktop: subtle illustration right side, opacity 0.15
- Mobile: vertical stack, no illustration

### EmptyHomeState (when 0 investments)
- Replaces HeroEarningsCard
- Illustration centered
- "Start earning from real gold mining" — heading-2
- Description — body-lg, text-secondary, max-w 420px
- Gold CTA button centered
- "1,247 people are already earning" — body-sm, text-muted

### Loading State
- SkeletonLoader для каждой секции
- Stagger 100ms between sections appearing

### Error State
- Card с error icon, "Unable to load dashboard", retry button
```

## ФАЗА 4: Earn

```
Реализуй EarnPage (/earn) — калькулятор + покупка.

### Layout
- PageHeader: "Start Earning" (heading-1, DM Serif Display)
- Subtitle: "Invest in gold mining and earn daily rewards in gold-backed PAXG"
- Calculator card max-w 720px, centered

### EarningCalculator
- Card, p-32
- "How much would you like to invest?" — heading-3

- AmountInput:
  - Large centered input, display-lg font (40px), "$" prefix
  - Default value: 500
  - Height: 64px, border 1.5px, radius-lg
  - Quick amount buttons: $100, $500 (selected), $1,000, $5,000, Custom
  - "Minimum investment: $100" helper text

- Term Slider:
  - "For how long?" — heading-4, mt-32
  - Range 6-48, default 12
  - Snap points: 6mo, 12mo, 24mo, 36mo, 48mo
  - Labels under track, active = text-primary font-600
  - Gold gradient fill on track

- ProjectionCard:
  - bg gold-light, radius-lg, p-24, border 1px rgba(gold, 0.15)
  - "ESTIMATED EARNINGS FOR 12 MONTHS" — label-sm, gold-dark, uppercase
  - "$87.50" — display-lg, animated count-up on change
  - "~17.5% annual return" — number-md, text-success
  - Details grid: Monthly / Daily / First payout / Paid in
  - Disclaimer — body-sm, text-muted, italic
  - UPDATES: debounced API call on amount/term change

- AutoStakeCheckbox:
  - "Auto-start earning" — checked by default
  - Description text

- CTA Button:
  - Gold CTA variant, full-width, h 56px
  - "Invest $500 and start earning →"
  - Dynamic: amount updates from input

- Terms: "By investing, you agree to terms of service" — body-sm, muted

### HowItWorks
- "How it works" — heading-2, centered, mt-48
- 3 cards: "Invest" → "We mine" → "You earn"
- Each: step number circle + heading-3 title + body-md description
- Step 3 accent: gold circle bg instead of primary-light

### TrustBadges
- Row of 4 badges: PeckShield Audited, Certik Verified, Licensed Mining, Funds Protected
- Each: icon 20px + label body-sm text-secondary
- Clickable → details modal

Use earnStore для хранения amount, term, autoStake.
Debounce (300ms) projection API call.
```

## ФАЗА 5: Checkout

```
Реализуй CheckoutPage (/earn/checkout).

### Layout
- Desktop: 2 columns (OrderSummary 40% left, Payment 60% right)
- Mobile: stacked, OrderSummary top

### OrderSummary
- Card, "Order summary" heading-3
- Rows: Investment amount, Term, Estimated annual return, First payout
- Separator line
- Processing fee row (0.5%)
- Separator line
- Total row — heading-3 bold
- All numbers right-aligned

### PaymentMethodTabs
- Pill tabs: "Card" | "Crypto"
- Card tab: Apple Pay, Google Pay, Card/SEPA — as selectable cards
  Selected: border primary, shadow-sm
  Currency dropdown (EUR default for EU users)
  Conversion display: "You'll pay €467.50 (rate: 1 EUR = $1.075)"
  Fee display: "Card processing fee: €2.34 included above"

- Crypto tab: Binance Pay, USDT/USDC/ETH — selectable cards

### CTA
- "Pay $502.50 →" — primary button, full-width, h 56px
- Loading state on submit

### OtcBanner
- "Investing more than $5,000? Contact our team →" — body-sm, primary link

### Flow
1. User arrives from /earn with earnStore data
2. If no data (direct navigation) → redirect to /earn
3. Submit → POST /api/earn/invest → success screen or redirect
```

## ФАЗЫ 6-9: Portfolio, Activity, Learn, Settings

```
Реализуй оставшиеся экраны последовательно.

Для каждого экрана:
1. Используй mock API данные из MSW
2. Следуй wireframe из дизайн-спеки
3. Все компоненты из UI Kit (Фаза 1)
4. Loading / Error / Empty states
5. Mobile-first responsive layout
6. TypeScript interfaces из Секции 4 и 6

### PortfolioPage
- PortfolioOverview (2 cards)
- PositionList с tabs Active/Completed
- PositionCard expandable с ProgressBar
- CancelPositionModal + ReinvestModal
- AdvancedToggle

### ActivityPage  
- ActivityFilters (pill tabs)
- ActivityFeed grouped by date
- ActivityItem с icon + title + amount
- Load more pagination

### LearnPage
- Search input
- FeaturedArticles (3 cards)
- FaqSection (Accordion)
- ContactSection

### SettingsPage
- ProfileSection
- Settings list items
- AppearanceSelect
- DangerZone
```

## ФАЗА 10-11: Dark Mode + Animations Polish

```
### Dark Mode Polish
1. Убедись что ВСЕ компоненты корректно отображаются в dark mode
2. Добавь glassmorphism для NavBar и HeroCard в dark mode:
   backdrop-filter: blur(20px), bg rgba(255,255,255,0.05), border rgba(255,255,255,0.08)
3. Увеличь noise texture opacity до 4-5% в dark mode
4. Проверь все shadows — они должны быть глубже в dark mode
5. Gold gradient чуть ярче (#D4B55A вместо #C9A84C)

### Animations Polish
1. Page transitions: AnimatePresence в RootLayout, fade+slideUp 0.3s
2. Card appear: useInView + motion.div, stagger 100ms delay
3. Number count-up: useCountUp hook на hero numbers
4. Progress ring: SVG stroke-dashoffset animation 1.5s ease-out
5. Chart line draw: Recharts isAnimationActive + animationDuration
6. Skeleton shimmer: CSS gradient animation
7. Button press: scale(0.98) on :active
8. Modal/sheet: Framer Motion variants
9. Success pulse: scale 1→1.05→1 + gold glow on reward claim
10. prefers-reduced-motion: disable ALL animations
```

---

*Конец Technical Implementation Brief. Версия 1.0 — Февраль 2026.*
