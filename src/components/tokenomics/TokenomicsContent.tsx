import { useTranslation } from '@/i18n';
import { HeroSection } from './HeroSection';
import { HowItWorksSection } from './HowItWorksSection';
import { BurnSection } from './BurnSection';
import { FormulaSection } from './FormulaSection';
import { ExampleSection } from './ExampleSection';

function FooterDisclaimer() {
  const { t } = useTranslation();
  return (
    <p className="text-xs text-text-muted text-center py-6 border-t border-border">
      {t('tokenomics.footer.disclaimer')}
    </p>
  );
}

export function TokenomicsContent() {
  return (
    <div className="max-w-[960px] mx-auto space-y-8">
      <HeroSection />
      <HowItWorksSection />
      <BurnSection />
      <FormulaSection />
      <ExampleSection />
      <FooterDisclaimer />
    </div>
  );
}
