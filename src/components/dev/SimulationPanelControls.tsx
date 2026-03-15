import { useUiStore } from '@/stores/uiStore';

export function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 w-12 text-[11px]">{label}:</span>
      <div className="flex-1 relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded px-2 pl-5 py-1 text-[11px] text-white focus:border-amber-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

export function StateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}:</span>
      <span className="text-white font-mono">{value}</span>
    </div>
  );
}

export function VisibilityToggles() {
  const showGamification = useUiStore((s) => s.showGamification);
  const setShowGamification = useUiStore((s) => s.setShowGamification);

  return (
    <div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">UI Visibility</div>
      <label className="flex items-center justify-between cursor-pointer bg-gray-800 rounded-lg px-2.5 py-2">
        <span className="text-[11px] text-gray-300">Gamification &amp; Claim</span>
        <div
          role="switch"
          aria-checked={showGamification}
          onClick={() => setShowGamification(!showGamification)}
          className={`relative w-8 h-[18px] rounded-full transition-colors ${showGamification ? 'bg-amber-500' : 'bg-gray-600'}`}
        >
          <div
            className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform ${showGamification ? 'left-[16px]' : 'left-[2px]'}`}
          />
        </div>
      </label>
    </div>
  );
}
