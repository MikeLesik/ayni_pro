import { useEffect, useRef, useState } from 'react';
import { Gem, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useMineNotificationStore } from '@/stores/mineNotificationStore';
import { useMine } from '@/hooks/useMine';
import { useTranslation } from '@/i18n';
import { formatCurrency } from '@/lib/formatters';

export function DailyMineToast() {
  const showDailyToast = useMineNotificationStore((s) => s.showDailyToast);
  const dismissDailyToast = useMineNotificationStore((s) => s.dismissDailyToast);
  const { data: stats } = useMine();
  const { t } = useTranslation();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showDailyToast && stats) {
      // Small delay so it appears after page loads
      const showTimer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(showTimer);
    } else {
      setVisible(false);
    }
  }, [showDailyToast, stats]);

  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setTimeout(dismissDailyToast, 300);
      }, 5000);
      return () => clearTimeout(timerRef.current);
    }
  }, [visible, dismissDailyToast]);

  const handleDismiss = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
    setTimeout(dismissDailyToast, 300);
  };

  if (!stats) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={cn(
            'fixed top-4 left-1/2 -translate-x-1/2 z-[200]',
            'w-[calc(100%-2rem)] max-w-md',
            'flex items-center gap-3 p-4',
            'bg-surface-card border border-primary/30 rounded-lg',
            'shadow-lg cursor-pointer',
          )}
          style={{
            boxShadow: '0 4px 24px rgba(27, 58, 75, 0.15), 0 2px 8px rgba(0,0,0,0.08)',
          }}
          onClick={handleDismiss}
        >
          {/* Gem icon with glow */}
          <div className="shrink-0 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse" />
            <div className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Gem size={20} className="text-primary" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-semibold text-text-primary">
              {t('home.dailyMineToast.title', { goldGrams: stats.dailyProduction.goldGrams })}
            </p>
            <p className="text-body-sm text-text-secondary">
              &asymp; {formatCurrency(stats.dailyProduction.usdValue)}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            className="shrink-0 text-text-muted hover:text-text-secondary p-1"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
