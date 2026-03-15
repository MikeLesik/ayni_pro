import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Coins, Pickaxe, Gift } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

const STORAGE_KEY = 'onboarding_completed';

const icons = [Coins, Pickaxe, Gift] as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export function OnboardingCarousel() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const slides = [
    {
      titleKey: 'onboarding.carousel.slide1.title' as const,
      descKey: 'onboarding.carousel.slide1.description' as const,
    },
    {
      titleKey: 'onboarding.carousel.slide2.title' as const,
      descKey: 'onboarding.carousel.slide2.description' as const,
    },
    {
      titleKey: 'onboarding.carousel.slide3.title' as const,
      descKey: 'onboarding.carousel.slide3.description' as const,
    },
  ];

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'true') {
      setVisible(true);
    }
  }, []);

  const complete = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  }, []);

  const skip = useCallback(() => {
    complete();
  }, [complete]);

  const next = useCallback(() => {
    if (index < slides.length - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    } else {
      complete();
      navigate('/participate');
    }
  }, [index, slides.length, complete, navigate]);

  if (!visible) return null;

  const Icon = icons[index]!;
  const isLast = index === slides.length - 1;

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-[4px] px-4"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative w-full bg-surface-card rounded-2xl sm:rounded-[20px] p-5 sm:p-8 overflow-hidden max-w-[480px]"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Skip button */}
        <button
          type="button"
          onClick={skip}
          className={cn(
            'absolute right-4 top-4 sm:right-6 sm:top-6 z-10',
            'text-body-sm text-text-secondary',
            'hover:text-text-primary transition-colors',
            'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
          )}
        >
          {t('onboarding.skip')}
        </button>

        {/* Slide content */}
        <div className="flex flex-col items-center overflow-hidden min-h-[200px] sm:min-h-[280px] justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gold-light">
                <Icon size={28} className="text-gold-dark sm:hidden" />
                <Icon size={36} className="text-gold-dark hidden sm:block" />
              </div>

              {/* Title */}
              <h2 className="text-heading-3-mobile sm:text-heading-3 font-semibold text-text-primary">
                {t(slides[index]!.titleKey)}
              </h2>

              {/* Description */}
              <p className="mt-2 sm:mt-3 max-w-[360px] text-body-sm sm:text-body-md text-text-secondary leading-relaxed">
                {t(slides[index]!.descKey)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={cn(
                'h-2 rounded-full transition-all duration-200',
                i === index ? 'w-6 bg-primary' : 'w-2 bg-border',
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA button */}
        <div className="mt-4 sm:mt-6">
          <Button variant={isLast ? 'gold-cta' : 'primary'} fullWidth size="lg" onClick={next}>
            {isLast ? t('onboarding.carousel.cta') : t('onboarding.next')}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
