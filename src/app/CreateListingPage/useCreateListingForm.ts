import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSimulationStore } from '@/stores/simulation';
import { useCreateListing } from '@/hooks/useMarketplace';
import { formatNumber } from '@/lib/formatters';
import { MARKETPLACE_COMMISSION_RATE, MARKETPLACE_BURN_RATE } from '@/lib/constants';

// ── Constants ────────────────────────────────────────────────
export const MIN_PRICE_RATIO = 0.85;
export const DURATION_OPTIONS = [7, 14, 30] as const;
export const COOLDOWN_DAYS = 7;

// ── Helpers ──────────────────────────────────────────────────
export function getCooldownDaysLeft(endDate: string, now: number): number {
  const cooldownEnd = new Date(endDate);
  cooldownEnd.setDate(cooldownEnd.getDate() + COOLDOWN_DAYS);
  const diff = cooldownEnd.getTime() - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ── Schema & types ───────────────────────────────────────────
export const createListingSchema = z.object({
  positionId: z.string().min(1, 'Выберите позицию'),
  ayniAmount: z.number().min(1, 'Введите количество AYNI'),
  askPriceUsdc: z.number().min(0.01, 'Введите цену'),
  durationDays: z.union([z.literal(7), z.literal(14), z.literal(30)]),
});

export type FormValues = z.infer<typeof createListingSchema>;

// ── Hook ─────────────────────────────────────────────────────
export function useCreateListingForm(preselectedId: string) {
  const navigate = useNavigate();
  const positions = useSimulationStore((s) => s.positions);
  const simulationDate = useSimulationStore((s) => s.simulationDate);
  const ayniPriceUsd = useSimulationStore((s) => s.prices.ayniUsd);
  const nowMs = new Date(simulationDate).getTime();
  const { createListing, isCreating } = useCreateListing();
  const [dailyLimitExceeded, setDailyLimitExceeded] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Allow both active and completed positions
  const listablePositions = useMemo(
    () => positions.filter((p) => p.status === 'active' || p.status === 'completed'),
    [positions],
  );

  const officialPrice = ayniPriceUsd;

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      positionId: preselectedId,
      ayniAmount: 0,
      askPriceUsdc: 0,
      durationDays: 14,
    },
  });

  const selectedPositionId = watch('positionId');
  const ayniAmount = watch('ayniAmount');
  const askPriceUsdc = watch('askPriceUsdc');

  const selectedPosition = useMemo(
    () => listablePositions.find((p) => p.id === selectedPositionId),
    [listablePositions, selectedPositionId],
  );

  const isActivePosition = selectedPosition?.status === 'active';
  const maxAyni = selectedPosition?.ayniActivated ?? 0;

  // Price calculations
  const pricePerAyni = ayniAmount > 0 ? askPriceUsdc / ayniAmount : 0;
  const priceDeviation =
    officialPrice > 0 ? ((pricePerAyni - officialPrice) / officialPrice) * 100 : 0;
  const minPrice = officialPrice * MIN_PRICE_RATIO * ayniAmount;
  const isBelowMinPrice = askPriceUsdc > 0 && askPriceUsdc < minPrice;

  // Preview card
  const fee = askPriceUsdc * MARKETPLACE_COMMISSION_RATE;
  const burnAmount = ayniAmount * MARKETPLACE_BURN_RATE;
  const net = askPriceUsdc - fee;

  const positionOptions = listablePositions.map((p) => {
    const isActive = p.status === 'active';
    const cooldownLeft = isActive ? 0 : getCooldownDaysLeft(p.endDate, nowMs);
    const isOnCooldown = cooldownLeft > 0;

    // Compute remaining months for active positions
    const remainingMs = isActive ? new Date(p.endDate).getTime() - nowMs : 0;
    const remainingMonths = Math.max(0, Math.round(remainingMs / (30.44 * 86_400_000)));

    const statusLabel = isActive ? `Активная · ${remainingMonths} мес. осталось` : 'Завершённая';

    return {
      value: p.id,
      label: `#${p.id.slice(-4)} — ${formatNumber(p.ayniActivated)} AYNI (${statusLabel})`,
      disabled: isOnCooldown,
      description: isOnCooldown
        ? `Доступно через ${cooldownLeft} ${cooldownLeft === 1 ? 'день' : cooldownLeft < 5 ? 'дня' : 'дней'}`
        : undefined,
    };
  });

  // Cooldown banner — only for completed positions
  const earliestCooldownEnd = useMemo(() => {
    let earliest: string | null = null;
    for (const p of listablePositions) {
      if (p.status !== 'completed') continue;
      const cooldownEnd = new Date(p.endDate);
      cooldownEnd.setDate(cooldownEnd.getDate() + COOLDOWN_DAYS);
      if (cooldownEnd.getTime() > nowMs) {
        if (!earliest || cooldownEnd.toISOString() < earliest) {
          earliest = cooldownEnd.toISOString();
        }
      }
    }
    return earliest;
  }, [listablePositions, nowMs]);

  async function onSubmit(data: FormValues) {
    if (isBelowMinPrice) return;
    setDailyLimitExceeded(false);
    setSubmitError(null);
    try {
      await createListing({
        positionId: data.positionId,
        ayniAmount: data.ayniAmount,
        askPriceUsdc: data.askPriceUsdc,
        durationDays: data.durationDays,
      });
      navigate('/participate/marketplace');
    } catch (err: unknown) {
      const code =
        (err as { code?: string })?.code ??
        (err as { response?: { data?: { code?: string } } })?.response?.data?.code;
      if (code === 'DAILY_LIMIT_EXCEEDED') {
        setDailyLimitExceeded(true);
      } else {
        setSubmitError(
          (err instanceof Error ? err.message : null) ||
            'Произошла ошибка при создании предложения',
        );
      }
    }
  }

  const isValid = !!selectedPositionId && ayniAmount > 0 && askPriceUsdc > 0 && !isBelowMinPrice;

  // Pre-fill amount/price when position is pre-selected via URL param
  useEffect(() => {
    if (preselectedId) {
      const pos = listablePositions.find((p) => p.id === preselectedId);
      if (pos) {
        const isAct = pos.status === 'active';
        const amount = isAct ? pos.ayniActivated : 0;
        setValue('ayniAmount', amount);
        setValue('askPriceUsdc', +(amount * officialPrice).toFixed(2));
      }
    }
  }, [preselectedId, listablePositions, setValue, officialPrice]);

  return {
    // form methods
    control,
    handleSubmit,
    setValue,
    errors,

    // data
    listablePositions,
    officialPrice,
    positionOptions,

    // selected position
    selectedPosition,
    isActivePosition,
    maxAyni,

    // watched values
    ayniAmount,
    askPriceUsdc,

    // price calculations
    pricePerAyni,
    priceDeviation,
    minPrice,
    isBelowMinPrice,

    // preview
    fee,
    burnAmount,
    net,

    // cooldown
    earliestCooldownEnd,

    // submission
    isValid,
    isCreating,
    dailyLimitExceeded,
    submitError,
    onSubmit,
  };
}
