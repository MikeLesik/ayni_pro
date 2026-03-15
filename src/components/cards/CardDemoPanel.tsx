import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { useCardStore } from '@/stores/cardStore';
import type { CardLifecycle, PhysicalCardState } from '@/stores/cardStore';
import { useSimulationStore } from '@/stores/simulation';

const LIFECYCLE_OPTIONS: CardLifecycle[] = [
  'not_eligible', 'eligible',
  'kyc_step_1', 'kyc_step_2', 'kyc_step_3', 'kyc_step_4',
  'kyc_submitted', 'kyc_in_review', 'kyc_approved', 'card_issuing',
  'active', 'frozen', 'blocked',
];

const PHYSICAL_OPTIONS: PhysicalCardState[] = [
  'not_eligible', 'eligible', 'requested', 'production', 'shipped', 'delivered', 'active',
];

const TIER_AYNI: Record<string, number> = {
  explorer: 0,
  contributor: 5000,
  operator: 25000,
  principal: 100000,
};

const DEMO_MERCHANTS = [
  { name: 'Amazon EU', category: 'Online Shopping' },
  { name: 'Uber Eats', category: 'Food Delivery' },
  { name: 'Starbucks', category: 'Dining' },
  { name: 'ATM Multibanco', category: 'Cash Withdrawal' },
  { name: 'Apple Store', category: 'Digital Services' },
  { name: 'Zara', category: 'Clothing' },
  { name: 'Netflix', category: 'Entertainment' },
  { name: 'Shell', category: 'Transport' },
];

export function CardDemoPanel() {
  const [open, setOpen] = useState(false);
  const [lastResult, setLastResult] = useState('');

  const lifecycle = useCardStore((s) => s.lifecycle);
  const physicalCard = useCardStore((s) => s.physicalCard);
  const cardBalance = useCardStore((s) => s.cardBalance);
  const paxgAvailable = useCardStore((s) => s.paxgAvailable);
  const goldPriceEur = useCardStore((s) => s.goldPriceEur);
  const demoMode = useCardStore((s) => s.demoMode);

  const setLifecycle = useCardStore((s) => s.setLifecycle);
  const setPhysicalCard = useCardStore((s) => s.setPhysicalCard);
  const setCardBalance = useCardStore((s) => s.setCardBalance);
  const addPaxg = useCardStore((s) => s.addPaxg);
  const setGoldPrice = useCardStore((s) => s.setGoldPrice);
  const spend = useCardStore((s) => s.spend);
  const resetAll = useCardStore((s) => s.resetAll);

  // Check visibility
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const showPanel = demoMode || searchParams?.get('card-demo') === 'true';

  if (!showPanel) return null;

  function simulatePurchase() {
    const merchant = DEMO_MERCHANTS[Math.floor(Math.random() * DEMO_MERCHANTS.length)];
    const amount = Math.round((5 + Math.random() * 495) * 100) / 100;
    const result = spend(merchant.name, amount, merchant.category);
    if (result.success) {
      setLastResult(`\u2713 €${amount.toFixed(2)} at ${merchant.name}`);
    } else {
      setLastResult(`\u2717 Declined: ${result.error}`);
    }
  }

  function setTierOverride(tier: string) {
    const ayni = TIER_AYNI[tier] ?? 0;
    // Set balances in simulation store to match the tier
    const state = useSimulationStore.getState();
    if (state.balances) {
      useSimulationStore.setState({
        balances: { ...state.balances, ayniActivated: ayni },
      });
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gray-900 text-white rounded-xl shadow-2xl w-[320px] p-4 text-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gold">Card Demo Panel</span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Lifecycle */}
              <DemoSelect
                label="Lifecycle"
                value={lifecycle}
                options={LIFECYCLE_OPTIONS}
                onChange={(v) => setLifecycle(v as CardLifecycle)}
              />

              {/* Physical card */}
              <DemoSelect
                label="Physical Card"
                value={physicalCard}
                options={PHYSICAL_OPTIONS}
                onChange={(v) => setPhysicalCard(v as PhysicalCardState)}
              />

              {/* Tier override */}
              <DemoSelect
                label="Tier Override"
                value=""
                options={['explorer', 'contributor', 'operator', 'principal']}
                onChange={setTierOverride}
              />

              {/* PAXG */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider">PAXG balance</label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => addPaxg(-0.01)}
                    className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-mono">{paxgAvailable.toFixed(3)}</span>
                  <button
                    onClick={() => addPaxg(0.01)}
                    className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                  >
                    +
                  </button>
                  <button
                    onClick={() => addPaxg(1)}
                    className="text-[10px] px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                  >
                    +1
                  </button>
                </div>
              </div>

              {/* Card balance */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider">Card balance (€)</label>
                <input
                  type="number"
                  value={cardBalance.toFixed(2)}
                  onChange={(e) => setCardBalance(Number(e.target.value))}
                  className="w-full mt-1 h-8 px-2 rounded bg-gray-700 text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              {/* Gold price */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider">Gold price (€/oz)</label>
                <input
                  type="number"
                  value={goldPriceEur}
                  onChange={(e) => setGoldPrice(Number(e.target.value))}
                  className="w-full mt-1 h-8 px-2 rounded bg-gray-700 text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              {/* Simulate purchase */}
              <button
                onClick={simulatePurchase}
                className="w-full py-2 rounded-lg bg-gold text-gray-900 font-medium hover:bg-gold/90 transition-colors"
              >
                Simulate purchase
              </button>

              {lastResult && (
                <div className={`text-xs p-2 rounded ${lastResult.startsWith('\u2713') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                  {lastResult}
                </div>
              )}

              {/* Reset */}
              <button
                onClick={resetAll}
                className="w-full py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-colors"
              >
                Reset all card data
              </button>

              {/* Status bar */}
              <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-700">
                State: {lifecycle} | Tier: {(() => {
                  const state = useSimulationStore.getState();
                  const ayni = state.balances?.ayniActivated ?? 0;
                  if (ayni >= 100000) return 'principal';
                  if (ayni >= 25000) return 'operator';
                  if (ayni >= 5000) return 'contributor';
                  return 'explorer';
                })()} | €{cardBalance.toFixed(2)}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-gold shadow-lg hover:bg-gray-800 transition-colors"
          >
            <SlidersHorizontal size={14} />
            <span className="text-xs font-medium">Card Demo</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function DemoSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 h-8 px-2 rounded bg-gray-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-gold appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
