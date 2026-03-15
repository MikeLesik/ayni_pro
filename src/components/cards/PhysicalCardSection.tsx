import { useState } from 'react';
import { CreditCard, Package, Truck, Check, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useCardStore, useCardTier } from '@/stores/cardStore';
import { getCardPrivileges } from '@/lib/cardConfig';
import { useTranslation } from '@/i18n';

export function PhysicalCardSection() {
  const { t } = useTranslation();
  const tier = useCardTier();
  const privileges = getCardPrivileges(tier);
  const physicalCard = useCardStore((s) => s.physicalCard);
  const physicalCardDetails = useCardStore((s) => s.physicalCardDetails);
  const requestPhysicalCard = useCardStore((s) => s.requestPhysicalCard);
  const activatePhysicalCard = useCardStore((s) => s.activatePhysicalCard);

  const [formOpen, setFormOpen] = useState(false);
  const [address, setAddress] = useState('');

  // Only show for tiers that support physical cards
  if (privileges.cardType !== 'virtual+physical') return null;

  const materialLabel = privileges.physicalCardMaterial === 'gold-plated' ? 'gold-plated' : 'metal';

  return (
    <div className="mt-6">
      {physicalCard === 'eligible' && (
        <>
          <Card variant="stat" padding="lg" className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: privileges.cardGradient }} />
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: privileges.cardGradient }}
              >
                <CreditCard size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-display text-base text-text-primary mb-1">
                  {t('card.physical.title')}
                </h4>
                <p className="text-sm text-text-muted mb-3">
                  {t('card.physical.description', { material: materialLabel })}
                </p>
                <Button
                  variant="gold-cta"
                  size="sm"
                  onClick={() => setFormOpen(true)}
                >
                  {t('card.physical.cta')}
                </Button>
              </div>
            </div>
          </Card>

          <Modal
            open={formOpen}
            onClose={() => setFormOpen(false)}
            title={t('card.physical.formTitle')}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-text-muted mb-2">
                <MapPin size={16} />
                <span className="text-sm">{t('card.physical.shippingInfo')}</span>
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full name&#10;Street address&#10;City, Postal code&#10;Country"
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface-card text-text-primary text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <div className="flex gap-3">
                <Button variant="secondary" fullWidth onClick={() => setFormOpen(false)}>
                  {t('card.physical.cancel')}
                </Button>
                <Button
                  variant="gold-cta"
                  fullWidth
                  disabled={!address.trim()}
                  onClick={() => {
                    requestPhysicalCard(address);
                    setFormOpen(false);
                  }}
                >
                  {t('card.physical.submit')}
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}

      {(physicalCard === 'requested' || physicalCard === 'production' || physicalCard === 'shipped') && (
        <Card variant="stat" padding="lg">
          <h4 className="font-display text-base text-text-primary mb-4">
            {t('card.physical.orderTitle')}
          </h4>
          <div className="space-y-3">
            {[
              { state: 'requested', label: t('card.physical.orderConfirmed'), icon: <Check size={14} /> },
              { state: 'production', label: t('card.physical.inProduction'), icon: <Package size={14} /> },
              { state: 'shipped', label: t('card.physical.shipped'), icon: <Truck size={14} /> },
            ].map((step) => {
              const states: string[] = ['requested', 'production', 'shipped'];
              const currentIdx = states.indexOf(physicalCard);
              const stepIdx = states.indexOf(step.state);
              const isDone = stepIdx <= currentIdx;
              const isCurrent = stepIdx === currentIdx;

              return (
                <div key={step.state} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      isDone ? 'bg-success text-white' : 'border-2 border-border'
                    }`}
                  >
                    {isDone && step.icon}
                  </div>
                  <span className={`text-sm ${isCurrent ? 'text-text-primary font-medium' : isDone ? 'text-text-secondary' : 'text-text-muted'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          {physicalCardDetails && (
            <div className="mt-4 pt-3 border-t border-border-light text-xs text-text-muted space-y-1">
              <p>Tracking: {physicalCardDetails.trackingNumber}</p>
              <p>Estimated delivery: {physicalCardDetails.estimatedDelivery}</p>
            </div>
          )}
        </Card>
      )}

      {physicalCard === 'delivered' && (
        <Card variant="stat" padding="lg" className="text-center">
          <div className="w-14 h-14 rounded-full bg-success-light flex items-center justify-center mx-auto mb-3">
            <Package size={28} className="text-success" />
          </div>
          <h4 className="font-display text-base text-text-primary mb-1">
            {t('card.physical.arrived')}
          </h4>
          <p className="text-sm text-text-muted mb-4">
            {t('card.physical.activateDesc')}
          </p>
          <Button variant="gold-cta" onClick={activatePhysicalCard}>
            {t('card.physical.activate')}
          </Button>
        </Card>
      )}

      {physicalCard === 'active' && (
        <Card variant="stat" padding="lg">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-8 rounded-md flex items-center justify-center"
              style={{ background: privileges.cardGradient }}
            >
              <span className="text-white text-[10px] font-mono">{physicalCardDetails?.last4}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{t('card.physical.cardLabel')}</p>
              <p className="text-xs text-success">{t('card.physical.active')}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
