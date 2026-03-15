import { Users, CheckCircle, Coins } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { useTranslation } from '@/i18n';
import { useReferralStore } from '@/stores/referralStore';
import { formatNumber } from '@/lib/formatters';

export function ReferralStats() {
  const { t } = useTranslation();
  const totalReferrals = useReferralStore((s) => s.totalReferrals);
  const completedCount = useReferralStore((s) => s.referralEvents.filter((e) => e.status === 'completed').length);
  const totalBonusEarned = useReferralStore((s) => s.totalBonusEarned);

  return (
    <div className="grid grid-cols-3 gap-2">
      <StatCard
        icon={<Users size={16} />}
        iconColor="text-primary"
        label={t('referral.stats.totalReferred')}
        value={String(totalReferrals)}
      />
      <StatCard
        icon={<CheckCircle size={16} />}
        iconColor="text-success"
        label={t('referral.stats.completed')}
        value={String(completedCount)}
      />
      <StatCard
        icon={<Coins size={16} />}
        iconColor="text-primary"
        label={t('referral.stats.bonusEarned')}
        value={`${formatNumber(totalBonusEarned, 0)} AYNI`}
      />
    </div>
  );
}
