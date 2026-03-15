import { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useTranslation } from '@/i18n';

interface ContextualHintProps {
  id: string;
  text: string;
  position?: 'top' | 'bottom';
  children: ReactNode;
}

export function ContextualHint({ id, text, position = 'bottom', children }: ContextualHintProps) {
  const { t } = useTranslation();
  const isShown = useOnboardingStore((s) => s.isHintShown(id));
  const markHintShown = useOnboardingStore((s) => s.markHintShown);

  const visible = !isShown;

  return (
    <div className="relative inline-block">
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: position === 'bottom' ? -4 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === 'bottom' ? -4 : 4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'absolute left-0 z-40 w-[calc(100vw-3rem)] max-w-[280px] rounded-lg bg-surface-card p-3 sm:p-4 shadow-md',
              position === 'bottom' && 'top-full mt-3',
              position === 'top' && 'bottom-full mb-3',
            )}
          >
            {/* Arrow */}
            <span
              aria-hidden="true"
              className={cn(
                'absolute left-5 h-0 w-0 border-x-[6px] border-x-transparent',
                position === 'bottom' &&
                  'top-0 -translate-y-full border-b-[6px] border-b-surface-card',
                position === 'top' &&
                  'bottom-0 translate-y-full border-t-[6px] border-t-surface-card',
              )}
            />

            {/* Close button */}
            <button
              type="button"
              onClick={() => markHintShown(id)}
              className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded text-text-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              aria-label={t('onboarding.hint.dismiss')}
            >
              <X size={14} />
            </button>

            <p className="pr-4 text-body-sm sm:text-body-md text-text-secondary">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
