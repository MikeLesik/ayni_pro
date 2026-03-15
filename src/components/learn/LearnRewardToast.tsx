import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useLearnStore } from '@/stores/learnStore';

export function LearnRewardToast() {
  const { t } = useTranslation();
  const show = useLearnStore((s) => s.showRewardToast);
  const amount = useLearnStore((s) => s.lastRewardAmount);
  const dismiss = useLearnStore((s) => s.dismissRewardToast);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(dismiss, 3000);
    return () => clearTimeout(timer);
  }, [show, dismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-24 right-4 z-[300] flex items-center gap-3 bg-surface-elevated border border-primary/20 rounded-xl px-4 py-3 shadow-xl cursor-pointer"
          onClick={dismiss}
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Coins size={18} className="text-primary" />
          </div>
          <p className="text-sm font-semibold text-text-primary">
            {t('learn.reward.toast', { amount: String(amount) })}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
