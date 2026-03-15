import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = '480px',
  showCloseButton = true,
  className,
}: ModalProps) {
  const { t } = useTranslation();
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-[200] bg-black/40 backdrop-blur-[4px]',
            'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
          )}
        />

        {/* Content — desktop: centered dialog, mobile: bottom sheet */}
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            'fixed z-[201] bg-surface-card shadow-lg focus:outline-none',
            // Mobile: bottom sheet
            'inset-x-0 bottom-0 rounded-t-[20px] p-6',
            'data-[state=open]:animate-slide-up-sheet',
            // Desktop: centered dialog
            'md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
            'md:rounded-[20px] md:p-8',
            'md:data-[state=open]:animate-scale-in',
            'md:w-full',
            className,
          )}
          style={{ maxWidth: `min(${maxWidth}, calc(100vw - 32px))` }}
        >
          {/* Drag handle — mobile only */}
          <div className="mx-auto mb-4 h-1 w-9 rounded-sm bg-border md:hidden" />

          {/* Close button */}
          {showCloseButton && (
            <Dialog.Close asChild>
              <button
                className={cn(
                  'absolute right-4 top-4 flex h-8 w-8 min-h-0 min-w-0 items-center justify-center',
                  'rounded-full text-text-muted transition-colors',
                  'hover:bg-surface-secondary hover:text-text-primary',
                )}
                aria-label={t('ui.close')}
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          )}

          {/* Title */}
          {title && (
            <Dialog.Title className="pr-8 text-heading-3 font-semibold text-text-primary">
              {title}
            </Dialog.Title>
          )}

          {/* Body */}
          <div className={cn(title && 'mt-4')}>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
