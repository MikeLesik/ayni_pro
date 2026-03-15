# Промт для Claude Code: Реализовать Withdraw и Reinvest

Скопируй и отправь в Claude Code.

---

```
## Задача

В simulation engine кабинета AYNI Gold не работают две функции: Withdraw и Reinvest.
Нужно реализовать полную механику обеих в simulationStore, mockApi и подключить к UI.

---

## 1. Withdraw PAXG

### Логика в simulationStore

Добавь или исправь action `withdrawPaxg`:

```typescript
withdrawPaxg: (amount: number) => {
  const state = get();
  
  // Валидация
  if (amount <= 0) throw new Error('Amount must be positive');
  if (amount > state.balances.paxgBalance) throw new Error('Insufficient PAXG balance');
  
  // Списать с баланса
  set(prev => ({
    balances: {
      ...prev.balances,
      paxgBalance: prev.balances.paxgBalance - amount,
    },
    activities: [
      {
        id: crypto.randomUUID(),
        type: 'withdraw',
        timestamp: prev.simulationDate,
        title: 'PAXG Withdrawal',
        description: `Withdrawn ${amount.toFixed(8)} PAXG (~$${(amount * prev.prices.paxgUsd).toFixed(2)}) to external wallet`,
        amount: {
          value: amount * prev.prices.paxgUsd,
          currency: 'PAXG',
          direction: 'out',
        },
      },
      ...prev.activities,
    ],
  }));
}
```

### Withdraw AYNI (свободные, не застейканные)

Добавь action `withdrawAyni`:

```typescript
withdrawAyni: (amount: number) => {
  const state = get();
  
  if (amount <= 0) throw new Error('Amount must be positive');
  if (amount > state.balances.ayniAvailable) throw new Error('Insufficient available AYNI');
  
  set(prev => ({
    balances: {
      ...prev.balances,
      ayniAvailable: prev.balances.ayniAvailable - amount,
    },
    activities: [
      {
        id: crypto.randomUUID(),
        type: 'withdraw',
        timestamp: prev.simulationDate,
        title: 'AYNI Withdrawal',
        description: `Withdrawn ${amount.toFixed(4)} AYNI (~$${(amount * prev.prices.ayniUsd).toFixed(2)}) to external wallet`,
        amount: {
          value: amount * prev.prices.ayniUsd,
          currency: 'AYNI',
          direction: 'out',
        },
      },
      ...prev.activities,
    ],
  }));
}
```

---

## 2. Reinvest PAXG → AYNI → Stake

### Логика в simulationStore

Reinvest = конвертация PAXG в AYNI по текущим ценам + автоматический стейк.

Добавь или исправь action `reinvest`:

```typescript
reinvest: (paxgAmount: number, termMonths: number): string => {
  const state = get();
  
  // Валидация
  if (paxgAmount <= 0) throw new Error('Amount must be positive');
  if (paxgAmount > state.balances.paxgBalance) throw new Error('Insufficient PAXG balance');
  if (termMonths < 6 || termMonths > 48) throw new Error('Invalid term');
  
  // ── КОНВЕРТАЦИЯ PAXG → AYNI (внутри платформы) ──────────
  // 
  // Механика: платформа конвертирует PAXG в AYNI по текущим ценам
  // с комиссией за конвертацию (swap fee).
  // Это НЕ рыночный обмен — это внутренняя операция Ayni.
  //
  // Формула:
  // 1. paxgAmount × paxgPrice = grossUsd
  // 2. grossUsd × (1 - swapFeeRate) = netUsd (после комиссии)
  // 3. netUsd / ayniPrice = ayniAmount
  
  const SWAP_FEE_RATE = 0.015; // 1.5% комиссия за конвертацию PAXG→AYNI
  
  const grossUsd = paxgAmount * state.prices.paxgUsd;
  const swapFeeUsd = grossUsd * SWAP_FEE_RATE;
  const netUsd = grossUsd - swapFeeUsd;
  
  // Минимум $100 для стейкинга (проверяем по net, после комиссии)
  if (netUsd < 100) {
    throw new Error(
      `Minimum investment is $100 after conversion fee (1.5%). ` +
      `Your PAXG is worth ~$${grossUsd.toFixed(2)}, after fee: ~$${netUsd.toFixed(2)}`
    );
  }
  
  const ayniAmount = netUsd / state.prices.ayniUsd;
  
  // ── СОЗДАНИЕ ПОЗИЦИИ ────────────────────────────────────
  const positionId = crypto.randomUUID();
  const startDate = state.simulationDate;
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + termMonths);
  
  const successFeeRate = getSuccessFeeRate(netUsd, termMonths);
  
  const firstPayout = new Date(startDate);
  firstPayout.setMonth(firstPayout.getMonth() + 3);
  
  set(prev => ({
    balances: {
      ...prev.balances,
      paxgBalance: prev.balances.paxgBalance - paxgAmount,
      ayniStaked: prev.balances.ayniStaked + ayniAmount,
    },
    positions: [
      ...prev.positions,
      {
        id: positionId,
        status: 'active',
        createdAt: prev.simulationDate,
        startDate: prev.simulationDate,
        endDate: endDate.toISOString(),
        termMonths,
        investedUsd: netUsd,
        ayniStaked: ayniAmount,
        successFeeRate,
        dailyRewards: [],
        totalEarnedPaxg: 0,
        totalEarnedUsd: 0,
        totalClaimedPaxg: 0,
        nextPayoutDate: firstPayout.toISOString(),
        payouts: [],
        // Метаданные конвертации (для отображения в UI)
        source: 'reinvest',
        conversionDetails: {
          paxgSpent: paxgAmount,
          grossUsd,
          swapFeeUsd,
          swapFeeRate: SWAP_FEE_RATE,
          netUsd,
          ayniReceived: ayniAmount,
          ayniPrice: prev.prices.ayniUsd,
          paxgPrice: prev.prices.paxgUsd,
        },
      },
    ],
    activities: [
      {
        id: crypto.randomUUID(),
        type: 'reinvest',
        timestamp: prev.simulationDate,
        title: 'Reinvested Rewards',
        description: `Converted ${paxgAmount.toFixed(8)} PAXG ($${grossUsd.toFixed(2)}) → ${ayniAmount.toFixed(4)} AYNI (fee: $${swapFeeUsd.toFixed(2)}), staked for ${termMonths} months`,
        amount: {
          value: netUsd,
          currency: 'AYNI',
          direction: 'in',
        },
      },
      ...prev.activities,
    ],
  }));
  
  return positionId;
}
```

---

## 3. Mock API endpoints

В `mockApi.ts` добавь/исправь:

```typescript
// POST /api/portfolio/reinvest
async reinvest(req: { amountPaxg: number; termMonths: number }): Promise<{
  newPositionId: string;
  paxgConverted: number;
  grossUsd: number;
  swapFeeUsd: number;
  swapFeeRate: number;
  netUsd: number;
  ayniReceived: number;
  status: string;
}> {
  const state = useSimulationStore.getState();
  const SWAP_FEE_RATE = 0.015;
  const grossUsd = req.amountPaxg * state.prices.paxgUsd;
  const swapFeeUsd = grossUsd * SWAP_FEE_RATE;
  const netUsd = grossUsd - swapFeeUsd;
  const ayniAmount = netUsd / state.prices.ayniUsd;
  
  const positionId = state.reinvest(req.amountPaxg, req.termMonths);
  
  return {
    newPositionId: positionId,
    paxgConverted: req.amountPaxg,
    grossUsd,
    swapFeeUsd,
    swapFeeRate: SWAP_FEE_RATE,
    netUsd,
    ayniReceived: ayniAmount,
    status: 'confirmed',
  };
},

// POST /api/portfolio/withdraw-paxg
async withdrawPaxg(req: { amount: number }): Promise<{ status: string }> {
  useSimulationStore.getState().withdrawPaxg(req.amount);
  return { status: 'confirmed' };
},

// POST /api/portfolio/withdraw-ayni
async withdrawAyni(req: { amount: number }): Promise<{ status: string }> {
  useSimulationStore.getState().withdrawAyni(req.amount);
  return { status: 'confirmed' };
},
```

---

## 4. Подключение к UI

### Portfolio — Gold Rewards секция (Reinvest кнопка)

Найди кнопку "Reinvest" в Portfolio (обычно рядом с Gold Rewards / PAXG balance).
При клике — открыть модалку:

```tsx
// ReinvestModal
function ReinvestModal({ open, onClose, paxgBalance, prices }) {
  const [termMonths, setTermMonths] = useState(12);
  
  const SWAP_FEE_RATE = 0.015; // 1.5%
  const grossUsd = paxgBalance * prices.paxgUsd;
  const swapFeeUsd = grossUsd * SWAP_FEE_RATE;
  const netUsd = grossUsd - swapFeeUsd;
  const ayniAmount = netUsd / prices.ayniUsd;
  const isBelowMinimum = netUsd < 100; // проверяем после комиссии
  
  const projection = !isBelowMinimum
    ? calculateProjection(netUsd, termMonths, prices.ayniUsd, prices.goldPerGram, prices.paxgUsd)
    : null;

  const handleReinvest = async () => {
    await mockApi.reinvest({ amountPaxg: paxgBalance, termMonths });
    queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Reinvest Rewards">
      {/* Conversion breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">Your PAXG rewards</span>
          <span>{paxgBalance.toFixed(8)} PAXG</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Value</span>
          <span>${grossUsd.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-muted">
          <span>Conversion fee (1.5%)</span>
          <span>−${swapFeeUsd.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border-light font-medium">
          <span className="text-text-secondary">You receive</span>
          <span className="text-text-primary">
            {ayniAmount.toFixed(4)} AYNI (~${netUsd.toFixed(2)})
          </span>
        </div>
      </div>

      <p className="text-xs text-text-muted mt-2">
        PAXG is converted to AYNI inside the platform at current market rates.
        A 1.5% conversion fee is applied.
      </p>

      {/* Minimum warning */}
      {isBelowMinimum && (
        <div className="mt-3 p-3 bg-warning-light rounded-lg text-sm text-warning flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Minimum staking amount is $100 after conversion fee.
            Your PAXG converts to ~${netUsd.toFixed(2)}.
            Need ~${(100 - netUsd).toFixed(2)} more to reinvest.
          </span>
        </div>
      )}

      {/* Term selector + projection — only if above minimum */}
      {!isBelowMinimum && (
        <>
          <div className="mt-4">
            <label className="text-sm text-text-secondary">Staking term</label>
            {/* Reuse Slider or Tabs with 6/12/24/36/48 options */}
          </div>

          {projection && (
            <div className="mt-3 p-3 bg-gold-light rounded-lg text-sm">
              <div className="flex justify-between">
                <span>Estimated daily earning</span>
                <span className="font-medium">${projection.dailyRewardUsd.toFixed(4)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Annual return</span>
                <span className="font-medium text-success">~{projection.annualReturnPercent.toFixed(1)}%</span>
              </div>
            </div>
          )}
        </>
      )}

      <Button
        variant="primary"
        fullWidth
        onClick={handleReinvest}
        disabled={isBelowMinimum}
        className="mt-4"
      >
        {isBelowMinimum
          ? `Minimum $100 required (~$${(100 - netUsd).toFixed(2)} more needed)`
          : `Reinvest ${paxgBalance.toFixed(6)} PAXG → ${ayniAmount.toFixed(2)} AYNI`
        }
      </Button>
    </Modal>
  );
}
```

### Portfolio — Completed Position (Withdraw кнопка)

Найди кнопку "Withdraw" на completed позициях или в wallet секции.
При клике — модалка выбора что выводить:

```tsx
// WithdrawModal
function WithdrawModal({ open, onClose, ayniAvailable, paxgBalance, prices }) {
  const [tab, setTab] = useState<'ayni' | 'paxg'>('ayni');
  const [amount, setAmount] = useState('');

  const handleWithdraw = async () => {
    if (tab === 'ayni') {
      await mockApi.withdrawAyni({ amount: parseFloat(amount) });
    } else {
      await mockApi.withdrawPaxg({ amount: parseFloat(amount) });
    }
    queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Withdraw to Wallet">
      <Tabs value={tab} onChange={setTab} options={[
        { value: 'ayni', label: `AYNI (${ayniAvailable.toFixed(2)})` },
        { value: 'paxg', label: `PAXG (${paxgBalance.toFixed(6)})` },
      ]} />

      <div className="mt-4">
        <Input
          label={`Amount (${tab.toUpperCase()})`}
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          helper={tab === 'ayni'
            ? `Available: ${ayniAvailable.toFixed(4)} AYNI (~$${(ayniAvailable * prices.ayniUsd).toFixed(2)})`
            : `Available: ${paxgBalance.toFixed(8)} PAXG (~$${(paxgBalance * prices.paxgUsd).toFixed(2)})`
          }
        />
        <button
          className="text-xs text-primary mt-1"
          onClick={() => setAmount(tab === 'ayni' ? ayniAvailable.toString() : paxgBalance.toString())}
        >
          Max
        </button>
      </div>

      <div className="mt-3 p-3 bg-bg-secondary rounded-lg text-xs text-text-muted">
        Tokens will be sent to your connected external wallet.
        Make sure your wallet supports ERC-20 tokens.
      </div>

      <Button
        variant="primary"
        fullWidth
        onClick={handleWithdraw}
        disabled={!amount || parseFloat(amount) <= 0}
        className="mt-4"
      >
        Withdraw {amount || '0'} {tab.toUpperCase()}
      </Button>
    </Modal>
  );
}
```

---

## 5. Проверь что кнопки подключены

Найди все места в коде где есть кнопки Withdraw и Reinvest (поиск по "withdraw", "reinvest", "onWithdraw", "onReinvest") и убедись что:

- onClick вызывает открытие соответствующей модалки
- После успешного action — invalidate все связанные TanStack Query ключи: 
  'dashboard', 'portfolio', 'activity'
- Показать toast/notification об успехе
- Модалки закрываются после action
- Балансы обновляются на всех экранах (Home, Portfolio)

---

## 6. Simulation Panel — добавь quick actions

В SimulationPanel добавь кнопки для быстрого тестирования:

```tsx
[🔄 Reinvest All PAXG (12mo)]  // reinvest(paxgBalance, 12)
[📤 Withdraw All AYNI]          // withdrawAyni(ayniAvailable)
[📤 Withdraw All PAXG]          // withdrawPaxg(paxgBalance)
```

---

## Порядок

1. Добавь actions в simulationStore (withdrawPaxg, withdrawAyni, reinvest)
2. Добавь endpoints в mockApi
3. Создай/исправь ReinvestModal и WithdrawModal компоненты
4. Подключи модалки к кнопкам в Portfolio
5. Добавь quick actions в SimulationPanel
6. Проверь что балансы корректно обновляются после каждого action
```
