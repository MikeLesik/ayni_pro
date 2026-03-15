import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/cn';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface LearnQuizProps {
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  onComplete: () => void;
  className?: string;
}

export function LearnQuiz({ title, questions, passingScore, onComplete, className }: LearnQuizProps) {
  const { t } = useTranslation();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQ]!;
  const isCorrect = selected === question.correctIndex;

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    setAnswered(true);
    if (selected === question.correctIndex) {
      setScore((s) => s + 1);
    }
  }, [selected, question.correctIndex]);

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
      if (score + (isCorrect ? 1 : 0) >= passingScore) {
        onComplete();
      }
    }
  }, [currentQ, questions.length, score, isCorrect, passingScore, onComplete]);

  const handleRetry = useCallback(() => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  }, []);

  if (finished) {
    const finalScore = score;
    const finalPassed = finalScore >= passingScore;
    return (
      <Card variant="stat" className={cn('p-5 text-center', className)}>
        <h3 className="text-lg font-semibold text-text-primary">{t('learn.quiz.complete')}</h3>
        <p className="text-sm text-text-secondary mt-2">
          {t('learn.quiz.score', { score: String(finalScore), total: String(questions.length) })}
        </p>
        <p className={cn('text-sm mt-1', finalPassed ? 'text-success' : 'text-warning')}>
          {finalPassed
            ? t('learn.quiz.passMessage')
            : t('learn.quiz.failMessage', { required: String(passingScore) })}
        </p>
        {!finalPassed && (
          <Button variant="primary" size="sm" className="mt-3" onClick={handleRetry}>
            <RotateCcw size={14} className="mr-1.5" />
            {t('learn.quiz.retry')}
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card variant="stat" className={cn('p-5', className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <span className="text-xs text-text-muted">
          {t('learn.quiz.question', {
            current: String(currentQ + 1),
            total: String(questions.length),
          })}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm text-text-primary mb-3">{question.question}</p>
          <div className="space-y-2">
            {question.options.map((option, i) => {
              const isSelected = selected === i;
              const showCorrect = answered && i === question.correctIndex;
              const showWrong = answered && isSelected && !isCorrect;

              return (
                <button
                  key={i}
                  type="button"
                  disabled={answered}
                  onClick={() => setSelected(i)}
                  className={cn(
                    'w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors',
                    !answered && isSelected
                      ? 'border-primary bg-primary/5 text-text-primary'
                      : !answered
                        ? 'border-border-light hover:border-primary/40 text-text-primary'
                        : showCorrect
                          ? 'border-success bg-success/5 text-success'
                          : showWrong
                            ? 'border-error bg-error/5 text-error'
                            : 'border-border-light text-text-muted opacity-60',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showCorrect && <Check size={16} />}
                    {showWrong && <X size={16} />}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end mt-3">
        {!answered ? (
          <Button variant="primary" size="sm" disabled={selected === null} onClick={handleSubmit}>
            {t('learn.quiz.submit')}
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={handleNext}>
            {currentQ < questions.length - 1 ? t('learn.quiz.next') : t('learn.quiz.complete')}
          </Button>
        )}
      </div>

      {answered && (
        <p className={cn('text-xs mt-2', isCorrect ? 'text-success' : 'text-warning')}>
          {isCorrect ? t('learn.quiz.correct') : t('learn.quiz.incorrect')}
        </p>
      )}
    </Card>
  );
}
