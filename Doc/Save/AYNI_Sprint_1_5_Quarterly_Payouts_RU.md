# SPRINT 1.5: Модель квартальных выплат в симуляторе

**Приоритет:** Вставить после Sprint 1 (Compliance), перед Sprint 2  
**Трудоёмкость:** 2–3 дня  
**Зависимости:** Sprint 1 (compliance-терминология уже заменена)

---

## Проблема

Текущий симулятор не моделирует реальный цикл выплат AYNI:

1. **Daily accrual** — каждый день начисляется золото по формуле из whitepaper, но эти начисления НЕ сразу доступны для вывода
2. **Quarterly payout** — раз в квартал накопленные начисления переводятся в claimable PAXG
3. **Три состояния баланса** отсутствуют: accrued (копится), claimable (доступно к выводу), withdrawn (выведено)

Из-за этого:
- На Home пользователь видит "$60.53 total received" и "+$0.32/day", но на Positions — "GOLD REWARDS 0.00 g" → прямое противоречие
- Нет понимания, КОГДА деньги реально появятся на балансе
- "Next payout: Apr 27, 2026" выглядит как случайная дата без объяснения механики
- Earn-калькулятор показывает "First payout Jun 29, 2026", но не объясняет что до этой даты выплат не будет

---

## Формула начислений (из Whitepaper + Tokenomics)

```
Reward (PAXG) = Gold Production (g) - Costs (USD converted to g) - Success Fee (g)

Gold Production (g) = numTokens × 0.000004 m³/hour × goldContent × dailyHours
  - Token Mining Capacity: 0.000004 m³/hour (4 cm³/hour)
  - Gold Content: 0.1 g/m³
  - Daily Operating Hours: 16

Costs (USD) = OPEX × dailyHours × numTokens × tokenCapacity
  - OPEX per m³: $5.92

Success Fee (g) = (Gold Production - Costs in gold) × successFeeRate

Success Fee Rates (зависят от суммы и срока):
| Сумма     | 6мес  | 12мес | 24мес | 36мес | 48мес |
|-----------|-------|-------|-------|-------|-------|
| $100      | 70%   | 55%   | 50%   | 45%   | 40%   |
| $1,000    | 70%   | 50%   | 45%   | 40%   | 35%   |
| $5,000    | 70%   | 45%   | 40%   | 35%   | 30%   |
| $10,000   | n/a   | 40%   | 35%   | 30%   | 27%   |
| $100,000  | n/a   | 35%   | 30%   | 27%   | 25%   |
| $1,000,000| n/a   | 30%   | 27%   | 25%   | 20%   |

Snapshot: ежедневно в 14:00 UTC (привязка к LBMA)
Burn: 15% от Success Fee → buyback и burn AYNI ежеквартально
```

---

## Модель данных для симулятора

### Промт для Claude Code

```
## Задача: Реализовать модель квартальных выплат в симуляторе дашборда

### Контекст
AYNI Gold — платформа токенизации золотодобычи. Текущий симулятор (localStorage-based) 
неправильно моделирует цикл выплат. Нужно реализовать реальную механику:
- Выплаты НАЧИСЛЯЮТСЯ ежедневно (daily accrual)
- Выплаты ВЫПЛАЧИВАЮТСЯ ежеквартально (quarterly payout)
- Между начислением и выплатой — деньги видны как "accrued", но не claimable

### Часть 1: Типы данных

Создай или обнови типы:

```typescript
// src/types/distributions.ts

/** Квартальные периоды */
interface QuarterlyPeriod {
  id: string;                    // "Q1-2026", "Q2-2026"
  startDate: string;             // ISO date — начало квартала стейкинга
  endDate: string;               // ISO date — конец квартала
  payoutDate: string;            // ISO date — дата выплаты (endDate + 3-5 рабочих дней)
  status: 'accruing' | 'pending_payout' | 'paid' | 'future';
}

/** Дневное начисление */
interface DailyAccrual {
  date: string;                  // ISO date
  positionId: string;
  goldProductionGrams: number;   // сколько золота добыто долей пользователя
  costsUsd: number;              // операционные расходы
  costsGrams: number;            // расходы в граммах (конвертация через цену золота)
  successFeeGrams: number;       // комиссия платформы в граммах
  netGoldGrams: number;          // чистое золото после вычетов
  netPaxg: number;               // конвертация в PAXG (netGold / 31.1035)
  netUsd: number;                // USD-эквивалент через цену PAXG
  goldPriceUsd: number;          // цена золота на момент snapshot
  paxgPriceUsd: number;          // цена PAXG на момент snapshot
  quarterId: string;             // к какому кварталу относится
}

/** Состояние выплат пользователя */
interface DistributionState {
  /** Текущий квартал — начисления идут, но ещё не выплачены */
  accruing: {
    quarterId: string;
    totalGoldGrams: number;      // сумма netGoldGrams за текущий квартал
    totalPaxg: number;
    totalUsd: number;
    daysInQuarter: number;       // сколько дней начислялось
    startDate: string;
    estimatedPayoutDate: string;
  };
  
  /** Доступно к выводу — прошлые кварталы, уже выплаченные */
  claimable: {
    totalPaxg: number;           // сумма PAXG доступная для withdraw
    totalGoldGrams: number;
    totalUsd: number;
  };
  
  /** Уже выведено пользователем */
  withdrawn: {
    totalPaxg: number;
    totalUsd: number;
  };
  
  /** История квартальных выплат */
  quarterlyPayouts: QuarterlyPayout[];
  
  /** Все дневные начисления */
  dailyAccruals: DailyAccrual[];
}

/** Завершённая квартальная выплата */
interface QuarterlyPayout {
  quarterId: string;
  payoutDate: string;
  totalGoldGrams: number;
  totalPaxg: number;
  totalUsd: number;
  status: 'paid' | 'claimed' | 'reinvested';
  claimedDate?: string;
}
```

### Часть 2: Движок расчётов

Файл: `src/services/simulation/distributionEngine.ts`

```typescript
// Константы из whitepaper
const TOKEN_MINING_CAPACITY = 0.000004; // m³/hour
const GOLD_CONTENT = 0.1;              // g/m³  
const DAILY_OPERATING_HOURS = 16;
const OPEX_PER_M3 = 5.92;             // USD
const TROY_OUNCE_GRAMS = 31.1035;

// Таблица success fee
const SUCCESS_FEE_TABLE = {
  100:     { 6: 0.70, 12: 0.55, 24: 0.50, 36: 0.45, 48: 0.40 },
  1000:    { 6: 0.70, 12: 0.50, 24: 0.45, 36: 0.40, 48: 0.35 },
  5000:    { 6: 0.70, 12: 0.45, 24: 0.40, 36: 0.35, 48: 0.30 },
  10000:   { 6: null, 12: 0.40, 24: 0.35, 36: 0.30, 48: 0.27 },
  100000:  { 6: null, 12: 0.35, 24: 0.30, 36: 0.27, 48: 0.25 },
  1000000: { 6: null, 12: 0.30, 24: 0.27, 36: 0.25, 48: 0.20 },
};

/**
 * Вычислить дневное начисление для позиции
 */
function calculateDailyAccrual(
  numTokens: number,
  investmentUsd: number,
  termMonths: number,
  goldPriceUsd: number,  // цена за грамм
  paxgPriceUsd: number,
): Omit<DailyAccrual, 'date' | 'positionId' | 'quarterId'> {
  // 1. Gold production
  const goldProduction = numTokens * TOKEN_MINING_CAPACITY * GOLD_CONTENT * DAILY_OPERATING_HOURS;
  
  // 2. Costs in USD, then convert to grams
  const costsUsd = OPEX_PER_M3 * DAILY_OPERATING_HOURS * numTokens * TOKEN_MINING_CAPACITY;
  const costsGrams = costsUsd / goldPriceUsd;
  
  // 3. Reward before fee
  const rewardBeforeFee = goldProduction - costsGrams;
  
  // 4. Success fee
  const feeRate = getSuccessFeeRate(investmentUsd, termMonths);
  const successFeeGrams = Math.max(0, rewardBeforeFee * feeRate);
  
  // 5. Net reward
  const netGoldGrams = Math.max(0, rewardBeforeFee - successFeeGrams);
  const netPaxg = netGoldGrams / TROY_OUNCE_GRAMS;
  const netUsd = netGoldGrams * goldPriceUsd;
  
  return {
    goldProductionGrams: goldProduction,
    costsUsd,
    costsGrams,
    successFeeGrams,
    netGoldGrams,
    netPaxg,
    netUsd,
    goldPriceUsd,
    paxgPriceUsd,
  };
}

/**
 * Определить квартальные периоды для позиции
 * Кварталы отсчитываются от даты активации, НЕ от календарных Q1-Q4
 */
function generateQuarterlyPeriods(
  activationDate: Date,
  termMonths: number,
): QuarterlyPeriod[] {
  // Каждые 3 месяца от даты активации = 1 квартал
  // Пример: активация 28 января 2026
  //   Q1: 28 Jan → 27 Apr 2026, payout ~Apr 30
  //   Q2: 28 Apr → 27 Jul 2026, payout ~Jul 30
  //   Q3: 28 Jul → 27 Oct 2026, payout ~Oct 30
  //   Q4: 28 Oct → 27 Jan 2027, payout ~Jan 30
  // ...
}

/**
 * Сгенерировать все дневные начисления с даты активации до сегодня
 * + распределить по кварталам
 */
function generateAccrualHistory(
  position: Position,
  today: Date,
): { accruals: DailyAccrual[], quarters: QuarterlyPeriod[] } {
  // Итерировать по каждому дню от activationDate до today
  // Для каждого дня: calculateDailyAccrual(...)
  // Присвоить quarterId
  // Вариация: добавить ±5-10% случайного разброса к goldProduction для реалистичности
  //   (НЕ одинаковые числа каждый день — это выглядит как фейк)
}
```

### Часть 3: Обновление состояний на экранах

#### HOME — три состояния баланса

Текущее:
```
TOTAL RECEIVED: $60.53
DAILY DISTRIBUTION: $0.32/day
```

Новое (с учётом квартальных выплат):
```
TOTAL ACCRUED              ← ВСЕ начисления с момента старта (accrued + claimed + withdrawn)
$60.53
since you started · Dec 28, 2025
+$0.32 today · ↑ accruing daily

[Кольцо прогресса: X days to next payout]

PARTICIPATING              NEXT PAYOUT           ACCRUED THIS QUARTER
$300.00                    Apr 27, 2026          $14.72
                           in 27 days            ≈ 0.006g PAXG
                                                 Will be available for withdrawal
```

Ключевые изменения:
- "TOTAL RECEIVED" → "TOTAL ACCRUED" (начислено, не получено — пока не было payout)
- ИЛИ если был хотя бы 1 payout: "TOTAL RECEIVED" корректно, но нужно разделить:
  "Received: $45.81 (paid) + $14.72 (accruing)" 
- Кольцо прогресса: показывает дни до следующего payout (сейчас "29 days" — непонятно к чему)
- Новая карточка: "ACCRUED THIS QUARTER" — сколько накопилось в текущем квартале
- Подсказка на "ACCRUED THIS QUARTER": "These distributions are accruing daily. They will become available for withdrawal on your next payout date (Apr 27, 2026)."

#### POSITIONS — разделение accrued vs claimable

Текущее:
```
GOLD REWARDS: 0.00 g    [Withdraw] [Reinvest]
```

Новое:
```
AVAILABLE TO WITHDRAW           ACCRUING THIS QUARTER
0.00 PAXG                      0.006 PAXG ≈ $14.72
≈ $0.00                        Available after Apr 27, 2026
[Withdraw] [Reinvest]          [View accrual log →]
(disabled — grey)
```

Ключевые изменения:
- Два блока вместо одного: "Available" (claimable PAXG) + "Accruing" (текущий квартал)
- "Available" = $0 если ещё не было payout → кнопки disabled
- "Accruing" = сумма DailyAccrual за текущий квартал → с датой когда станет available
- При первом квартальном payout: сумма переходит из "Accruing" в "Available"

#### POSITIONS — карточка позиции

Текущее:
```
Distributed: $29.00
Next payout: Apr 27, 2026 · ~$4.60 estimated
```

Новое:
```
Accrued total    $29.00          ← всё что начислено за всё время
  Paid out       $0.00           ← (если был payout, показать сколько уже выплачено)
  This quarter   $14.72          ← текущий незавершённый квартал
Next payout      Apr 27, 2026 · ~$4.60 estimated
                 in 27 days [progress bar ████████░░ 70%]
```

#### EARN — калькулятор проекций

Обновить ProjectionCard:
```
ESTIMATED OUTPUT FOR 12 MONTHS

~1.56g of gold
≈ $190.16 at current gold price

Payout schedule     Quarterly (every 3 months)
First payout        Jun 29, 2026 (in ~90 days)
Payouts per year    4 × ~$47.54

Q1: ~$47.54   Q2: ~$47.54   Q3: ~$47.54   Q4: ~$47.54
    Jun '26       Sep '26       Dec '26       Mar '27
```

Добавить:
- Строка "Payout schedule: Quarterly (every 3 months)" с тултипом
- Визуальный таймлайн 4 кварталов с суммами
- Пояснение: "Distributions accrue daily. Payouts happen every 3 months from your activation date."

#### ACTIVITY — квартальные payout-события

Добавить новый тип транзакции в ленту Activity:
```
QUARTERLY PAYOUT                                    +$45.81
Apr 27, 2026 · 14:00 UTC
Q1 distributions (Jan 28 – Apr 27): 0.0185 PAXG credited to your balance
```
- Иконка: золотая монета или Calendar (отличать от обычных daily-записей)
- Цвет суммы: зелёный (--color-success)
- Это событие появляется раз в 3 месяца

#### DAILY REWARD LOG на Home — уточнение

Текущее: все строки выглядят одинаково (C4 из аудита)
Изменения:
1. Добавить случайную вариацию ±5-10% к goldProduction каждый день (реалистичность)
2. Добавить колонку "Status": 
   - "Accruing" (текущий квартал, ещё не выплачено) — бейдж жёлтый
   - "Paid" (прошлые кварталы, уже выплачено) — бейдж зелёный
3. Добавить разделитель между кварталами: "Q1 2026 · Jan 28 – Apr 27 · Payout: Apr 27"

### Часть 4: Обновление Zustand store

```typescript
// src/stores/distributionStore.ts

interface DistributionStore {
  // Состояние
  distributionState: DistributionState | null;
  isLoading: boolean;
  
  // Actions
  initialize: (positions: Position[]) => void;  // при загрузке дашборда
  getAccruedThisQuarter: () => { paxg: number; usd: number; goldGrams: number };
  getClaimableBalance: () => { paxg: number; usd: number };
  getTotalAccrued: () => { paxg: number; usd: number };
  getNextPayoutInfo: () => { date: string; daysRemaining: number; estimatedUsd: number; progressPercent: number };
  getDailyAccruals: (limit?: number) => DailyAccrual[];
  getQuarterlyHistory: () => QuarterlyPayout[];
  
  // Мутации (для симулятора)
  simulateQuarterlyPayout: () => void;  // Тестовая кнопка: симулировать наступление пayout-дня
  simulateWithdraw: (amount: number) => void;
  simulateReinvest: (amount: number) => void;
}
```

### Часть 5: Тестовые контролы симулятора

Добавить в Settings (или в dev-only панель):

```
[SIMULATOR CONTROLS] — видны только в dev-режиме или при специальном toggle

"Simulate quarterly payout"  [Trigger] — выполняет payout текущего квартала
"Advance time +30 days"      [Trigger] — сдвигает симулятор на месяц вперёд
"Reset simulation"           [Trigger] — сброс к начальному состоянию
```

Это позволит демонстрировать полный цикл: accrual → payout → claim → withdraw.

### Часть 6: Обновить мок-данные

Файл: `src/services/mock/data/distributions.ts`

Сгенерировать мок-историю для текущего пользователя:
- Активация: Dec 28, 2025
- Сегодня: Mar 1, 2026 (день 63)
- Первый квартал: Dec 28 – Mar 27, 2026 (ещё идёт, 63/90 дней = 70%)
- Payout Q1 запланирован: ~Mar 30, 2026
- Каждый день: вариативные начисления (±5-10% от базы)
- Gold price: берём текущий ~$92/g (≈ $2,860/oz) с небольшой вариацией по дням
- PAXG price: ~$5,192 (из навбара)

Результат мока:
- 63 записи DailyAccrual с реалистичной вариацией
- 1 QuarterlyPeriod со статусом 'accruing'
- Accrued total: ~$60 (соответствует текущим данным на Home)
- Claimable: $0 (ещё не было ни одного payout)
- Next payout: ~27 дней

### Валидация после реализации

- [ ] Home: кольцо показывает "27 days to payout" с процентом заполнения квартала
- [ ] Home: Total показывает "accrued" с пометкой что это ещё не выплачено
- [ ] Home: Daily log имеет вариацию в числах (НЕ одинаковые строки)
- [ ] Home: Daily log имеет колонку Status (Accruing / Paid)
- [ ] Positions: "GOLD REWARDS" разделено на Available ($0) и Accruing ($14.72)
- [ ] Positions: кнопки Withdraw/Reinvest disabled при Available = 0
- [ ] Positions: карточка показывает breakdown по кварталам
- [ ] Earn: ProjectionCard показывает квартальный график 4 payouts
- [ ] Earn: "Payout schedule: Quarterly" строка с объяснением
- [ ] Activity: готов тип транзакции "Quarterly Payout" (появится после первого payout)
- [ ] Simulator controls: можно триггернуть payout для демо
- [ ] Все числа сходятся: sum(dailyAccruals) = totalAccrued = значение на Home
```

---

## Обновления к существующим спринтам

Помимо нового Sprint 1.5, нужно обновить промты в уже существующих спринтах. Ниже — дополнения.

---

### Дополнение к Sprint 3 (Home-экран)

Добавить в начало промта Sprint 3:

```
### ВАЖНО: Sprint 1.5 (Quarterly Payouts) должен быть выполнен ДО этого спринта.

Home-экран теперь использует distributionStore для данных. Обнови:

1. Hero-карточка "TOTAL RECEIVED $60.53":
   - Если claimable + withdrawn > 0: лейбл "TOTAL RECEIVED", значение = withdrawn.totalUsd + claimable.totalUsd
   - Если нет ни одного payout: лейбл "TOTAL ACCRUED", значение = totalAccrued
   - Подпись: "Accruing daily · Next payout in {days} days"

2. Кольцо прогресса:
   - Заполнение = getNextPayoutInfo().progressPercent
   - Центр: "{days} days to payout" (не просто "29 days")
   - Цвет: gold gradient при > 80% (скоро payout!)

3. Правая панель StatCards:
   - Заменить статичную карточку "NEXT PAYOUT Apr 27, 2026" на динамическую:
     distributionStore.getNextPayoutInfo() → дата + обратный отсчёт
   - Добавить 4-ю карточку (или заменить одну): "THIS QUARTER" → getAccruedThisQuarter().usd
     с подписью "accruing · not yet paid out"

4. Daily reward log:
   - Данные из distributionStore.getDailyAccruals(7) вместо мок-массива
   - Числа с вариацией (из движка)
   - Колонка Status если mining details раскрыты
```

---

### Дополнение к Sprint 4 (Earn)

Добавить в промт Sprint 4:

```
### Дополнение: Квартальный график в ProjectionCard

В калькуляторе Earn, секция "PROJECTED OUTPUT FOR 12 MONTHS":

1. Добавить строку:
   "Payout schedule    Quarterly (every 3 months)"
   с иконкой Calendar и тултипом: "Distributions accrue daily from activation. 
   Every 3 months, accumulated distributions are released to your balance for withdrawal."

2. Добавить визуальный таймлайн payouts:
   Для 12-месячного срока показать 4 квартала:
   
   [Таймлайн: 4 точки на горизонтальной линии]
   Q1          Q2          Q3          Q4
   ~$47.54     ~$47.54     ~$47.54     ~$47.54
   Jun '26     Sep '26     Dec '26     Mar '27
   
   - Дизайн: горизонтальная линия, 4 circle-точки, суммы под ними
   - Адаптивный: на мобиле — вертикальная линия
   - Суммы рассчитываются через distributionEngine

3. Изменить строку "First payout":
   "First payout    Jun 29, 2026 (in ~90 days)"
   + подпись: "Your distributions accrue from day one but are paid out quarterly"
```

---

### Дополнение к Sprint 5 (Positions)

Добавить в промт Sprint 5:

```
### Дополнение: Разделение Available vs Accruing

В верхней панели Positions-страницы:

Текущее:
  AVAILABLE $0.00 [Participate]
  GOLD REWARDS 0.00g [Withdraw] [Restake]

Новое — 3 блока:
  POSITION VALUE        AVAILABLE TO WITHDRAW       ACCRUING THIS QUARTER
  $300.00               0.00 PAXG ≈ $0.00           0.006 PAXG ≈ $14.72
  2 active positions    [Withdraw] [Reinvest]       Available after Apr 27
  All time accrued:     (disabled при $0)           [View details →]
  $60.53

Логика:
- "AVAILABLE TO WITHDRAW" = distributionStore.getClaimableBalance()
  Это PAXG, который уже прошёл quarterly payout и доступен для withdraw/reinvest
- "ACCRUING THIS QUARTER" = distributionStore.getAccruedThisQuarter()
  Это PAXG, который копится в текущем квартале (ежедневные начисления)
  С датой когда станет available

Кнопки Withdraw/Reinvest:
- enabled: когда claimable.totalPaxg > 0
- disabled: когда claimable.totalPaxg === 0
  Hover на disabled: "No distributions available for withdrawal yet. Your next quarterly payout is on {date}."
```

---

## Обновлённый порядок спринтов

| # | Спринт | Срок | Статус |
|---|--------|------|--------|
| 1 | Compliance Sweep | 1 день | ✅ Выполнен |
| **1.5** | **Quarterly Payout Engine** | **2–3 дня** | **← СЛЕДУЮЩИЙ** |
| 2 | Value Flow Explainer | 1–2 дня | |
| 3 | Home-экран (+ quarterly UI) | 2–3 дня | |
| 4 | Earn (+ quarterly timeline) | 1–2 дня | |
| 5 | Activity + Positions (+ available/accruing split) | 2 дня | |
| 6 | Trust Layer | 3–5 дней | |

Sprint 1.5 идёт первым после Compliance, потому что все остальные спринты (Home, Earn, Positions) зависят от движка расчётов и типов данных из distributionStore.

---

## Обновлённый чеклист

Добавить к финальному чеклисту:

- [ ] distributionEngine корректно считает по формуле из whitepaper
- [ ] Success fee rates соответствуют таблице из Tokenomics
- [ ] Daily accruals имеют вариацию ±5-10% (НЕ одинаковые строки)
- [ ] Home: ring показывает прогресс квартала + дни до payout
- [ ] Home: "Total" корректно разделяет accrued/received
- [ ] Positions: Available vs Accruing — два отдельных блока
- [ ] Earn: ProjectionCard показывает квартальный таймлайн
- [ ] Activity: тип "Quarterly Payout" в ленте
- [ ] sum(dailyAccruals) = totalAccrued на всех экранах
- [ ] Simulator controls работают: trigger payout, advance time
