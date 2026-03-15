import { useEffect, useRef, useState } from 'react';
import { Users, Wrench, Gauge, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

/** Animates 0 → target once the element scrolls into view */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setValue(target * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

interface MineStatsGridProps {
  workers: number;
  equipment: string;
  outputPerDay: string;
  efficiency: number;
}

export function MineStatsGrid({
  workers,
  equipment,
  outputPerDay,
  efficiency,
}: MineStatsGridProps) {
  // IntersectionObserver to trigger count-up on first appearance
  const gridRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animWorkers = useCountUp(isInView ? workers : 0, 1200);
  const animEfficiency = useCountUp(isInView ? efficiency : 0, 1200);
  const { t } = useTranslation();

  const efficiencyColor =
    efficiency >= 80 ? 'text-success' : efficiency >= 50 ? 'text-warning' : 'text-error';

  const stats = [
    {
      icon: Users,
      label: t('mine.stats.workers'),
      value: isInView ? String(Math.round(animWorkers)) : '0',
      sublabel:
        workers === 1
          ? t('mine.stats.workersSolo')
          : t('mine.stats.workersCrew', { count: workers }),
    },
    {
      icon: Wrench,
      label: t('mine.stats.equipment'),
      value: equipment,
      sublabel: '',
    },
    {
      icon: Gauge,
      label: t('mine.stats.output'),
      value: outputPerDay,
      sublabel: t('mine.stats.outputDaily'),
    },
    {
      icon: Activity,
      label: t('mine.stats.efficiency'),
      value: isInView ? `${Math.round(animEfficiency)}%` : '0%',
      sublabel: '',
      valueClassName: efficiencyColor,
    },
  ];

  return (
    <div ref={gridRef} className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} variant="stat" className="p-3">
          <stat.icon className="w-4 h-4 text-text-muted mb-1.5" />
          <p className="text-xs uppercase text-text-muted tracking-wide">{stat.label}</p>
          <p
            className={cn(
              'text-base font-semibold text-text-primary mt-0.5 truncate',
              stat.valueClassName,
            )}
          >
            {stat.value}
          </p>
          {stat.sublabel && <p className="text-body-sm text-text-muted">{stat.sublabel}</p>}
        </Card>
      ))}
    </div>
  );
}
