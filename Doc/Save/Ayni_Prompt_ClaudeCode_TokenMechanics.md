# Промт для Claude Code: Добавить механику токена AYNI в интерфейс

Скопируй этот промт целиком и отправь в Claude Code.

---

```
## Задача

В текущей реализации кабинета AYNI Gold все суммы показываются только в USD.
Но пользовательский актив — это токен AYNI (ERC-20), а не доллары.
Нужно добавить видимость AYNI-токена в интерфейс по принципу
"Dollars on top, AYNI underneath" — USD остаётся главным отображением,
но механика токена видна, объяснена, и exit path ясен.

Это НЕ рефакторинг. Это точечные дополнения к существующим компонентам
и несколько новых компонентов.

---

## 1. Новые типы — добавить в src/types/api.ts

В API-ответах уже есть поля ayniTokenAmount, investedAmountAyni, ayniPriceUsed.
Добавь недостающие:

```typescript
// Добавить в DashboardResponse → portfolio
portfolio: {
  // ...существующие поля...
  totalInvestedAyni: number;       // общее количество AYNI в стейке
  availableBalanceAyni: number;    // unlocked AYNI на кошельке
  ayniPrice: number;               // текущая цена AYNI в USD
};

// Добавить в PositionData (уже есть investedAmountAyni, добавить):
currentValueUsd: number;           // investedAmountAyni × текущая цена AYNI

// Добавить новый тип для completed positions
export interface ExitOption {
  type: 'restake' | 'sell' | 'withdraw';
  label: string;
  description: string;
  icon: string; // Lucide icon name
}

// Добавить в UserSettingsResponse
displayCurrency: 'usd' | 'ayni' | 'both';
```

Обнови mock data в соответствующих файлах, чтобы эти поля были заполнены.

---

## 2. Earn Page — AmountInput area

Файл: `src/components/earn/AmountInput.tsx` (или где находится input суммы)

Под полем ввода суммы ($500), ПОСЛЕ quick amount buttons, добавь строку конвертации:

```tsx
{/* Conversion line — показывает сколько AYNI юзер получит */}
<div className="flex items-center gap-1.5 mt-2 text-sm text-text-secondary">
  <span>≈ {formatNumber(amountUsd / ayniPrice)} AYNI</span>
  <span className="text-text-muted">at ${formatPrice(ayniPrice)}/token</span>
  <Tooltip content="You're purchasing AYNI tokens. The dollar amount shown is based on the current token price, which may fluctuate.">
    <Info className="w-3.5 h-3.5 text-text-muted cursor-help" />
  </Tooltip>
</div>
```

ayniPrice берётся из GET /api/prices или из projection response (ayniPriceUsed).

---

## 3. Earn Page — ProjectionCard

Файл: `src/components/earn/ProjectionCard.tsx`

В блок деталей проекции (Monthly / Daily / First payout / Paid in)
добавь ДВЕ новые строки:

```tsx
{/* После "Paid in: PAXG (gold-backed token)" добавить: */}
<div className="border-t border-border-light mt-3 pt-3">
  <div className="flex justify-between text-sm">
    <span className="text-text-secondary">You will hold</span>
    <span className="text-text-primary font-medium">
      {formatNumber(projection.ayniTokenAmount)} AYNI (staked)
    </span>
  </div>
  <div className="flex justify-between text-sm mt-1.5">
    <span className="text-text-secondary">After unlock</span>
    <span className="text-text-primary font-medium">
      AYNI returns to your wallet
    </span>
  </div>
</div>
```

Обнови disclaimer текст внизу ProjectionCard:

```
"Projections based on current mining output and gold prices.
Your investment is held as AYNI tokens. Token value may fluctuate."
```

---

## 4. Earn Page — CTA Button area

Файл: где находится кнопка "Invest $500 and start earning"

ПОД кнопкой CTA добавь:

```tsx
<p className="text-xs text-text-muted text-center mt-2">
  You're purchasing {formatNumber(projection.ayniTokenAmount)} AYNI tokens
</p>
```

---

## 5. Checkout — OrderSummary

Файл: `src/components/earn/OrderSummary.tsx` (или checkout)

Добавь 2 строки в Order Summary, ПОСЛЕ "Investment amount: $500.00":

```tsx
<div className="flex justify-between text-sm py-1.5">
  <span className="text-text-secondary">You receive</span>
  <span className="text-text-primary">~{formatNumber(ayniAmount)} AYNI</span>
</div>
<div className="flex justify-between text-sm py-1.5">
  <span className="text-text-secondary">Current AYNI price</span>
  <span className="text-text-primary">${formatPrice(ayniPrice)}</span>
</div>
```

---

## 6. Home — Quick Stats tooltip

Файл: `src/components/home/QuickStatsRow.tsx` (или StatCard для "Invested")

Карточка "Invested: $414.68" — добавь tooltip на иконку info:

```tsx
<StatCard
  label="Invested"
  value={formatCurrency(portfolio.totalInvested)}
  tooltip={`Held as ${formatNumber(portfolio.totalInvestedAyni)} AYNI tokens (currently worth ${formatCurrency(portfolio.totalInvested)} at $${formatPrice(portfolio.ayniPrice)}/AYNI). Token value may change.`}
  // ...остальные props
/>
```

Если StatCard ещё не поддерживает tooltip prop — добавь его.

---

## 7. Home — Advanced View

Файл: `src/components/home/DailyBreakdown.tsx` или где toggle "Show mining details"

Когда Advanced View включен, добавь блок НАД таблицей:

```tsx
{advancedView && (
  <div className="flex flex-wrap gap-x-6 gap-y-2 p-3 bg-bg-secondary rounded-lg mb-3 text-sm">
    <div>
      <span className="text-text-muted">AYNI Balance: </span>
      <span className="text-text-primary font-medium">
        {formatNumber(portfolio.totalInvestedAyni)} AYNI
      </span>
      <span className="text-text-muted ml-1">
        ({formatCurrency(portfolio.totalInvested)})
      </span>
    </div>
    <div>
      <span className="text-text-muted">AYNI Price: </span>
      <span className="text-text-primary font-medium">
        ${formatPrice(portfolio.ayniPrice)}
      </span>
    </div>
    <div>
      <span className="text-text-muted">PAXG Earned: </span>
      <span className="text-text-primary font-medium">
        {portfolio.goldRewardsPaxg.toFixed(6)} PAXG
      </span>
      <span className="text-text-muted ml-1">
        ({formatCurrency(portfolio.goldRewards)})
      </span>
    </div>
  </div>
)}
```

---

## 8. Portfolio — PositionCard

Файл: `src/components/portfolio/PositionCard.tsx`

В карточке позиции ДОБАВЬ строки (между "Invested" и "Earned"):

```tsx
<div className="flex justify-between text-sm py-1">
  <span className="text-text-secondary">Holding</span>
  <span className="text-text-primary font-medium">
    {formatNumber(position.investedAmountAyni)} AYNI
  </span>
</div>
<div className="flex justify-between text-sm py-1">
  <span className="text-text-secondary">Current value</span>
  <span className="text-text-primary font-medium">
    {formatCurrency(position.currentValueUsd)}
  </span>
</div>
```

Для ACTIVE позиций — добавь блок "After unlock" в expanded view:

```tsx
{position.status === 'active' && expanded && (
  <div className="mt-3 pt-3 border-t border-border-light">
    <p className="text-xs text-text-muted">
      When your staking period ends, your {formatNumber(position.investedAmountAyni)} AYNI
      tokens will be returned to your wallet. You can restake, sell, or hold them.
    </p>
  </div>
)}
```

---

## 9. Portfolio — CompletedPositionCard (НОВЫЙ компонент или расширение PositionCard)

Для позиций со status === 'completed', добавь секцию "What's next?":

```tsx
{position.status === 'completed' && (
  <div className="mt-3 pt-3 border-t border-border-light">
    <div className="flex justify-between text-sm mb-2">
      <span className="text-text-secondary">Returned</span>
      <span className="text-text-primary font-medium">
        {formatNumber(position.investedAmountAyni)} AYNI
      </span>
    </div>

    <p className="text-heading-4 font-semibold text-text-primary mb-2">
      What's next?
    </p>

    <div className="flex gap-2">
      <Button
        variant="primary"
        size="sm"
        icon={RefreshCw}
        onClick={() => onRestake(position.id)}
      >
        Restake
      </Button>
      <Button
        variant="secondary"
        size="sm"
        icon={ArrowRightLeft}
        onClick={() => onSellAyni(position.id)}
      >
        Sell AYNI
      </Button>
      <Button
        variant="ghost"
        size="sm"
        icon={Download}
        onClick={() => onWithdraw(position.id)}
      >
        Withdraw
      </Button>
    </div>

    <p className="text-xs text-text-muted mt-2">
      Restake for continued earnings, sell on exchange, or withdraw to your wallet.
    </p>
  </div>
)}
```

---

## 10. НОВЫЙ компонент: SellAyniModal

Файл: `src/components/portfolio/SellAyniModal.tsx`

Модалка, которая открывается при клике "Sell AYNI":

```tsx
interface SellAyniModalProps {
  open: boolean;
  onClose: () => void;
  ayniAmount: number;
  currentPrice: number;
}

export function SellAyniModal({ open, onClose, ayniAmount, currentPrice }: SellAyniModalProps) {
  const estimatedValue = ayniAmount * currentPrice;

  return (
    <Modal open={open} onClose={onClose} title="How to sell your AYNI tokens">
      <div className="space-y-4">
        <div className="bg-bg-secondary rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Your AYNI</span>
            <span className="text-text-primary font-medium">
              {formatNumber(ayniAmount)} AYNI
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-text-secondary">Current price</span>
            <span className="text-text-primary">${formatPrice(currentPrice)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1 pt-2 border-t border-border-light">
            <span className="text-text-secondary">Estimated value</span>
            <span className="text-text-primary font-semibold">
              {formatCurrency(estimatedValue)}
            </span>
          </div>
        </div>

        <ol className="space-y-3 text-sm text-text-secondary">
          <li className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-light text-primary text-xs flex items-center justify-center font-medium">1</span>
            <span>Withdraw AYNI to your external wallet</span>
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-light text-primary text-xs flex items-center justify-center font-medium">2</span>
            <span>Go to a supported exchange (MEXC, Uniswap)</span>
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-light text-primary text-xs flex items-center justify-center font-medium">3</span>
            <span>Swap AYNI for USDT, USDC, or other tokens</span>
          </li>
        </ol>

        <div className="flex items-start gap-2 p-3 bg-warning-light rounded-lg text-xs text-warning">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Token price fluctuates. The value at the time of sale may differ from this estimate.</span>
        </div>

        <div className="flex gap-2">
          <Button variant="primary" fullWidth onClick={() => { /* navigate to withdraw */ }}>
            Withdraw to wallet
          </Button>
          <Button variant="secondary" fullWidth onClick={() => { /* open exchange link */ }}>
            View on exchange
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

---

## 11. Onboarding — обновить шаг 2

Файл: `src/components/onboarding/OnboardingCarousel.tsx`

Текущий шаг 2 ("How it works") — заменить 3-шаговую схему на 4-шаговую:

```tsx
// Было: Invest → Mine → Earn (3 шага)
// Стало: Pay in $ → Get AYNI → AYNI mines gold → Earn PAXG (4 шага)

const steps = [
  {
    icon: DollarSign,
    title: "You invest",
    description: "Choose amount starting from $100. Pay by card or crypto."
  },
  {
    icon: Coins, // или TokensIcon
    title: "You get AYNI",
    description: "Your payment is converted to AYNI tokens — your mining asset."
  },
  {
    icon: Pickaxe, // или Mountain
    title: "AYNI mines gold",
    description: "Staked tokens power real gold mining in South America."
  },
  {
    icon: TrendingUp,
    title: "You earn PAXG",
    description: "Receive gold-backed rewards daily, paid out quarterly."
  }
];
```

На mobile: 4 шага в horizontal scroll или 2×2 grid.

Под шагами добавь expandable:

```tsx
<details className="mt-3 text-xs text-text-muted">
  <summary className="cursor-pointer text-text-secondary hover:text-text-primary">
    What is AYNI?
  </summary>
  <p className="mt-2">
    AYNI is a utility token on the Ethereum blockchain (ERC-20).
    Each token represents mining capacity at our gold concessions.
    After staking ends, AYNI returns to your wallet and can be traded on exchanges.
  </p>
</details>
```

---

## 12. Learn Page — добавить 2 статьи

Файл: mock data для Learn articles (src/services/mocks/ или аналогичный)

Добавь в массив статей:

```typescript
{
  id: 'sell-ayni',
  slug: 'how-to-sell-ayni',
  title: 'How to sell your AYNI tokens',
  description: 'Step-by-step guide to converting AYNI back to cash after staking ends.',
  category: 'getting-started',
  type: 'guide',
  publishedAt: '2026-02-28T00:00:00Z',
  content: `## When staking ends\n\nWhen your staking period completes, your AYNI tokens are returned to your virtual wallet. You have three options:\n\n### 1. Restake\nPut your AYNI back to work for continued earnings.\n\n### 2. Sell on exchange\n1. Withdraw AYNI to your external wallet (MetaMask, Trust Wallet, etc.)\n2. Go to a supported exchange\n3. Swap AYNI for USDT, USDC, or ETH\n\n### 3. Hold\nKeep AYNI in your wallet. You can stake or sell anytime.\n\n## Supported exchanges\n- MEXC (centralized)\n- Uniswap (decentralized)\n\n## Important\nAYNI token price fluctuates based on market demand. The USD value shown in your dashboard is an estimate based on the current price.`
},
{
  id: 'ayni-price',
  slug: 'understanding-ayni-price',
  title: 'Understanding AYNI token price',
  description: 'How AYNI pricing works and what affects the value of your holdings.',
  category: 'faq',
  type: 'article',
  publishedAt: '2026-02-28T00:00:00Z',
  content: `## How AYNI price works\n\nAYNI price is determined by market supply and demand on exchanges.\n\n## What this means for you\n- When you invest $500, you buy approximately 1,703 AYNI at ~$0.29/token\n- If AYNI price rises, your holding is worth more in USD\n- If AYNI price drops, your holding is worth less in USD\n- **Your PAXG rewards are NOT affected by AYNI price** — rewards are based on mining output\n\n## Dashboard amounts\nAll dollar amounts in your dashboard are estimates based on the current AYNI price. The actual value when you sell may be different.`
}
```

---

## 13. Settings — Display Currency toggle

Файл: `src/components/settings/SettingsPage.tsx` (или Display section)

Добавь секцию "Display":

```tsx
<div className="mt-4">
  <h3 className="text-heading-4 font-semibold text-text-primary mb-3">
    Display
  </h3>
  <div className="bg-surface-card rounded-xl border border-border p-4">
    <label className="text-sm text-text-secondary mb-2 block">
      Show balances in
    </label>
    <Tabs
      value={displayCurrency}
      onChange={setDisplayCurrency}
      options={[
        { value: 'usd', label: '$ USD' },
        { value: 'ayni', label: 'AYNI + PAXG' },
        { value: 'both', label: 'Both' },
      ]}
    />
    <p className="text-xs text-text-muted mt-2">
      {displayCurrency === 'usd' && 'All amounts shown in US dollars at current prices.'}
      {displayCurrency === 'ayni' && 'Show token balances (AYNI, PAXG) with wallet addresses.'}
      {displayCurrency === 'both' && 'Show both: "$414.68 (1,411.54 AYNI)"'}
    </p>
  </div>
</div>
```

Сохраняй значение в UserSettings store. Компоненты, которые показывают суммы,
должны проверять этот параметр:
- usd → "$414.68" (текущее поведение)
- ayni → "1,411.54 AYNI ($414.68)"
- both → "$414.68 (1,411.54 AYNI)"

Создай хук:

```typescript
// src/hooks/useFormatAmount.ts
export function useFormatAmount() {
  const displayCurrency = useSettingsStore(s => s.displayCurrency);

  return {
    format(usdValue: number, ayniValue?: number): string {
      if (!ayniValue) return formatCurrency(usdValue);

      switch (displayCurrency) {
        case 'usd': return formatCurrency(usdValue);
        case 'ayni': return `${formatNumber(ayniValue)} AYNI (${formatCurrency(usdValue)})`;
        case 'both': return `${formatCurrency(usdValue)} (${formatNumber(ayniValue)} AYNI)`;
      }
    }
  };
}
```

Используй этот хук в StatCard, PositionCard, и других компонентах,
которые показывают денежные суммы и имеют доступ к AYNI-количеству.

---

## 14. Утилиты — добавить форматирование

Файл: `src/lib/format.ts` (или где хранятся утилиты)

Добавь если нет:

```typescript
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}
```

---

## Порядок реализации

1. Типы и mock data (пункт 1, 14)
2. Earn page: конвертация + projection + CTA (пункты 2, 3, 4, 5)
3. Home: tooltip + advanced view (пункты 6, 7)
4. Portfolio: position cards + completed + SellAyniModal (пункты 8, 9, 10)
5. Onboarding: 4-шаговая схема (пункт 11)
6. Learn: новые статьи (пункт 12)
7. Settings: display toggle + useFormatAmount hook (пункт 13)

Не ломай существующий UI. Все изменения — аддитивные.
```
