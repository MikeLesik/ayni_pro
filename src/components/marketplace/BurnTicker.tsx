import { useQuery } from '@tanstack/react-query';
import { Flame } from 'lucide-react';
import { getBurnTotal } from '@/services/marketplace';
import { useCountUp } from '@/hooks/useCountUp';
import { formatNumber } from '@/lib/formatters';

export function BurnTicker() {
  const { data } = useQuery({
    queryKey: ['marketplace', 'burn-total'],
    queryFn: getBurnTotal,
    staleTime: 60_000,
  });

  const burned = data?.totalBurned ?? 0;
  const burnedUsd = data?.totalBurnedUsd ?? 0;

  const burnedDisplay = useCountUp({ end: burned, decimals: 0, duration: 1400 });
  const usdDisplay = useCountUp({ end: burnedUsd, decimals: 0, duration: 1400 });

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5"
      style={{ background: 'var(--color-gold-light)' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Flame size={16} className="shrink-0 text-warning" />
        <p className="text-sm text-text-primary truncate">
          <span>Сожжено через маркетплейс: </span>
          <span className="font-mono font-semibold" aria-hidden="true">
            {burnedDisplay} AYNI
          </span>
          <span className="text-text-secondary ml-1" aria-hidden="true">
            (${usdDisplay})
          </span>
          <span className="sr-only">
            {formatNumber(burned, 0)} AYNI, ${formatNumber(burnedUsd, 0)}
          </span>
        </p>
      </div>

      <a
        href="https://etherscan.io"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        Etherscan&nbsp;&#8599;
      </a>
    </div>
  );
}
