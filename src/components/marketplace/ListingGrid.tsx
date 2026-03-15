import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/cn';
import { useMarketplaceStore } from '@/stores/marketplaceStore';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Button } from '@/components/ui/Button';
import { ListingCard } from './ListingCard';
import type { MarketplaceListing } from '@/types/marketplace';

interface ListingGridProps {
  listings: MarketplaceListing[];
  isLoading: boolean;
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonLoader key={i} variant="card" height="180px" />
      ))}
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  const { toggleCreateModal } = useMarketplaceStore();

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <p className="text-text-secondary text-body-md">{t('marketplace.grid.empty')}</p>
      <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={toggleCreateModal}>
        {t('marketplace.grid.createFirst')}
      </Button>
    </div>
  );
}

export function ListingGrid({ listings, isLoading }: ListingGridProps) {
  const navigate = useNavigate();
  const { setSelectedListing } = useMarketplaceStore();

  if (isLoading) return <GridSkeleton />;
  if (listings.length === 0) return <EmptyState />;

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4')}>
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onClick={() => {
            setSelectedListing(listing.id);
            navigate(`/participate/marketplace/${listing.id}`);
          }}
        />
      ))}
    </div>
  );
}
