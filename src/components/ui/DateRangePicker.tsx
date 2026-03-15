import { useTranslation } from '@/i18n';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  minDate?: string;
  maxDate?: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  minDate,
  maxDate,
  onStartChange,
  onEndChange,
}: DateRangePickerProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="flex items-center gap-1.5 text-xs text-text-muted">
        {t('home.chart.dateFrom')}
        <input
          type="date"
          value={startDate}
          min={minDate}
          max={endDate || maxDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="rounded-lg border border-border-light bg-surface-secondary px-2 py-1.5 text-xs text-text-primary outline-none focus:border-primary transition-colors [color-scheme:dark]"
        />
      </label>
      <label className="flex items-center gap-1.5 text-xs text-text-muted">
        {t('home.chart.dateTo')}
        <input
          type="date"
          value={endDate}
          min={startDate || minDate}
          max={maxDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="rounded-lg border border-border-light bg-surface-secondary px-2 py-1.5 text-xs text-text-primary outline-none focus:border-primary transition-colors [color-scheme:dark]"
        />
      </label>
    </div>
  );
}
