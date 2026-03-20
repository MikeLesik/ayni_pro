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
          gradient: "var(--color-primary-gradient)",
        },
        gold: {
          DEFAULT: "var(--color-gold)",
          light: "var(--color-gold-light)",
          dark: "var(--color-gold-dark)",
          gradient: "var(--color-gold-gradient)",
        },
        focus: {
          ring: "var(--color-focus-ring)",
        },
        tooltip: {
          bg: "var(--color-tooltip-bg)",
          text: "var(--color-tooltip-text)",
          muted: "var(--color-tooltip-muted)",
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
          subtle: "var(--color-border-subtle)",
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
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "Consolas", "monospace"],
      },
      fontSize: {
        "display-hero": [
          "48px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "display-hero-mobile": [
          "36px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "display-lg": [
          "36px",
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        "display-lg-mobile": [
          "28px",
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        "heading-1": [
          "28px",
          { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "heading-1-mobile": [
          "24px",
          { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "heading-2": [
          "22px",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "heading-2-mobile": [
          "18px",
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
          "14px",
          { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "600" },
        ],
        "heading-4-mobile": [
          "13px",
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
          "13px",
          { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "400" },
        ],
        "body-sm-mobile": [
          "12px",
          { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "400" },
        ],
        "label-sm": [
          "12px",
          { lineHeight: "1.3", letterSpacing: "0.05em", fontWeight: "500" },
        ],
        "number-lg": [
          "22px",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        "number-lg-mobile": [
          "20px",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        "number-md": [
          "18px",
          { lineHeight: "1.2", letterSpacing: "0", fontWeight: "500" },
        ],
        "number-md-mobile": [
          "16px",
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
        "section-related": "var(--section-gap-related)",
        "section-separate": "var(--section-gap-separate)",
        "card-lg": "var(--card-padding-lg)",
        "card-md": "var(--card-padding-md)",
        "card-sm": "var(--card-padding-sm)",
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
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(27,58,75,0.3)" },
          "50%": { transform: "scale(1.05)", boxShadow: "0 0 0 8px rgba(27,58,75,0)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(27,58,75,0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "coin-burst": {
          "0%": { transform: "translateY(0)", opacity: "1", scale: "1" },
          "100%": { transform: "translateY(-60px)", opacity: "0", scale: "0.5" },
        },
        "gold-shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "streak-fire": {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "25%": { transform: "scale(1.15) rotate(-3deg)" },
          "50%": { transform: "scale(1.05) rotate(2deg)" },
          "75%": { transform: "scale(1.12) rotate(-1deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        "success-border-pulse": {
          "0%": { borderColor: "rgba(27,58,75,0.4)" },
          "50%": { borderColor: "rgba(27,58,75,0.8)" },
          "100%": { borderColor: "rgba(27,58,75,0.4)" },
        },
        "ember-float": {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-24px) scale(0.3)" },
        },
        "flame-flicker": {
          "0%, 100%": { transform: "scaleY(1) scaleX(1)", opacity: "0.9" },
          "25%": { transform: "scaleY(1.08) scaleX(0.95)", opacity: "1" },
          "50%": { transform: "scaleY(0.95) scaleX(1.04)", opacity: "0.85" },
          "75%": { transform: "scaleY(1.05) scaleX(0.97)", opacity: "1" },
        },
        "burst-ring": {
          "0%": { transform: "scale(0.3)", opacity: "0.8" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "shine-sweep": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "20%": { opacity: "0.6" },
          "100%": { transform: "translateX(200%)", opacity: "0" },
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
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "coin-burst": "coin-burst 0.8s ease-out forwards",
        "gold-shimmer": "gold-shimmer 2s linear infinite",
        "streak-fire": "streak-fire 0.6s ease-in-out",
        "ember-float": "ember-float 1.2s ease-out infinite",
        "flame-flicker": "flame-flicker 0.8s ease-in-out infinite",
        "burst-ring": "burst-ring 0.5s ease-out forwards",
        "shine-sweep": "shine-sweep 0.6s ease-out forwards",
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
