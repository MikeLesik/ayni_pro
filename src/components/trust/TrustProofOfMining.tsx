import { Activity, Camera, Play, ExternalLink, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import { trustData } from '@/services/mock/data/trust';
import siteOverview from '@/assets/mining/site-overview.jpeg';
import processingPlant from '@/assets/mining/processing-plant.jpeg';
import excavationSite from '@/assets/mining/excavation-site.jpeg';

const monthLabelKeys: Record<string, TranslationKey> = {
  '2025-07': 'trust.data.month.jul2025',
  '2025-08': 'trust.data.month.aug2025',
  '2025-09': 'trust.data.month.sep2025',
  '2025-10': 'trust.data.month.oct2025',
  '2025-11': 'trust.data.month.nov2025',
  '2025-12': 'trust.data.month.dec2025',
};

export function TrustProofOfMining() {
  const { t } = useTranslation();
  const { miningOperations: ops } = trustData;

  const formatGrams = (g: number) =>
    g >= 1000 ? `${(g / 1000).toFixed(1)} kg` : `${g.toFixed(1)} g`;

  return (
    <section id="mining-operations" className="scroll-mt-24">
      <h2 className="font-display text-xl md:text-2xl text-text-primary mb-4">
        {t('trust.proofOfMining.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT — Production report */}
        <Card variant="stat" className="p-5 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <h3 className="text-sm font-semibold text-text-primary">
                {t('trust.proofOfMining.productionReport')}
              </h3>
            </div>
            <a
              href="#"
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              {t('trust.proofOfMining.viewFull')}
              <ExternalLink size={12} />
            </a>
          </div>

          <p className="text-xs text-text-muted mb-4">
            {t('trust.proofOfMining.period', { period: ops.period })}
          </p>

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-surface-secondary rounded-lg p-3 text-center">
              <TrendingUp size={18} className="text-primary mx-auto mb-1.5" />
              <p className="text-lg font-semibold text-text-primary">
                {formatGrams(ops.totalExtracted)}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {t('trust.proofOfMining.totalExtracted')}
              </p>
            </div>
            <div className="bg-surface-secondary rounded-lg p-3 text-center">
              <ArrowRightLeft size={18} className="text-emerald-500 mx-auto mb-1.5" />
              <p className="text-lg font-semibold text-text-primary">
                {formatGrams(ops.totalSold)}
              </p>
              <p className="text-xs text-text-muted mt-0.5">{t('trust.proofOfMining.totalSold')}</p>
            </div>
          </div>

          {/* Monthly breakdown table */}
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-text-primary mb-2">
              {t('trust.proofOfMining.monthlyBreakdown')}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-default">
                    <th className="text-left text-xs text-text-muted font-medium pb-2 pr-4">
                      {t('trust.proofOfMining.colMonth')}
                    </th>
                    <th className="text-right text-xs text-text-muted font-medium pb-2 px-2">
                      {t('trust.proofOfMining.colExtracted')}
                    </th>
                    <th className="text-right text-xs text-text-muted font-medium pb-2 pl-2">
                      {t('trust.proofOfMining.colSold')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ops.monthly.map((row) => (
                    <tr key={row.month} className="border-b border-border-default/50 last:border-0">
                      <td className="py-2 pr-4 text-text-primary font-medium text-xs">
                        {monthLabelKeys[row.month] ? t(monthLabelKeys[row.month]!) : row.label}
                      </td>
                      <td className="py-2 px-2 text-right text-text-primary tabular-nums text-xs">
                        {formatGrams(row.extracted)}
                      </td>
                      <td className="py-2 pl-2 text-right text-text-primary tabular-nums text-xs">
                        {formatGrams(row.sold)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* RIGHT — Photos & Video */}
        <Card variant="stat" className="p-5 flex flex-col">
          {/* Photos */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Camera size={14} className="text-text-muted" />
              <span className="text-xs font-medium text-text-primary">
                {t('trust.proofOfMining.sitePhotos')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <img
                src={siteOverview}
                alt={t('trust.data.photo.siteOverview')}
                loading="lazy"
                className="col-span-2 w-full h-40 rounded-lg object-cover shadow-sm"
              />
              <img
                src={processingPlant}
                alt={t('trust.data.photo.processingPlant')}
                loading="lazy"
                className="w-full h-28 rounded-lg object-cover shadow-sm"
              />
              <img
                src={excavationSite}
                alt={t('trust.data.photo.excavation')}
                loading="lazy"
                className="w-full h-28 rounded-lg object-cover shadow-sm"
              />
            </div>
          </div>

          {/* Video — shown only when URL is available */}
          {ops.videoUrl && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Play size={14} className="text-text-muted" />
                <span className="text-xs font-medium text-text-primary">
                  {t('trust.proofOfMining.videoUpdate')}
                </span>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden bg-black flex-1">
                <video src={ops.videoUrl} controls className="w-full h-full" />
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
