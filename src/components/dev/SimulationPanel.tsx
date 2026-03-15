import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSimulationStore } from '@/stores/simulation';
import { useDistributionStore } from '@/stores/distributionStore';
import { useMineStore } from '@/stores/mineStore';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { formatCurrency, formatNumber, formatDate } from '@/lib/formatters';
import {
  Settings,
  ChevronDown,
  ChevronUp,
  Play,
  FastForward,
  SkipForward,
  RefreshCw,
  Copy,
  Database,
  DollarSign,
  X,
} from 'lucide-react';
import { PriceInput, StateRow, VisibilityToggles } from './SimulationPanelControls';
import { GamificationSection, QuarterlySection } from './SimulationPanelSections';

export function SimulationPanel() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const queryClient = useQueryClient();

  const {
    simulationDate,
    balances,
    positions,
    prices,
    _initialized,
    advanceDay,
    advanceDays,
    advanceToNextPayout,
    topUp,
    updatePrices,
    resetSimulation,
    initWithDemoData,
  } = useSimulationStore();

  const activeCount = positions.filter((p) => p.status === 'active').length;
  const completedCount = positions.filter((p) => p.status === 'completed').length;

  const distStore = useDistributionStore();
  const mineStore = useMineStore();

  const invalidate = useCallback(() => {
    distStore.refresh();
    mineStore.refresh();
    queryClient.invalidateQueries();
  }, [queryClient, distStore, mineStore]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
          return;
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const doAction = (fn: () => void) => {
    fn();
    invalidate();
  };

  const handleAdvanceDay = () => doAction(advanceDay);
  const handleAdvance7 = () => doAction(() => advanceDays(7));
  const handleAdvance30 = () => doAction(() => advanceDays(30));
  const handleNextPayout = () => doAction(advanceToNextPayout);
  const handleTopUp500 = () => doAction(() => topUp(500));
  const handleTopUp5000 = () => doAction(() => topUp(5000));

  const handleBuy1000 = () => {
    const state = useSimulationStore.getState();
    const cost = 1000 * state.prices.ayniUsd;
    if (state.balances.usdBalance < cost) state.topUp(cost);
    state.buyAyni(cost);
    invalidate();
  };

  const handleCompleteFirst = () => {
    const state = useSimulationStore.getState();
    const firstActive = state.positions.find((p) => p.status === 'active');
    if (firstActive) state.forceCompletePosition(firstActive.id);
    invalidate();
  };

  const handleStakeAll = () => {
    const state = useSimulationStore.getState();
    if (state.balances.ayniAvailable > 0) {
      state.createPosition({
        ayniAmount: state.balances.ayniAvailable,
        amountUsd: state.balances.ayniAvailable * state.prices.ayniUsd,
        termMonths: 12,
        autoActivate: true,
      });
    }
    invalidate();
  };

  const handleReinvestAll = () => {
    const state = useSimulationStore.getState();
    if (state.balances.paxgBalance > 0) {
      try {
        state.reinvest(state.balances.paxgBalance, 12);
      } catch {
        // silently ignore if below minimum
      }
    }
    invalidate();
  };

  const handleWithdrawAllAyni = () => {
    const state = useSimulationStore.getState();
    if (state.balances.ayniAvailable > 0) state.withdrawAyni(state.balances.ayniAvailable);
    invalidate();
  };

  const handleWithdrawAllPaxg = () => {
    const state = useSimulationStore.getState();
    if (state.balances.paxgBalance > 0) state.withdrawPaxg(state.balances.paxgBalance);
    invalidate();
  };

  const handleReset = () => {
    resetSimulation();
    useMineStore.getState().resetGameData();
    useOnboardingStore.getState().resetOnboarding();
    localStorage.removeItem('onboarding_completed');
    useAuthStore.getState().logout();
    invalidate();
  };

  const handleLoadDemo = () => {
    initWithDemoData();
    invalidate();
  };

  const handleExport = () => {
    const state = useSimulationStore.getState();
    const json = JSON.stringify(
      {
        user: state.user,
        balances: state.balances,
        positions: state.positions,
        activities: state.activities,
        prices: state.prices,
        simulationDate: state.simulationDate,
      },
      null,
      2,
    );
    navigator.clipboard.writeText(json);
  };

  const [priceInputs, setPriceInputs] = useState({
    ayni: prices.ayniUsd.toString(),
    paxg: prices.paxgUsd.toString(),
    gold: prices.goldPerGram.toString(),
  });

  useEffect(() => {
    setPriceInputs({
      ayni: prices.ayniUsd.toString(),
      paxg: prices.paxgUsd.toString(),
      gold: prices.goldPerGram.toFixed(2),
    });
  }, [prices]);

  const handlePriceChange = (key: 'ayni' | 'paxg' | 'gold', value: string) => {
    setPriceInputs((p) => ({ ...p, [key]: value }));
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      const update: Record<string, number> = {};
      if (key === 'ayni') update.ayniUsd = num;
      if (key === 'paxg') update.paxgUsd = num;
      if (key === 'gold') update.goldPerGram = num;
      updatePrices(update);
      invalidate();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 lg:bottom-4 left-4 z-[9999] w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg hover:bg-amber-700 transition-colors"
        title="Simulation Controls (`)"
      >
        <Settings size={18} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 z-[9999] w-[340px] bg-gray-900 text-gray-100 rounded-xl shadow-2xl border border-gray-700 text-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Settings size={14} className="text-amber-400" />
          <span className="font-semibold text-amber-400 text-[11px] uppercase tracking-wider">
            Simulation
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCollapsed((c) => !c)} className="p-1 hover:bg-gray-700 rounded">
            {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-700 rounded">
            <X size={14} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-3 max-h-[70vh] overflow-y-auto">
          <div className="text-center">
            <span className="text-gray-400 text-[10px]">Simulation Date</span>
            <div className="text-sm font-medium text-white">{formatDate(simulationDate)}</div>
          </div>

          {/* Time controls */}
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
              Time Controls
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <button onClick={handleAdvanceDay} className="sim-btn">
                <Play size={12} /> +1d
              </button>
              <button onClick={handleAdvance7} className="sim-btn">
                <FastForward size={12} /> +7d
              </button>
              <button onClick={handleAdvance30} className="sim-btn">
                <FastForward size={12} /> +30d
              </button>
              <button onClick={handleNextPayout} className="sim-btn">
                <SkipForward size={12} /> Payout
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
              Quick Actions
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button onClick={handleTopUp500} className="sim-btn">
                <DollarSign size={12} /> +$500
              </button>
              <button onClick={handleTopUp5000} className="sim-btn">
                <DollarSign size={12} /> +$5,000
              </button>
              <button onClick={handleBuy1000} className="sim-btn">
                Buy 1K AYNI
              </button>
              <button
                onClick={handleStakeAll}
                className="sim-btn"
                disabled={balances.ayniAvailable <= 0}
              >
                Activate All
              </button>
              <button onClick={handleCompleteFirst} className="sim-btn" disabled={activeCount <= 0}>
                Complete Pos
              </button>
            </div>
          </div>

          {/* Withdraw / Reinvest */}
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
              Withdraw / Reinvest
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                onClick={handleReinvestAll}
                className="sim-btn"
                disabled={balances.paxgBalance <= 0}
              >
                Reinvest All PAXG (12mo)
              </button>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={handleWithdrawAllAyni}
                  className="sim-btn"
                  disabled={balances.ayniAvailable <= 0}
                >
                  Withdraw AYNI
                </button>
                <button
                  onClick={handleWithdrawAllPaxg}
                  className="sim-btn"
                  disabled={balances.paxgBalance <= 0}
                >
                  Withdraw PAXG
                </button>
              </div>
            </div>
          </div>

          {/* Prices */}
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
              Prices (editable)
            </div>
            <div className="space-y-1.5">
              <PriceInput
                label="AYNI"
                value={priceInputs.ayni}
                onChange={(v) => handlePriceChange('ayni', v)}
              />
              <PriceInput
                label="PAXG"
                value={priceInputs.paxg}
                onChange={(v) => handlePriceChange('paxg', v)}
              />
              <PriceInput
                label="Gold/g"
                value={priceInputs.gold}
                onChange={(v) => handlePriceChange('gold', v)}
              />
            </div>
          </div>

          <QuarterlySection invalidate={invalidate} />

          {/* State summary */}
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
              Wallet State
            </div>
            <div className="bg-gray-800 rounded-lg p-2.5 space-y-1 text-[11px]">
              <StateRow label="USD" value={formatCurrency(balances.usdBalance)} />
              <StateRow
                label="AYNI"
                value={`${formatNumber(balances.ayniActivated)} locked + ${formatNumber(balances.ayniAvailable)} free`}
              />
              <StateRow label="PAXG" value={`${balances.paxgBalance.toFixed(6)} unclaimed`} />
              <StateRow label="PAXG (claimed)" value={balances.paxgClaimed.toFixed(6)} />
              <StateRow
                label="Positions"
                value={`${activeCount} active, ${completedCount} completed`}
              />
            </div>
          </div>

          <VisibilityToggles />
          <GamificationSection />

          {/* Actions */}
          <div className="flex gap-1.5">
            <button
              onClick={handleLoadDemo}
              className="sim-btn flex-1 !bg-amber-700 hover:!bg-amber-600"
            >
              <Database size={12} /> Load Demo
            </button>
            <button onClick={handleReset} className="sim-btn flex-1 !bg-red-800 hover:!bg-red-700">
              <RefreshCw size={12} /> Reset
            </button>
            <button onClick={handleExport} className="sim-btn flex-1">
              <Copy size={12} /> Export
            </button>
          </div>

          {!_initialized && (
            <div className="text-center text-amber-400 text-[10px] bg-amber-900/30 rounded-lg py-2 px-3">
              No simulation data. Click "Load Demo" to seed demo data.
            </div>
          )}
        </div>
      )}

      <style>{`
        .sim-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 8px;
          background: #374151;
          border: 1px solid #4B5563;
          border-radius: 6px;
          color: #E5E7EB;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .sim-btn:hover {
          background: #4B5563;
        }
        .sim-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
