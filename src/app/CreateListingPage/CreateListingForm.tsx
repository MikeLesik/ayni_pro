import { Controller } from 'react-hook-form';
import { ArrowRight, AlertTriangle, Info } from 'lucide-react';
import { CooldownBanner } from '@/components/marketplace/CooldownBanner';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/cn';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { useCreateListingForm, DURATION_OPTIONS } from './useCreateListingForm';

interface CreateListingFormProps {
  preselectedId: string;
}

export function CreateListingForm({ preselectedId }: CreateListingFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    errors,

    listablePositions,
    officialPrice,
    positionOptions,

    selectedPosition,
    isActivePosition,
    maxAyni,

    ayniAmount,
    askPriceUsdc,

    pricePerAyni,
    priceDeviation,
    minPrice,
    isBelowMinPrice,

    fee,
    burnAmount,
    net,

    earliestCooldownEnd,

    isValid,
    isCreating,
    dailyLimitExceeded,
    submitError,
    onSubmit,
  } = useCreateListingForm(preselectedId);

  return (
    <div className="max-w-[640px] mx-auto">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <h1 className="font-display text-heading-1 text-text-primary">Создать предложение</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Передайте свои токены другому участнику
        </p>
      </div>

      {/* Cooldown Banner */}
      {earliestCooldownEnd && (
        <div className="mb-4">
          <CooldownBanner cooldownEndDate={earliestCooldownEnd} />
        </div>
      )}

      {/* Submit Error Banner */}
      {submitError && (
        <div
          role="alert"
          className="mb-4 bg-error/10 border-l-4 border-error rounded-r-xl px-4 py-3 flex items-start gap-3"
        >
          <AlertTriangle size={20} className="shrink-0 text-error mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-text-primary">Ошибка</p>
            <p className="text-xs text-text-secondary mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* Daily Limit Banner */}
      {dailyLimitExceeded && (
        <div
          role="alert"
          className="mb-4 bg-error/10 border-l-4 border-error rounded-r-xl px-4 py-3 flex items-start gap-3"
        >
          <AlertTriangle size={20} className="shrink-0 text-error mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Дневной лимит предложений достигнут
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Попробуйте завтра. Лимит обновляется каждые 24 часа.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Position Select ── */}
        <Controller
          name="positionId"
          control={control}
          render={({ field }) => (
            <Select
              label="Выберите позицию"
              placeholder="Выберите позицию"
              options={positionOptions}
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                const pos = listablePositions.find((p) => p.id === val);
                if (pos) {
                  // Active positions: full amount only; completed: start at 0
                  const amount = pos.status === 'active' ? pos.ayniActivated : 0;
                  setValue('ayniAmount', amount);
                  setValue('askPriceUsdc', +(amount * officialPrice).toFixed(2));
                }
              }}
            />
          )}
        />
        {errors.positionId && (
          <p className="text-xs text-error -mt-4">{errors.positionId.message}</p>
        )}

        {/* ── Active position note ── */}
        {isActivePosition && (
          <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary-light/50 px-4 py-3">
            <Info size={16} className="shrink-0 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary">Продажа активной позиции</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Активные позиции продаются целиком. Покупатель унаследует оставшийся срок блокировки
                и продолжит получать распределения. Вы получите оплату вместо отмены с штрафом 5%.
              </p>
            </div>
          </div>
        )}

        {/* ── AYNI Amount + Slider ── */}
        {selectedPosition && (
          <div>
            <label className="mb-1.5 text-[13px] font-medium text-text-secondary block">
              Количество AYNI
            </label>
            <Controller
              name="ayniAmount"
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    type="number"
                    placeholder="0"
                    value={field.value || ''}
                    disabled={isActivePosition}
                    onChange={(e) => {
                      const val = Math.min(Math.max(0, Number(e.target.value)), maxAyni);
                      field.onChange(val);
                      setValue('askPriceUsdc', +(val * officialPrice).toFixed(2));
                    }}
                    error={errors.ayniAmount?.message}
                  />
                  {!isActivePosition && (
                    <input
                      type="range"
                      min={0}
                      max={maxAyni}
                      step={maxAyni > 1000 ? 10 : 1}
                      value={field.value}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        field.onChange(val);
                        setValue('askPriceUsdc', +(val * officialPrice).toFixed(2));
                      }}
                      className="w-full mt-2 accent-[var(--color-primary)] h-2 cursor-pointer"
                    />
                  )}
                  <p className="text-xs text-text-muted mt-1">
                    {isActivePosition
                      ? `Заблокировано: ${formatNumber(maxAyni)} AYNI (продажа целиком)`
                      : `Доступно: ${formatNumber(maxAyni)} AYNI`}
                  </p>
                </div>
              )}
            />
          </div>
        )}

        {/* ── Ask Price ── */}
        {selectedPosition && ayniAmount > 0 && (
          <div>
            <label className="mb-1.5 text-[13px] font-medium text-text-secondary block">
              Запрашиваемая цена
            </label>
            <Controller
              name="askPriceUsdc"
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={
                      isBelowMinPrice
                        ? `Минимальная цена: ${formatCurrency(minPrice)} (85% официальной цены ${formatCurrency(officialPrice)}/AYNI)`
                        : errors.askPriceUsdc?.message
                    }
                    helperText={`Официальная цена: ${formatCurrency(officialPrice)} за AYNI`}
                  />
                  {/* Deviation badge */}
                  {pricePerAyni > 0 && !isBelowMinPrice && (
                    <div className="mt-1.5">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          priceDeviation > 0 && 'bg-warning-light text-warning',
                          priceDeviation < 0 && 'bg-success-light text-success',
                          priceDeviation === 0 && 'bg-surface-secondary text-text-muted',
                        )}
                      >
                        {priceDeviation > 0 ? '+' : ''}
                        {priceDeviation.toFixed(1)}% от официальной
                      </span>
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        )}

        {/* ── Duration Pills ── */}
        {selectedPosition && ayniAmount > 0 && (
          <div>
            <label className="mb-2 text-[13px] font-medium text-text-secondary block">
              Срок предложения
            </label>
            <Controller
              name="durationDays"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  {DURATION_OPTIONS.map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => field.onChange(days)}
                      className={cn(
                        'flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                        field.value === days
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border bg-surface-card text-text-secondary hover:border-border-light',
                      )}
                    >
                      {days} дней
                    </button>
                  ))}
                </div>
              )}
            />
          </div>
        )}

        {/* ── Preview Card ── */}
        {ayniAmount > 0 && askPriceUsdc > 0 && !isBelowMinPrice && (
          <div className="relative bg-primary-light rounded-xl p-5 border border-primary/15 overflow-hidden">
            <div className="text-xs text-primary uppercase tracking-wider font-medium mb-3">
              Предварительный расчёт
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Вы получите</span>
                <span className="font-medium text-text-primary">
                  {formatCurrency(askPriceUsdc)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Комиссия (2.5%)</span>
                <span className="font-medium text-error">&minus;{formatCurrency(fee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Сжигание</span>
                <span className="font-medium text-text-primary">
                  {formatNumber(burnAmount)} AYNI
                </span>
              </div>
              <hr className="border-primary/10" />
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-text-primary">Итого к получению</span>
                <span className="font-mono text-lg font-semibold text-text-primary">
                  {formatCurrency(net)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div>
          <Button
            type="submit"
            variant="gold-cta"
            size="lg"
            fullWidth
            disabled={!isValid}
            loading={isCreating}
            rightIcon={<ArrowRight size={18} />}
          >
            Create listing
          </Button>
          <p className="text-xs text-text-muted text-center mt-3 leading-relaxed">
            Токены будут заморожены в эскроу до завершения сделки
          </p>
        </div>
      </form>
    </div>
  );
}
