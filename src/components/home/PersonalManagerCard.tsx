import { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/cn';

export function PersonalManagerCard() {
  const [minimized, setMinimized] = useState(false);
  const { t } = useTranslation();

  if (minimized) return null;

  return (
    <>
      {/* Desktop — fixed bottom-right */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-50 w-[320px]">
        <Card variant="glass" className="p-5 bg-surface-card border border-border-light shadow-lg">
          {/* Close button */}
          <button
            onClick={() => setMinimized(true)}
            className="absolute top-3 right-3 p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors"
            aria-label={t('common.close')}
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <Avatar size="md" name="Maria S" />
            <div>
              <p className="text-body-md font-medium text-text-primary">
                {t('home.personalManager.managerName')}
              </p>
              <p className="text-body-sm text-text-muted">{t('home.personalManager.subtitle')}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<MessageCircle className="h-4 w-4" />}
              className="flex-1"
            >
              {t('home.personalManager.chat')}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Phone className="h-4 w-4" />}
              className="flex-1"
            >
              {t('home.personalManager.scheduleCall')}
            </Button>
          </div>
        </Card>
      </div>

      {/* Mobile — sticky banner above BottomTabBar */}
      <div
        className={cn(
          'lg:hidden fixed left-0 right-0 z-50',
          'bottom-[var(--tab-bar-height)]',
          'bg-surface-card/95 backdrop-blur-nav border-t border-border-light',
          'px-4 py-3',
        )}
      >
        <div className="flex items-center gap-3">
          <Avatar size="sm" name="Maria S" />
          <p className="text-body-sm font-medium text-text-primary flex-1">
            {t('home.personalManager.managerName')}{' '}
            <span className="text-text-muted font-normal">
              — {t('home.personalManager.advisorLabel')}
            </span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<MessageCircle className="h-3.5 w-3.5" />}
            >
              {t('home.personalManager.chat')}
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Phone className="h-3.5 w-3.5" />}>
              {t('home.personalManager.call')}
            </Button>
          </div>
          <button
            onClick={() => setMinimized(true)}
            className="p-1 rounded-full text-text-muted hover:text-text-primary transition-colors"
            aria-label={t('common.close')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
