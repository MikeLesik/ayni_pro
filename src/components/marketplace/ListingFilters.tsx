import { useTranslation } from '@/i18n';
import { useMarketplaceStore } from '@/stores/marketplaceStore';
import { Tabs } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import type { MarketplaceFilters } from '@/types/marketplace';

const lotSizeTabs = (t: (k: any) => string) => [
  { id: 'all', label: t('marketplace.filters.lotAll') },
  { id: 'small', label: t('marketplace.filters.lotSmall') },
  { id: 'medium', label: t('marketplace.filters.lotMedium') },
  { id: 'large', label: t('marketplace.filters.lotLarge') },
];

const priceTabs = (t: (k: any) => string) => [
  { id: 'all', label: t('marketplace.filters.priceAll') },
  { id: 'discount', label: t('marketplace.filters.priceDiscount') },
  { id: 'at_market', label: t('marketplace.filters.priceAtMarket') },
  { id: 'premium', label: t('marketplace.filters.pricePremium') },
];

const sortOptions = (t: (k: any) => string) => [
  { value: 'newest', label: t('marketplace.filters.sortNewest') },
  { value: 'price_low', label: t('marketplace.filters.sortPriceLow') },
  { value: 'price_high', label: t('marketplace.filters.sortPriceHigh') },
  { value: 'amount_high', label: t('marketplace.filters.sortAmountHigh') },
];

export function ListingFilters() {
  const { t } = useTranslation();
  const { filters, setFilters } = useMarketplaceStore();

  return (
    <div className="flex flex-col gap-3">
      {/* Lot size */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-text-muted">
          {t('marketplace.filters.lotSizeLabel')}
        </span>
        <Tabs
          items={lotSizeTabs(t)}
          activeId={filters.lotSize}
          onChange={(id) => setFilters({ lotSize: id as MarketplaceFilters['lotSize'] })}
          variant="pill"
          size="sm"
        />
      </div>

      {/* Price range */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-text-muted">
          {t('marketplace.filters.priceLabel')}
        </span>
        <Tabs
          items={priceTabs(t)}
          activeId={filters.priceRange}
          onChange={(id) => setFilters({ priceRange: id as MarketplaceFilters['priceRange'] })}
          variant="pill"
          size="sm"
        />
      </div>

      {/* Sort */}
      <Select
        label={t('marketplace.filters.sortLabel')}
        options={sortOptions(t)}
        value={filters.sortBy}
        onChange={(value) => setFilters({ sortBy: value as MarketplaceFilters['sortBy'] })}
      />
    </div>
  );
}
