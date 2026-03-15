import { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/cn';

export function ContactFab() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'fixed z-50',
        'right-4 bottom-[calc(60px+16px)]',
        'lg:right-6 lg:bottom-6',
        'flex flex-col items-end gap-3',
      )}
    >
      {/* Drawer */}
      {open && (
        <Card
          variant="glass"
          className={cn(
            'w-[280px] p-4',
            'bg-surface-card border border-border-light shadow-lg',
            'animate-in fade-in slide-in-from-bottom-2 duration-200',
          )}
        >
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors"
            aria-label={t('common.close')}
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <Avatar size="sm" name="Maria S" />
            <div>
              <p className="text-body-sm font-medium text-text-primary">
                {t('home.personalManager.managerName')}
              </p>
              <p className="text-xs text-text-muted">{t('home.personalManager.subtitle')}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<MessageCircle className="h-3.5 w-3.5" />}
              className="flex-1"
            >
              {t('home.personalManager.chat')}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Phone className="h-3.5 w-3.5" />}
              className="flex-1"
            >
              {t('home.personalManager.call')}
            </Button>
          </div>
        </Card>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t('fab.ariaLabel')}
        className={cn(
          'w-14 h-14 rounded-full',
          'bg-primary text-white',
          'shadow-lg hover:shadow-xl',
          'flex items-center justify-center',
          'transition-all duration-200',
          'hover:scale-105 active:scale-95',
        )}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
