import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  snapPoints?: number[];
  labels?: string[];
  formatValue?: (value: number) => string;
  compact?: boolean;
  className?: string;
}

const DEFAULT_SNAP_POINTS = [6, 12, 24, 36, 48];

export function Slider({
  min = 6,
  max = 48,
  step = 1,
  value,
  onChange,
  snapPoints = DEFAULT_SNAP_POINTS,
  labels: labelsProp,
  formatValue,
  compact = false,
  className,
}: SliderProps) {
  const { t } = useTranslation();

  const defaultLabels = [
    t('ui.slider.6mo'),
    t('ui.slider.12mo'),
    t('ui.slider.24mo'),
    t('ui.slider.36mo'),
    t('ui.slider.48mo'),
  ];
  const labels = labelsProp ?? defaultLabels;

  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const percent = ((value - min) / (max - min)) * 100;

  const getClosestSnap = useCallback(
    (val: number) => {
      let closest = val;
      let minDist = Infinity;
      for (const sp of snapPoints) {
        const dist = Math.abs(val - sp);
        if (dist < minDist) {
          minDist = dist;
          closest = sp;
        }
      }
      return minDist <= 2 ? closest : val;
    },
    [snapPoints],
  );

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + pct * (max - min);
      return Math.round(raw / step) * step;
    },
    [min, max, step, value],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const val = getValueFromPosition(e.clientX);
      onChange(Math.max(min, Math.min(max, val)));
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [getValueFromPosition, onChange, min, max],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const val = getValueFromPosition(e.clientX);
      onChange(Math.max(min, Math.min(max, val)));
    },
    [isDragging, getValueFromPosition, onChange, min, max],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const snapped = getClosestSnap(value);
    if (snapped !== value) {
      onChange(snapped);
    }
  }, [isDragging, value, getClosestSnap, onChange]);

  // Keyboard support via hidden range input
  const handleRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange],
  );

  const handleRangeKeyUp = useCallback(() => {
    const snapped = getClosestSnap(value);
    if (snapped !== value) {
      onChange(snapped);
    }
  }, [value, getClosestSnap, onChange]);

  // Closest snap for label highlighting
  const closestSnapIndex = snapPoints.reduce(
    (bestIdx, sp, idx) =>
      Math.abs(value - sp) < Math.abs(value - snapPoints[bestIdx]!) ? idx : bestIdx,
    0,
  );

  return (
    <div className={cn('w-full select-none', className)}>
      {/* Custom track */}
      <div
        ref={trackRef}
        className={cn(
          'relative w-full h-1 bg-border rounded-sm',
          isDragging ? 'cursor-grabbing' : 'cursor-pointer',
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-1 rounded-sm"
          style={{
            width: `${percent}%`,
            background: 'var(--color-primary-gradient)',
          }}
        />

        {/* Thumb */}
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
            'w-6 h-6 rounded-full',
            'bg-surface-card border-2 border-primary',
            'shadow-sm transition-shadow duration-200',
            isDragging ? 'cursor-grabbing shadow-md' : 'cursor-grab hover:shadow-md',
          )}
          style={{ left: `${percent}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2">
        {labels.map((label, idx) => (
          <span
            key={label}
            className={cn(
              'transition-colors duration-200',
              compact ? 'text-xs' : 'text-body-sm',
              idx === closestSnapIndex ? 'text-text-primary font-semibold' : 'text-text-muted',
            )}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Hidden accessible range input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleRangeChange}
        onKeyUp={handleRangeKeyUp}
        aria-label={formatValue ? formatValue(value) : `${value} ${t('common.months')}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="sr-only"
      />
    </div>
  );
}
