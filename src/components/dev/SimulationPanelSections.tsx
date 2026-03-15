import { CalendarDays, FastForward, Flame, RefreshCw, SkipForward, Trophy } from 'lucide-react';
import { useSimulationStore } from '@/stores/simulation';
import { useDistributionStore } from '@/stores/distributionStore';
import { useMineStore } from '@/stores/mineStore';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { StateRow } from './SimulationPanelControls';

const TOTAL_ACHIEVEMENTS_COUNT = 17;

export function GamificationSection() {
  const mine = useMineStore();
  const sim = useSimulationStore();
  const autoClaimOn = sim.autoClaimOnAdvance;
  const streak = mine.getCurrentStreak();
  const unlocked = Object.keys(mine.unlockedAchievements).length;
  const claimDays = mine.claimDates.length;

  return (
    <div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
        <Trophy size={12} className="text-amber-400" />
        Gamification
      </div>
      <div className="bg-gray-800 rounded-lg p-2.5 space-y-1 text-[11px] mb-2">
        <StateRow label="Streak" value={`${streak} days`} />
        <StateRow label="Achievements" value={`${unlocked} / ${TOTAL_ACHIEVEMENTS_COUNT}`} />
        <StateRow label="Claim days" value={`${claimDays}`} />
        <StateRow label="Level" value={`${mine.computedStats?.currentLevel ?? '—'}`} />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <label className="flex items-center gap-1.5 text-[11px] text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoClaimOn}
            onChange={(e) => sim.setAutoClaimOnAdvance(e.target.checked)}
            className="accent-amber-500"
          />
          Auto-claim on advance
        </label>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          onClick={() => {
            mine.claimToday();
            mine.refresh();
          }}
          className="sim-btn"
          disabled={mine.isClaimedToday()}
        >
          <Flame size={12} /> Claim Today
        </button>
        <button
          onClick={() => mine.resetGameData()}
          className="sim-btn !bg-red-800 hover:!bg-red-700"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}

export function QuarterlySection({ invalidate }: { invalidate: () => void }) {
  const distStore = useDistributionStore();

  const handleRefresh = () => {
    invalidate();
  };

  const handleTriggerPayout = () => {
    const sim = useSimulationStore.getState();
    sim.advanceToNextPayout();
    invalidate();
  };

  const handleAdvance30 = () => {
    const sim = useSimulationStore.getState();
    sim.advanceDays(30);
    invalidate();
  };

  const accrued = distStore.getAccruedThisQuarter();
  const claimable = distStore.getClaimableBalance();
  const totalAccrued = distStore.getTotalAccrued();
  const nextPayout = distStore.getNextPayoutInfo();
  const hasHadPayout = distStore.hasHadPayout();
  const simPositions = useSimulationStore((s) => s.positions);

  return (
    <div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
        <CalendarDays size={12} className="text-amber-400" />
        Quarterly Distributions
      </div>
      <div className="bg-gray-800 rounded-lg p-2.5 space-y-1 text-[11px] mb-2">
        <StateRow label="Total accrued" value={formatCurrency(totalAccrued.usd)} />
        <StateRow label="This quarter" value={formatCurrency(accrued.usd)} />
        <StateRow label="Claimable" value={formatCurrency(claimable.usd)} />
        <StateRow
          label="Next payout"
          value={
            nextPayout.date ? `${formatDate(nextPayout.date)} (${nextPayout.daysRemaining}d)` : '—'
          }
        />
        <StateRow label="Progress" value={`${nextPayout.progressPercent}%`} />
        <StateRow label="Had payout?" value={hasHadPayout ? 'Yes' : 'No'} />
      </div>
      <div className="bg-gray-800/50 rounded-lg p-2 space-y-1 text-[10px] text-gray-400 mb-2">
        {simPositions
          .filter((p) => p.status === 'active')
          .map((pos) => (
            <div key={pos.id} className="flex justify-between">
              <span className="truncate mr-1">{pos.id.slice(0, 8)}</span>
              <span>
                pay:{pos.nextPayoutDate?.split('T')[0] ?? '?'} snap:
                {pos.distributedAtLastPayout?.toFixed(4) ?? '?'}/
                {pos.totalDistributedPaxg?.toFixed(4)} ({pos.payouts?.length ?? 0}p)
              </span>
            </div>
          ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <button onClick={handleTriggerPayout} className="sim-btn !bg-amber-800 hover:!bg-amber-700">
          <SkipForward size={12} /> Trigger Payout
        </button>
        <button onClick={handleAdvance30} className="sim-btn">
          <FastForward size={12} /> +30d
        </button>
        <button onClick={handleRefresh} className="sim-btn">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>
    </div>
  );
}
