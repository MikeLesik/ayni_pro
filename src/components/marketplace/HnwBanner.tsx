import { Shield, ArrowRight } from 'lucide-react';

const CONTACT_EMAIL = 'otc@ayni.team';

export function HnwBanner() {
  return (
    <div className="mt-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="h-10 w-10 rounded-full bg-primary-light flex shrink-0 items-center justify-center">
        <Shield className="h-5 w-5 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-heading-3 text-text-primary">Передаёте более $50,000?</p>
        <p className="text-body-md text-text-secondary mt-1">
          Наша команда организует прямую сделку с усиленной верификацией
        </p>
      </div>

      <a
        href={`mailto:${CONTACT_EMAIL}?subject=OTC Desk — крупная сделка`}
        className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
      >
        Свяжитесь с нами
        <ArrowRight size={16} />
      </a>
    </div>
  );
}
