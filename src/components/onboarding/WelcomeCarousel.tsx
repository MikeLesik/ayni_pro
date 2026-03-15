import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

const variants = {
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

export function WelcomeCarousel() {
  const { t } = useTranslation();

  const slides = [
    {
      title: t('onboarding.slide1.title'),
      description: t('onboarding.slide1.description'),
    },
    {
      title: t('onboarding.slide2.title'),
      description: t('onboarding.slide2.description'),
    },
    {
      title: t('onboarding.slide3.title'),
      description: t('onboarding.slide3.description'),
    },
    {
      title: t('onboarding.slide4.title'),
      description: t('onboarding.slide4.description'),
    },
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const navigate = useNavigate();
  const completeCarousel = useOnboardingStore((s) => s.completeCarousel);

  const skip = useCallback(() => {
    completeCarousel();
    navigate('/home', { replace: true });
  }, [completeCarousel, navigate]);

  const next = useCallback(() => {
    if (index < slides.length - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    } else {
      completeCarousel();
      navigate('/participate', { replace: true });
    }
  }, [index, slides.length, completeCarousel, navigate]);

  const slide = slides[index]!;
  const isLast = index === slides.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-bg-primary px-5 sm:px-6 pt-6 sm:pt-10 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-10">
      {/* Skip link */}
      <div className="flex w-full justify-end">
        <button
          type="button"
          onClick={skip}
          className="text-body-sm sm:text-body-md text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          {t('onboarding.skip')}
        </button>
      </div>

      {/* Slide content */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-hidden min-h-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col items-center text-center"
          >
            {/* Placeholder illustration */}
            <div className="mb-5 sm:mb-8 h-[140px] w-[140px] sm:h-[200px] sm:w-[200px] rounded-xl bg-bg-secondary" />

            <h2 className="text-heading-2-mobile sm:text-heading-2 text-text-primary">
              {slide.title}
            </h2>
            <p className="mt-2 sm:mt-3 max-w-[400px] text-body-sm sm:text-body-lg text-text-secondary">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* What is AYNI? expandable */}
        <div className="mt-3 sm:mt-4 w-full max-w-[400px]">
          <button
            type="button"
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="flex items-center gap-1 text-sm text-primary hover:underline mx-auto"
          >
            {t('onboarding.whatIsAyni')}
            <ChevronDown
              size={14}
              className={cn('transition-transform duration-200', detailsOpen && 'rotate-180')}
            />
          </button>
          {detailsOpen && (
            <div className="mt-2 rounded-lg bg-surface-secondary p-3 sm:p-4 text-left">
              <p className="text-body-sm text-text-secondary leading-relaxed">
                {t('onboarding.whatIsAyniContent')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dot indicators + button */}
      <div className="flex w-full max-w-[400px] flex-col items-center gap-5 sm:gap-8">
        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                i === index ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>

        <Button variant={isLast ? 'gold-cta' : 'primary'} fullWidth onClick={next}>
          {isLast ? t('onboarding.letsStart') : t('onboarding.next')}
        </Button>
      </div>
    </div>
  );
}
