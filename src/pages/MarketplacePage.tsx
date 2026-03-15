import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, DollarSign, TrendingUp, Clock, Plus } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useMarketplaceListings } from '@/hooks/useMarketplace';
import { useMarketplaceStore, useFilteredListings } from '@/stores/marketplaceStore';
import { BurnTicker } from '@/components/marketplace/BurnTicker';
import { HnwBanner } from '@/components/marketplace/HnwBanner';
import { LiquidityWindow } from '@/components/marketplace/LiquidityWindow';
import { ListingFilters } from '@/components/marketplace/ListingFilters';
import { ListingGrid } from '@/components/marketplace/ListingGrid';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatPercent } from '@/lib/formatters';

export default function MarketplacePage() {
  const { t } = useTranslation();
  const { listings, stats, isLoading } = useMarketplaceListings();
  const { setListings, setStats } = useMarketplaceStore();
  const filteredListings = useFilteredListings();

  // Sync fetched data into store for filters to work
  useEffect(() => {
    if (listings.length > 0) setListings(listings);
  }, [listings, setListings]);

  useEffect(() => {
    if (stats) setStats(stats);
  }, [stats, setStats]);

  return (
    <div className="pt-4 pb-24 md:pt-6 lg:pb-24">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-heading-1 text-text-primary">
            {t('marketplace.page.title')}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">{t('marketplace.page.subtitle')}</p>
        </div>
        <Link
          to="/participate/marketplace/create"
          className="inline-flex items-center justify-center gap-2 font-medium transition-all duration-100 ease-in-out active:scale-[0.98] bg-transparent text-primary rounded-[12px] border-[1.5px] border-border hover:bg-primary-light hover:border-primary h-8 px-3 text-xs"
        >
          <Plus size={16} />
          {t('marketplace.page.createListing')}
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard
          icon={<ShoppingBag size={18} />}
          iconColor="text-brand"
          label={t('marketplace.stats.activeListings')}
          value={stats ? String(stats.totalListings) : '—'}
        />
        <StatCard
          icon={<DollarSign size={18} />}
          iconColor="text-success"
          label={t('marketplace.stats.totalVolume')}
          value={stats ? formatCurrency(stats.totalVolume) : '—'}
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          iconColor="text-warning"
          label={t('marketplace.stats.avgDeviation')}
          value={stats ? formatPercent(stats.avgPriceDeviation) : '—'}
        />
        <StatCard
          icon={<Clock size={18} />}
          iconColor="text-info"
          label={t('marketplace.stats.avgTimeToFill')}
          value={stats ? t('marketplace.stats.days', { count: String(stats.avgTimeToFill) }) : '—'}
        />
      </div>

      {/* Burn ticker */}
      <div className="mb-5">
        <BurnTicker />
      </div>

      {/* Liquidity window */}
      <div className="mb-5">
        <LiquidityWindow />
      </div>

      {/* Filters */}
      <div className="mb-5">
        <ListingFilters />
      </div>

      {/* Listings grid */}
      <ListingGrid listings={filteredListings} isLoading={isLoading} />

      {/* HNW OTC banner */}
      <HnwBanner />

      {/* Disclaimer */}
      <p className="text-xs text-text-muted text-center mt-8 max-w-[560px] mx-auto leading-relaxed pb-4">
        {t('marketplace.page.disclaimer')}
      </p>
    </div>
  );
}
