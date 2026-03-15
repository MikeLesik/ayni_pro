import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, ArrowRight, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation } from '@/i18n';

export function PhysicalCardBanner() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
      >
        <Card
          variant="stat"
          className="relative overflow-hidden"
          padding="lg"
        >
          {/* Gold accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: 'var(--color-gold-gradient)' }}
          />

          <div className="flex items-start gap-4">
            {/* Gold card icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))',
              }}
            >
              <CreditCard size={22} className="text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-display text-base text-text-primary mb-1">
                {t('card.physical.title')}
              </h4>
              <p className="text-sm text-text-muted mb-3">
                {t('card.physical.description')}
              </p>
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<ArrowRight size={14} />}
                onClick={() => setFormOpen(true)}
                disabled={submitted}
              >
                {submitted
                  ? t('card.physical.requested')
                  : t('card.physical.cta')}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Shipping Address Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={t('card.physical.formTitle')}
      >
        {submitted ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-14 h-14 rounded-full bg-success-light flex items-center justify-center mb-4">
              <Check size={28} className="text-success" />
            </div>
            <h3 className="font-display text-lg text-text-primary mb-1">
              {t('card.physical.successTitle')}
            </h3>
            <p className="text-sm text-text-muted text-center mb-6">
              {t('card.physical.successDesc')}
            </p>
            <Button
              variant="primary"
              fullWidth
              onClick={() => setFormOpen(false)}
            >
              {t('common.close')}
            </Button>
          </div>
        ) : (
          <ShippingForm
            onSubmit={() => setSubmitted(true)}
            onCancel={() => setFormOpen(false)}
          />
        )}
      </Modal>
    </>
  );
}

function ShippingForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [address, setAddress] = useState({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const isValid =
    address.fullName.trim() &&
    address.line1.trim() &&
    address.city.trim() &&
    address.postalCode.trim() &&
    address.country.trim();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-text-muted mb-2">
        <MapPin size={16} />
        <span className="text-sm">{t('card.physical.shippingInfo')}</span>
      </div>

      <InputField
        label={t('card.physical.fullName')}
        value={address.fullName}
        onChange={(v) => setAddress((a) => ({ ...a, fullName: v }))}
      />
      <InputField
        label={t('card.physical.addressLine1')}
        value={address.line1}
        onChange={(v) => setAddress((a) => ({ ...a, line1: v }))}
      />
      <InputField
        label={t('card.physical.addressLine2')}
        value={address.line2}
        onChange={(v) => setAddress((a) => ({ ...a, line2: v }))}
        required={false}
      />
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label={t('card.physical.city')}
          value={address.city}
          onChange={(v) => setAddress((a) => ({ ...a, city: v }))}
        />
        <InputField
          label={t('card.physical.postalCode')}
          value={address.postalCode}
          onChange={(v) => setAddress((a) => ({ ...a, postalCode: v }))}
        />
      </div>
      <InputField
        label={t('card.physical.country')}
        value={address.country}
        onChange={(v) => setAddress((a) => ({ ...a, country: v }))}
      />

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" fullWidth onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="gold-cta"
          fullWidth
          disabled={!isValid}
          onClick={onSubmit}
        >
          {t('card.physical.submit')}
        </Button>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-text-muted mb-1 block">
        {label}
        {!required && (
          <span className="text-text-muted/60 ml-1">(optional)</span>
        )}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-border bg-surface-card text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}
