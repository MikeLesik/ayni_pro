import { Toggle } from '@/components/ui/Toggle';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

interface AdvancedToggleProps {
  className?: string;
}

export function AdvancedToggle({ className }: AdvancedToggleProps) {
  const advancedView = useUiStore((s) => s.advancedView);
  const toggleAdvancedView = useUiStore((s) => s.toggleAdvancedView);
  const { t } = useTranslation();

  return (
    <div className={cn('mt-4', className)}>
      <Toggle
        checked={advancedView}
        onChange={toggleAdvancedView}
        label={t('portfolio.advancedToggle.label')}
        aria-label={t('portfolio.advancedToggle.ariaLabel')}
      />
    </div>
  );
}
