# Промт для Claude Code: Рабочий прототип с механикой токеномики

Скопируй и отправь в Claude Code.

---

```
## Задача

У нас есть реализованный фронтенд личного кабинета AYNI Gold (React + Vite + TypeScript + Zustand + TanStack Query).
Сейчас он работает на статичных mock-данных. Нужно заменить статичные моки на 
**рабочую simulation engine** — in-memory бэкенд, который реализует полный workflow:

1. Регистрация/логин
2. Пополнение баланса (симуляция оплаты)
3. Покупка AYNI токенов за USD
4. Стейкинг AYNI на выбранный срок
5. Ежедневное начисление rewards по реальной формуле из whitepaper
6. Квартальная выплата PAXG
7. Claim rewards
8. Завершение стейкинга → возврат AYNI
9. Продажа/рестейк AYNI

Всё хранится в localStorage и пересчитывается при каждом вызове.
Это демо-прототип для показа инвесторам — механика должна считать правильно.

---

## БЛОК 1: Reward Calculation Engine

Создай файл `src/lib/rewardEngine.ts` с точной реализацией формулы из whitepaper.

### Формула (из документации AYNI):

```typescript
// ═══════════════════════════════════════════════════════════════
// AYNI GOLD — Reward Calculation Engine
// Source: Ayni Token Whitepaper + Homepage Tokenomics
// ═══════════════════════════════════════════════════════════════

// ── КОНСТАНТЫ (из whitepaper) ────────────────────────────────
export const TOKENOMICS = {
  // Токен
  tokenCapacity: 0.000004,       // м³/час на 1 токен
  goldContent: 0.1,              // грамм золота на 1 м³ породы
  dailyOperatingHours: 16,       // часов работы в день
  opexPerCubicMeter: 5.92,       // USD операционные расходы на 1 м³

  // Цены (defaults, переопределяются в runtime)
  defaultAyniPrice: 0.2937,      // USD за 1 AYNI
  defaultPaxgPrice: 5192.28,     // USD за 1 PAXG (≈ 1 troy oz золота)
  defaultGoldPricePerGram: 5192.28 / 31.1035,  // USD за грамм (~$166.95)

  // Прочее
  burnPercent: 0.15,             // 15% от success fee уходит на burn
  snapshotTimeUtc: '14:00',      // ежедневный snapshot
} as const;

// ── ТАБЛИЦА SUCCESS FEE ──────────────────────────────────────
// Ключ: максимальный USD threshold
// Значения: [1мес, 12мес, 24мес, 36мес, 48мес]
export const SUCCESS_FEE_TABLE: Record<number, (number | null)[]> = {
  100:      [0.70, 0.55, 0.50, 0.45, 0.40],
  1000:     [0.70, 0.50, 0.45, 0.40, 0.35],
  5000:     [0.70, 0.45, 0.40, 0.35, 0.30],
  10000:    [0.70, 0.40, 0.35, 0.30, 0.27],
  100000:   [null, 0.35, 0.30, 0.27, 0.25],
  1000000:  [null, 0.30, 0.27, 0.25, 0.20],
};

// Маппинг месяцев → индекс в таблице
const TERM_TO_INDEX: Record<number, number> = {
  1: 0, 6: 1, 12: 1, 24: 2, 36: 3, 48: 4
};

// ── ФУНКЦИЯ: Получить Success Fee Rate ───────────────────────
export function getSuccessFeeRate(amountUsd: number, termMonths: number): number {
  // Найти правильный tier по сумме
  const thresholds = [100, 1000, 5000, 10000, 100000, 1000000];
  let tier = 100;
  for (const t of thresholds) {
    if (amountUsd >= t) tier = t;
  }

  // Найти индекс по сроку
  // Для 6 месяцев используем ставку 12 месяцев
  let termIndex: number;
  if (termMonths <= 1) termIndex = 0;
  else if (termMonths <= 12) termIndex = 1;
  else if (termMonths <= 24) termIndex = 2;
  else if (termMonths <= 36) termIndex = 3;
  else termIndex = 4;

  const rate = SUCCESS_FEE_TABLE[tier]?.[termIndex];
  if (rate === null || rate === undefined) {
    // Для больших сумм 1-месячный стейк недоступен
    return 0.70; // fallback
  }
  return rate;
}

// ── ФУНКЦИЯ: Рассчитать reward за 1 день ─────────────────────
export interface DailyRewardResult {
  goldProductionGrams: number;     // валовая добыча золота (г)
  goldProductionUsd: number;       // то же в USD
  extractionCostUsd: number;       // операционные расходы (USD)
  extractionCostGrams: number;     // то же в граммах золота
  rewardBeforeFeeGrams: number;    // до вычета fee
  successFeeGrams: number;         // success fee в граммах
  successFeeUsd: number;
  netRewardGrams: number;          // чистый reward (г)
  netRewardPaxg: number;           // reward в PAXG
  netRewardUsd: number;            // reward в USD
}

export function calculateDailyReward(
  tokensStaked: number,
  amountUsd: number,              // для определения success fee tier
  termMonths: number,             // для определения success fee rate
  goldPricePerGram: number = TOKENOMICS.defaultGoldPricePerGram,
  paxgPrice: number = TOKENOMICS.defaultPaxgPrice,
): DailyRewardResult {
  const { tokenCapacity, goldContent, dailyOperatingHours, opexPerCubicMeter } = TOKENOMICS;

  // 1. Gold Production (grams)
  const goldProductionGrams = tokensStaked * tokenCapacity * goldContent * dailyOperatingHours;
  const goldProductionUsd = goldProductionGrams * goldPricePerGram;

  // 2. Extraction Costs (USD, then convert to grams)
  const extractionCostUsd = opexPerCubicMeter * dailyOperatingHours * tokensStaked * tokenCapacity;
  const extractionCostGrams = extractionCostUsd / goldPricePerGram;

  // 3. Reward before fee
  const rewardBeforeFeeGrams = goldProductionGrams - extractionCostGrams;

  // 4. Success Fee
  const successFeeRate = getSuccessFeeRate(amountUsd, termMonths);
  const successFeeGrams = Math.max(0, rewardBeforeFeeGrams * successFeeRate);
  const successFeeUsd = successFeeGrams * goldPricePerGram;

  // 5. Net Reward
  const netRewardGrams = Math.max(0, rewardBeforeFeeGrams - successFeeGrams);
  const netRewardUsd = netRewardGrams * goldPricePerGram;
  const netRewardPaxg = netRewardGrams / 31.1035; // grams → troy ounces → PAXG (1 PAXG = 1 troy oz)

  return {
    goldProductionGrams,
    goldProductionUsd,
    extractionCostUsd,
    extractionCostGrams,
    rewardBeforeFeeGrams,
    successFeeGrams,
    successFeeUsd,
    netRewardGrams,
    netRewardPaxg,
    netRewardUsd,
  };
}

// ── ФУНКЦИЯ: Проекция на срок ────────────────────────────────
export function calculateProjection(
  amountUsd: number,
  termMonths: number,
  ayniPrice: number = TOKENOMICS.defaultAyniPrice,
  goldPricePerGram: number = TOKENOMICS.defaultGoldPricePerGram,
  paxgPrice: number = TOKENOMICS.defaultPaxgPrice,
) {
  const tokensAmount = amountUsd / ayniPrice;
  const daily = calculateDailyReward(tokensAmount, amountUsd, termMonths, goldPricePerGram, paxgPrice);
  const totalDays = termMonths * 30; // approximate
  const totalPayouts = Math.floor(termMonths / 3); // quarterly

  return {
    ayniTokenAmount: tokensAmount,
    ayniPriceUsed: ayniPrice,
    goldPriceUsed: goldPricePerGram * 31.1035, // per troy oz
    dailyRewardUsd: daily.netRewardUsd,
    dailyRewardPaxg: daily.netRewardPaxg,
    monthlyRewardUsd: daily.netRewardUsd * 30,
    totalRewardUsd: daily.netRewardUsd * totalDays,
    totalRewardPaxg: daily.netRewardPaxg * totalDays,
    annualReturnPercent: (daily.netRewardUsd * 365 / amountUsd) * 100,
    totalPayouts,
    successFeeRate: getSuccessFeeRate(amountUsd, termMonths),
    // Для breakdown таблицы
    dailyBreakdown: daily,
  };
}
```

### Верификация формулы

Проверь на примере из homepage (10,000 AYNI):
- GoldProd = 10000 × 0.000004 × 0.1 × 16 = 0.0640g ✓
- Costs = 5.92 × 16 × 10000 × 0.000004 = $3.7888
- CostInGold = $3.7888 / ~$166.95/g = ~0.0227g
  (homepage показывает 0.0379g — разница из-за gold price, в примере ~$100/g)
- Reward before fee = 0.0640 - costInGold
- Success fee = rewardBeforeFee × rate
- Net = rewardBeforeFee - successFee

Также проверь на реальных данных из скриншота dashboard:
- 1,411.5389 AYNI staked
- Дневная добыча: 0.009033g
  - Check: 1411.5389 × 0.000004 × 0.1 × 16 = 0.009034g ≈ 0.009033g ✓
- Net reward: ~0.002361g (~$0.39)

---

## БЛОК 2: Simulation State Manager

Создай `src/services/simulationStore.ts` — Zustand store, persistится в localStorage.

```typescript
interface SimulationState {
  // ── User ───────────────────────────────────────────────
  user: {
    id: string;
    firstName: string;
    email: string;
    registeredAt: string;          // ISO date
    isLoggedIn: boolean;
    kycVerified: boolean;
  } | null;

  // ── Wallet Balances ────────────────────────────────────
  balances: {
    usdBalance: number;            // фиатный баланс (пополнение)
    ayniAvailable: number;         // свободные AYNI (не застейканы)
    ayniStaked: number;            // AYNI в стейке (locked)
    paxgBalance: number;           // накопленные PAXG rewards
    paxgClaimed: number;           // уже выведенные PAXG
  };

  // ── Positions ──────────────────────────────────────────
  positions: SimPosition[];

  // ── Activity Log ───────────────────────────────────────
  activities: SimActivity[];

  // ── Market Prices (editable для демо) ──────────────────
  prices: {
    ayniUsd: number;               // текущая цена AYNI
    paxgUsd: number;               // текущая цена PAXG
    goldPerGram: number;           // цена золота за грамм
  };

  // ── Time simulation ────────────────────────────────────
  simulationDate: string;          // текущая "дата" симуляции (ISO)
  autoAdvance: boolean;            // авто-перемотка дней

  // ── Actions ────────────────────────────────────────────
  register: (name: string, email: string) => void;
  login: (email: string) => void;
  logout: () => void;

  topUp: (amountUsd: number) => void;                    // пополнить баланс
  buyAyni: (amountUsd: number) => number;                // купить AYNI, вернуть кол-во
  
  createPosition: (params: {
    ayniAmount: number;
    amountUsd: number;
    termMonths: number;
    autoStake: boolean;
  }) => string;                                           // вернуть positionId

  advanceDay: () => void;                                 // перемотать 1 день
  advanceDays: (n: number) => void;                       // перемотать N дней
  advanceToNextPayout: () => void;                        // перемотать до ближайшей выплаты

  claimRewards: (positionId: string) => number;           // claim PAXG, вернуть сумму
  claimAllRewards: () => number;

  completePosition: (positionId: string) => void;         // завершить (если срок вышел)
  cancelPosition: (positionId: string) => void;           // досрочная отмена

  restakeAyni: (ayniAmount: number, termMonths: number) => string;
  sellAyni: (ayniAmount: number) => number;               // продать AYNI → USD
  withdrawPaxg: (paxgAmount: number) => void;             // вывести PAXG

  updatePrices: (prices: Partial<SimulationState['prices']>) => void;
  resetSimulation: () => void;                            // сбросить всё
}

interface SimPosition {
  id: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  startDate: string;
  endDate: string;
  termMonths: number;
  investedUsd: number;
  ayniStaked: number;
  successFeeRate: number;

  // Rewards accumulation
  dailyRewards: SimDailyReward[];   // история rewards по дням
  totalEarnedPaxg: number;          // сумма всех начислений
  totalEarnedUsd: number;
  totalClaimedPaxg: number;         // сколько уже claimed
  
  // Payout schedule
  nextPayoutDate: string;
  payouts: SimPayout[];
}

interface SimDailyReward {
  date: string;
  goldProductionGrams: number;
  extractionCostGrams: number;
  extractionCostUsd: number;
  successFeeGrams: number;
  netRewardGrams: number;
  netRewardPaxg: number;
  netRewardUsd: number;
}

interface SimPayout {
  date: string;
  amountPaxg: number;
  amountUsd: number;
  status: 'paid' | 'pending' | 'scheduled';
}

interface SimActivity {
  id: string;
  type: 'topup' | 'purchase' | 'stake' | 'reward' | 'payout' | 'claim' | 
        'complete' | 'cancel' | 'sell' | 'withdraw' | 'restake';
  timestamp: string;
  title: string;
  description: string;
  amount?: { value: number; currency: string; direction: 'in' | 'out' };
}
```

### Логика ключевых actions:

**topUp(amountUsd):**
- balances.usdBalance += amountUsd
- Добавить activity: "Deposited $X"

**buyAyni(amountUsd):**
- Проверить: usdBalance >= amountUsd
- ayniReceived = amountUsd / prices.ayniUsd
- balances.usdBalance -= amountUsd
- balances.ayniAvailable += ayniReceived
- Activity: "Purchased X AYNI for $Y"
- Return ayniReceived

**createPosition({ayniAmount, amountUsd, termMonths, autoStake}):**
- Если autoStake и ayniAvailable >= ayniAmount:
  - balances.ayniAvailable -= ayniAmount
  - balances.ayniStaked += ayniAmount
- startDate = simulationDate
- endDate = startDate + termMonths months
- successFeeRate = getSuccessFeeRate(amountUsd, termMonths)
- nextPayoutDate = startDate + 3 months (первый квартал)
- Добавить в positions[]
- Activity: "Staked X AYNI for Y months"

**advanceDay():**
- simulationDate += 1 day
- Для каждой active position:
  - daily = calculateDailyReward(pos.ayniStaked, pos.investedUsd, pos.termMonths, prices.goldPerGram, prices.paxgUsd)
  - pos.dailyRewards.push(daily result)
  - pos.totalEarnedPaxg += daily.netRewardPaxg
  - pos.totalEarnedUsd += daily.netRewardUsd
  - balances.paxgBalance += daily.netRewardPaxg  ← accumulate unclaimed
  
- Проверить payouts:
  - Если simulationDate >= pos.nextPayoutDate:
    - Создать payout record
    - nextPayoutDate += 3 months
    - Activity: "Quarterly payout: X PAXG ($Y)"

- Проверить завершение:
  - Если simulationDate >= pos.endDate:
    - pos.status = 'completed'
    - balances.ayniStaked -= pos.ayniStaked
    - balances.ayniAvailable += pos.ayniStaked
    - Activity: "Staking completed: X AYNI returned"

**advanceDays(n):**
- for (let i = 0; i < n; i++) advanceDay()

**advanceToNextPayout():**
- Найти ближайший nextPayoutDate среди всех active positions
- advanceDays до этой даты

**claimRewards(positionId):**
- Найти position
- unclaimed = pos.totalEarnedPaxg - pos.totalClaimedPaxg
- pos.totalClaimedPaxg = pos.totalEarnedPaxg
- Activity: "Claimed X PAXG ($Y)"
- Return unclaimed

**sellAyni(amount):**
- Проверить ayniAvailable >= amount
- usdReceived = amount * prices.ayniUsd
- balances.ayniAvailable -= amount
- balances.usdBalance += usdReceived
- Activity: "Sold X AYNI for $Y"

---

## БЛОК 3: Mock API Layer

Создай `src/services/mockApi.ts` — обёртка над simulationStore, которая 
возвращает данные в формате API-контрактов из Technical Brief.

```typescript
// Каждый mock API endpoint читает из simulationStore
// и трансформирует в формат DashboardResponse, PortfolioResponse, etc.

export const mockApi = {
  // GET /api/dashboard
  async getDashboard(): Promise<DashboardResponse> {
    const state = useSimulationStore.getState();
    // Собрать данные из state.positions, state.balances
    // Рассчитать chartData из dailyRewards всех позиций
    // ...
  },

  // GET /api/earn/projection
  async getProjection(amount: number, months: number): Promise<EarnProjectionResponse> {
    const state = useSimulationStore.getState();
    const projection = calculateProjection(
      amount, months, 
      state.prices.ayniUsd, state.prices.goldPerGram, state.prices.paxgUsd
    );
    // Трансформировать в EarnProjectionResponse
    // ...
  },

  // POST /api/earn/invest
  async invest(req: InvestRequest): Promise<InvestResponse> {
    const state = useSimulationStore.getState();
    // 1. topUp (симулировать оплату)
    state.topUp(req.amountUsd);
    // 2. buyAyni
    const ayni = state.buyAyni(req.amountUsd);
    // 3. createPosition
    const posId = state.createPosition({
      ayniAmount: ayni,
      amountUsd: req.amountUsd,
      termMonths: req.termMonths,
      autoStake: req.autoStake,
    });
    return { positionId: posId, status: 'confirmed' };
  },

  // GET /api/portfolio
  async getPortfolio(): Promise<PortfolioResponse> { /* ... */ },

  // GET /api/activity
  async getActivity(filter?: string, page?: number): Promise<ActivityResponse> { /* ... */ },

  // ...остальные endpoints
};
```

Замени все существующие вызовы к mock data / MSW handlers на вызовы mockApi.
TanStack Query hooks должны вызывать mockApi вместо fetch.

---

## БЛОК 4: Simulation Control Panel

Создай компонент `src/components/dev/SimulationPanel.tsx` — плавающая панель 
для управления симуляцией. Показывается только в dev mode.

```tsx
// Плавающая панель (bottom-left, draggable) с:

[SIMULATION CONTROLS]
  ┌─────────────────────────────────────────────────────┐
  │ ⏱ Simulation: Feb 28, 2026                         │
  │                                                     │
  │ [+1 Day] [+7 Days] [+30 Days] [→ Next Payout]     │
  │                                                     │
  │ ── Quick Actions ──                                 │
  │ [💰 Top Up $500] [💰 Top Up $5,000]                │
  │ [🪙 Buy 1000 AYNI] [⛏ Stake All]                  │
  │                                                     │
  │ ── Prices (editable) ──                             │
  │ AYNI: [$0.2937____]                                │
  │ PAXG: [$5,192.28__]                                │
  │ Gold/g: [$166.95___]                               │
  │                                                     │
  │ ── State ──                                         │
  │ USD:  $500.00                                      │
  │ AYNI: 1,411.54 (staked) + 0.00 (free)             │
  │ PAXG: 0.000396 (unclaimed)                         │
  │ Positions: 3 active, 1 completed                   │
  │                                                     │
  │ [🔄 Reset All] [📋 Export State]                   │
  └─────────────────────────────────────────────────────┘

// Toggle: клавиша ` (backtick) или кнопка-гаечка в углу
```

Panel должен:
- Показывать текущую дату симуляции
- Кнопки перемотки: +1 день, +7, +30, до следующего payout
- Quick actions для быстрого наполнения данными
- Редактируемые цены (чтобы показать как меняется расчёт)
- Текущее состояние кошелька
- Reset — сбросить всё в исходное
- Export — скопировать JSON state в clipboard

---

## БЛОК 5: Интеграция с существующими экранами

### Earn Page
- При вводе суммы и срока → вызывать `mockApi.getProjection(amount, months)`
- При клике "Invest" → `mockApi.invest({...})` 
- После успеха → redirect на Portfolio с toast "Investment confirmed!"
- Projection card обновляется в реальном времени

### Home Page  
- `mockApi.getDashboard()` возвращает агрегированные данные из всех позиций
- Total Earned = сумма totalEarnedUsd по всем позициям
- Today's earning = последний dailyReward из активных позиций
- Chart data = массив cumulative earnings по дням
- Daily rewards table = последние N дней из dailyRewards

### Portfolio Page
- `mockApi.getPortfolio()` возвращает все позиции
- Progress bar считается от (simulationDate - startDate) / (endDate - startDate)
- "Claim" кнопка → `claimRewards(positionId)`
- "Cancel" → `cancelPosition(positionId)` с confirmation modal
- Completed positions показывают "What's next?" с кнопками Restake/Sell/Withdraw

### Activity Page
- `mockApi.getActivity()` возвращает activities из store
- Фильтры работают по type

---

## БЛОК 6: Onboarding Demo Scenario

При первом запуске (или после Reset) — предзаполни демо-сценарий:

```typescript
function seedDemoData(store: SimulationState) {
  // 1. Создать пользователя
  store.register('Alex', 'alex@demo.com');
  
  // 2. Установить дату старта: 2 месяца назад
  const startDate = subMonths(new Date(), 2); // Dec 28, 2025
  store.simulationDate = startDate.toISOString();
  
  // 3. Первая покупка: $120
  store.topUp(120);
  store.buyAyni(120);  // ~408 AYNI
  store.createPosition({
    ayniAmount: 408,
    amountUsd: 120,
    termMonths: 1,
    autoStake: true,
  });
  
  // 4. Прокрутить 31 день → позиция завершена
  store.advanceDays(31);
  
  // 5. Вторая и третья покупки: $150 каждая
  store.topUp(300);
  store.buyAyni(150);  // ~510 AYNI
  store.createPosition({
    ayniAmount: 510,
    amountUsd: 150,
    termMonths: 12,
    autoStake: true,
  });
  store.buyAyni(150);  // ~510 AYNI
  store.createPosition({
    ayniAmount: 510,
    amountUsd: 150,
    termMonths: 12,
    autoStake: true,
  });
  
  // 6. Прокрутить ещё ~30 дней до "сегодня"
  store.advanceDays(30);
  
  // Теперь у юзера:
  // - 1 completed position (1 мес, ~408 AYNI вернулись)
  // - 2 active positions (12 мес каждая, ~510 AYNI × 2)
  // - Accumulated rewards за ~30 дней
  // - Activity log с ~65 записями
}
```

Сделай кнопку "Load Demo Data" в SimulationPanel.

---

## БЛОК 7: Unified Invest Flow (Buy + Stake в 1 шаге)

Когда юзер нажимает "Invest $500 and start earning" на Earn page:

1. Симулировать пополнение: `topUp(500)`
2. Купить AYNI: `buyAyni(500)` → получить ~1703 AYNI
3. Создать позицию: `createPosition({ayniAmount: 1703, amountUsd: 500, termMonths: 12, autoStake: true})`
4. Всё в одном action — юзер не видит промежуточных шагов
5. Показать success screen:
   ```
   ✓ Investment confirmed!
   
   You invested $500
   You received 1,703 AYNI tokens
   Staked for 12 months
   
   Estimated daily earning: $0.24
   First payout: Jul 28, 2026
   
   [View Portfolio →]  [Invest More]
   ```

---

## БЛОК 8: Пересчёт при изменении цен

Когда в SimulationPanel меняют цены (AYNI, PAXG, Gold):
- Все USD-эквиваленты пересчитываются: portfolio value, current value позиций
- Новые daily rewards считаются по новым ценам
- Исторические rewards НЕ пересчитываются (они зафиксированы)
- Dashboard обновляется через invalidation TanStack Query

---

## Порядок реализации

1. `rewardEngine.ts` — формула + тесты (проверь на примере 10,000 AYNI и 1,411 AYNI)
2. `simulationStore.ts` — state + все actions с localStorage persistence
3. `mockApi.ts` — обёртка в формате API contracts
4. Заменить существующие mock data → mockApi во всех TanStack Query hooks
5. `SimulationPanel.tsx` — control panel
6. Seed demo data function
7. Интеграция с Earn → unified invest flow
8. Интеграция с Portfolio → claim, cancel, restake, sell
9. Интеграция с Home → live data из simulation
10. Интеграция с Activity → log из simulation

## Ограничения

- НЕ трогай UI-компоненты визуально (стили, layout, анимации) — только подключай данные
- Всё хранится в localStorage — при очистке сбрасывается
- Цены по умолчанию: AYNI = $0.2937, PAXG = $5,192.28
- simulationDate стартует с текущей реальной даты (или с демо-даты если seed)
- SimulationPanel показывать только в development mode (import.meta.env.DEV)
- Формула должна давать те же числа что в реальном дашборде на скриншотах
```
