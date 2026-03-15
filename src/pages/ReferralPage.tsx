import { AnimatedPage, StaggerItem } from '@/components/ui/AnimatedPage';
import { ReferralHero } from '@/components/referral/ReferralHero';
import { ReferralStats } from '@/components/referral/ReferralStats';
import { ReferralHistory } from '@/components/referral/ReferralHistory';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import { REFERRAL_BONUS_AYNI } from '@/stores/referralStore';

export default function ReferralPage() {
  const { t } = useTranslation();

  return (
    <AnimatedPage stagger className="flex flex-col gap-0 pb-8">
      <StaggerItem className="pt-5">
        <h1 className="text-2xl font-display font-bold text-text-primary">
          {t('referral.title')}
        </h1>
        <p className="text-sm text-text-secondary mt-1">{t('referral.subtitle')}</p>
      </StaggerItem>

      <StaggerItem className="mt-4">
        <ReferralHero />
      </StaggerItem>

      <StaggerItem className="mt-4">
        <ReferralStats />
      </StaggerItem>

      {/* How it works */}
      <StaggerItem className="mt-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">{t('referral.howItWorks')}</h3>
        <Card variant="stat" className="p-4">
          <ol className="space-y-3">
            {[
              t('referral.step1'),
              t('referral.step2'),
              t('referral.step3', { bonus: String(REFERRAL_BONUS_AYNI) }),
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm text-text-primary pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </Card>
      </StaggerItem>

      <StaggerItem className="mt-5">
        <ReferralHistory />
      </StaggerItem>
    </AnimatedPage>
  );
}
