import { Mail, MessageCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';

export function ContactSection() {
  const { t } = useTranslation();

  return (
    <section className="max-w-[720px] mx-auto">
      <h3 className="text-base font-semibold text-text-primary mb-3">{t('learn.contact.title')}</h3>
      <div className="flex flex-wrap gap-3">
        <Button variant="ghost" size="sm" leftIcon={<Mail className="h-4 w-4" />}>
          {t('learn.contact.emailSupport')}
        </Button>
        <Button variant="ghost" size="sm" leftIcon={<MessageCircle className="h-4 w-4" />}>
          {t('learn.contact.liveChat')}
        </Button>
        <Button variant="ghost" size="sm" leftIcon={<FileText className="h-4 w-4" />}>
          {t('learn.contact.fullDocumentation')}
        </Button>
      </div>
    </section>
  );
}
