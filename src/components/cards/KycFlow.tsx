import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCardStore } from '@/stores/cardStore';
import type { CardLifecycle, KycFormData } from '@/stores/cardStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation } from '@/i18n';

const STEPS: { key: CardLifecycle; labelKey: 'card.kyc.step.personal' | 'card.kyc.step.address' | 'card.kyc.step.document' | 'card.kyc.step.review'; number: number }[] = [
  { key: 'kyc_step_1', labelKey: 'card.kyc.step.personal', number: 1 },
  { key: 'kyc_step_2', labelKey: 'card.kyc.step.address', number: 2 },
  { key: 'kyc_step_3', labelKey: 'card.kyc.step.document', number: 3 },
  { key: 'kyc_step_4', labelKey: 'card.kyc.step.review', number: 4 },
];

const COUNTRIES = [
  { code: 'PT', name: 'Portugal' },
  { code: 'ES', name: 'Spain' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'BR', name: 'Brazil' },
  { code: 'RU', name: 'Russia' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
  { code: 'PL', name: 'Poland' },
  { code: 'SE', name: 'Sweden' },
];

export function KycFlow() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const lifecycle = useCardStore((s) => s.lifecycle);
  const kyc = useCardStore((s) => s.kyc);
  const startKyc = useCardStore((s) => s.startKyc);
  const updateKyc = useCardStore((s) => s.updateKyc);
  const advanceKycStep = useCardStore((s) => s.advanceKycStep);
  const goBackKycStep = useCardStore((s) => s.goBackKycStep);

  // If eligible but KYC not started, show start screen
  if (lifecycle === 'eligible') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))' }}>
          <Check size={32} className="text-white" />
        </div>
        <h2 className="font-display text-2xl text-text-primary mb-2">
          {t('card.kyc.eligible.title')}
        </h2>
        <p className="text-text-secondary mb-8">
          {t('card.kyc.eligible.desc')}
        </p>
        <Button variant="gold-cta" size="lg" onClick={startKyc}>
          {t('card.kyc.eligible.cta')}
        </Button>
      </div>
    );
  }

  const currentStepIdx = STEPS.findIndex((s) => s.key === lifecycle);
  const currentStep = currentStepIdx >= 0 ? currentStepIdx : 0;

  return (
    <div className="max-w-[480px] mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {STEPS.map((step, idx) => (
          <div key={step.key} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                idx < currentStep
                  ? 'bg-success text-white'
                  : idx === currentStep
                    ? 'bg-gold text-white'
                    : 'bg-surface-secondary text-text-muted'
              }`}
            >
              {idx < currentStep ? <Check size={14} /> : step.number}
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  idx < currentStep ? 'bg-success' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex justify-between mb-8 px-2">
        {STEPS.map((step, idx) => (
          <span
            key={step.key}
            className={`text-xs font-medium ${
              idx === currentStep ? 'text-text-primary' : 'text-text-muted'
            }`}
          >
            {t(step.labelKey)}
          </span>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={lifecycle}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {lifecycle === 'kyc_step_1' && (
            <KycStep1 kyc={kyc} updateKyc={updateKyc} />
          )}
          {lifecycle === 'kyc_step_2' && (
            <KycStep2 kyc={kyc} updateKyc={updateKyc} />
          )}
          {lifecycle === 'kyc_step_3' && (
            <KycStep3 kyc={kyc} updateKyc={updateKyc} />
          )}
          {lifecycle === 'kyc_step_4' && <KycStep4 />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {currentStep > 0 && (
          <Button
            variant="ghost"
            onClick={goBackKycStep}
            leftIcon={<ArrowLeft size={16} />}
          >
            {t('card.kyc.back')}
          </Button>
        )}
        <div className="flex-1" />
        {currentStep < 3 && (
          <Button
            variant="gold-cta"
            onClick={advanceKycStep}
            rightIcon={<ArrowRight size={16} />}
            disabled={!isStepValid(lifecycle as CardLifecycle, kyc)}
          >
            {t('card.kyc.continue')}
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Validation ─────────────────────────────────────────────────────────

function isStepValid(step: CardLifecycle, kyc: KycFormData): boolean {
  switch (step) {
    case 'kyc_step_1': {
      if (!kyc.firstName || !kyc.lastName || !kyc.dateOfBirth || !kyc.nationality) return false;
      const dob = new Date(kyc.dateOfBirth);
      const age = (Date.now() - dob.getTime()) / (365.25 * 86400000);
      return age >= 18;
    }
    case 'kyc_step_2':
      return !!(kyc.addressLine1 && kyc.city && kyc.postalCode && kyc.country);
    case 'kyc_step_3':
      return !!(kyc.documentType && kyc.documentUploaded && kyc.selfieUploaded);
    case 'kyc_step_4':
      return kyc.termsAccepted;
    default:
      return false;
  }
}

// ── Step 1: Personal Information ───────────────────────────────────────

function KycStep1({
  kyc,
  updateKyc,
}: {
  kyc: KycFormData;
  updateKyc: (f: Partial<KycFormData>) => void;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="font-display text-xl text-text-primary mb-1">
        {t('card.kyc.s1.title')}
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        {t('card.kyc.s1.desc')}
      </p>

      <div className="space-y-4">
        <FormField label={t('card.kyc.s1.firstName')} required>
          <input
            type="text"
            value={kyc.firstName}
            onChange={(e) => updateKyc({ firstName: e.target.value })}
            className="form-input"
            placeholder={t('card.kyc.s1.firstName')}
          />
        </FormField>

        <FormField label={t('card.kyc.s1.lastName')} required>
          <input
            type="text"
            value={kyc.lastName}
            onChange={(e) => updateKyc({ lastName: e.target.value })}
            className="form-input"
            placeholder={t('card.kyc.s1.lastName')}
          />
        </FormField>

        <FormField label={t('card.kyc.s1.dob')} required>
          <input
            type="date"
            value={kyc.dateOfBirth}
            onChange={(e) => updateKyc({ dateOfBirth: e.target.value })}
            className="form-input"
            max={new Date(Date.now() - 18 * 365.25 * 86400000).toISOString().split('T')[0]}
          />
        </FormField>

        <FormField label={t('card.kyc.s1.nationality')} required>
          <select
            value={kyc.nationality}
            onChange={(e) => updateKyc({ nationality: e.target.value })}
            className="form-input"
          >
            <option value="">{t('card.kyc.s1.selectCountry')}</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </FormField>
      </div>
    </div>
  );
}

// ── Step 2: Address ────────────────────────────────────────────────────

function KycStep2({
  kyc,
  updateKyc,
}: {
  kyc: KycFormData;
  updateKyc: (f: Partial<KycFormData>) => void;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="font-display text-xl text-text-primary mb-1">
        {t('card.kyc.s2.title')}
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        {t('card.kyc.s2.desc')}
      </p>

      <div className="space-y-4">
        <FormField label={t('card.kyc.s2.line1')} required>
          <input
            type="text"
            value={kyc.addressLine1}
            onChange={(e) => updateKyc({ addressLine1: e.target.value })}
            className="form-input"
            placeholder={t('card.kyc.s2.line1')}
          />
        </FormField>

        <FormField label={t('card.kyc.s2.line2')}>
          <input
            type="text"
            value={kyc.addressLine2}
            onChange={(e) => updateKyc({ addressLine2: e.target.value })}
            className="form-input"
            placeholder={t('card.kyc.s2.line2')}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label={t('card.kyc.s2.city')} required>
            <input
              type="text"
              value={kyc.city}
              onChange={(e) => updateKyc({ city: e.target.value })}
              className="form-input"
              placeholder={t('card.kyc.s2.city')}
            />
          </FormField>

          <FormField label={t('card.kyc.s2.postal')} required>
            <input
              type="text"
              value={kyc.postalCode}
              onChange={(e) => updateKyc({ postalCode: e.target.value })}
              className="form-input"
              placeholder={t('card.kyc.s2.postal')}
            />
          </FormField>
        </div>

        <FormField label={t('card.kyc.s2.country')} required>
          <select
            value={kyc.country}
            onChange={(e) => updateKyc({ country: e.target.value })}
            className="form-input"
          >
            <option value="">{t('card.kyc.s1.selectCountry')}</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </FormField>
      </div>
    </div>
  );
}

// ── Step 3: Identity Document ──────────────────────────────────────────

function KycStep3({
  kyc,
  updateKyc,
}: {
  kyc: KycFormData;
  updateKyc: (f: Partial<KycFormData>) => void;
}) {
  const { t } = useTranslation();
  const docTypes = [
    { value: 'passport' as const, label: t('card.kyc.s3.passport'), icon: '\uD83D\uDEC2' },
    { value: 'id_card' as const, label: t('card.kyc.s3.idCard'), icon: '\uD83E\uDEAA' },
    { value: 'drivers_license' as const, label: t('card.kyc.s3.driversLicense'), icon: '\uD83E\uDEAA' },
  ];

  return (
    <div>
      <h2 className="font-display text-xl text-text-primary mb-6">
        {t('card.kyc.s3.title')}
      </h2>

      {/* Document type selector */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {docTypes.map((doc) => (
          <button
            key={doc.value}
            onClick={() => updateKyc({ documentType: doc.value })}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
              kyc.documentType === doc.value
                ? 'border-gold bg-gold-light'
                : 'border-border hover:border-border-dark'
            }`}
          >
            <span className="text-2xl">{doc.icon}</span>
            <span className="text-xs font-medium text-text-primary">{doc.label}</span>
            {kyc.documentType === doc.value && (
              <Check size={14} className="text-gold" />
            )}
          </button>
        ))}
      </div>

      {/* Document upload */}
      <div className="space-y-4">
        <UploadZone
          label={t('card.kyc.s3.uploadDoc', { docType: kyc.documentType ? docTypes.find(d => d.value === kyc.documentType)?.label ?? '' : 'document' })}
          subtitle={t('card.kyc.s3.uploadHint')}
          icon={<Upload size={24} />}
          done={kyc.documentUploaded}
          onUpload={() => updateKyc({ documentUploaded: true })}
        />

        <UploadZone
          label={t('card.kyc.s3.selfie')}
          subtitle={t('card.kyc.s3.selfieHint')}
          icon={<Camera size={24} />}
          done={kyc.selfieUploaded}
          onUpload={() => updateKyc({ selfieUploaded: true })}
        />
      </div>
    </div>
  );
}

// ── Step 4: Review & Submit ────────────────────────────────────────────

function KycStep4() {
  const { t } = useTranslation();
  const kyc = useCardStore((s) => s.kyc);
  const updateKyc = useCardStore((s) => s.updateKyc);
  const submitKyc = useCardStore((s) => s.submitKyc);
  const setLifecycle = useCardStore((s) => s.setLifecycle);

  const countryName = (code: string) =>
    COUNTRIES.find((c) => c.code === code)?.name ?? code;

  const docLabel =
    kyc.documentType === 'passport'
      ? t('card.kyc.s3.passport')
      : kyc.documentType === 'id_card'
        ? t('card.kyc.s3.idCard')
        : t('card.kyc.s3.driversLicense');

  return (
    <div>
      <h2 className="font-display text-xl text-text-primary mb-6">
        {t('card.kyc.s4.title')}
      </h2>

      <div className="bg-surface-card border border-border rounded-xl p-5 space-y-5">
        {/* Personal */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
              {t('card.kyc.s4.personalInfo')}
            </h4>
            <p className="text-sm text-text-primary">
              {kyc.firstName} {kyc.lastName}
            </p>
            <p className="text-sm text-text-secondary">
              {t('card.kyc.s4.born', { date: kyc.dateOfBirth })} &middot; {countryName(kyc.nationality)}
            </p>
          </div>
          <button
            onClick={() => setLifecycle('kyc_step_1')}
            className="text-xs text-primary hover:underline"
          >
            {t('card.kyc.s4.edit')}
          </button>
        </div>

        <hr className="border-border-light" />

        {/* Address */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
              {t('card.kyc.s4.address')}
            </h4>
            <p className="text-sm text-text-primary">{kyc.addressLine1}</p>
            {kyc.addressLine2 && (
              <p className="text-sm text-text-primary">{kyc.addressLine2}</p>
            )}
            <p className="text-sm text-text-secondary">
              {kyc.postalCode} {kyc.city}, {countryName(kyc.country)}
            </p>
          </div>
          <button
            onClick={() => setLifecycle('kyc_step_2')}
            className="text-xs text-primary hover:underline"
          >
            {t('card.kyc.s4.edit')}
          </button>
        </div>

        <hr className="border-border-light" />

        {/* Document */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
              {t('card.kyc.s4.document')}
            </h4>
            <p className="text-sm text-text-primary">
              {docLabel} <Check size={12} className="inline text-success" />
            </p>
            <p className="text-sm text-text-primary">
              {t('card.kyc.s4.selfie')} <Check size={12} className="inline text-success" />
            </p>
          </div>
          <button
            onClick={() => setLifecycle('kyc_step_3')}
            className="text-xs text-primary hover:underline"
          >
            {t('card.kyc.s4.edit')}
          </button>
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 mt-6 cursor-pointer">
        <input
          type="checkbox"
          checked={kyc.termsAccepted}
          onChange={(e) => updateKyc({ termsAccepted: e.target.checked })}
          className="mt-0.5 w-4 h-4 rounded border-border text-gold focus:ring-gold"
        />
        <span className="text-sm text-text-secondary leading-tight">
          {t('card.kyc.s4.terms')}
        </span>
      </label>

      <Button
        variant="gold-cta"
        fullWidth
        size="lg"
        className="mt-6"
        disabled={!kyc.termsAccepted}
        onClick={submitKyc}
      >
        {t('card.kyc.s4.submit')}
      </Button>
    </div>
  );
}

// ── Shared Components ──────────────────────────────────────────────────

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-text-muted mb-1.5 block">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function UploadZone({
  label,
  subtitle,
  icon,
  done,
  onUpload,
}: {
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  done: boolean;
  onUpload: () => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onUpload}
      className={`w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-colors ${
        done
          ? 'border-success bg-success-light/30'
          : 'border-border hover:border-gold hover:bg-gold-light/20'
      }`}
    >
      {done ? (
        <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center">
          <Check size={20} className="text-white" />
        </div>
      ) : (
        <div className="text-text-muted">{icon}</div>
      )}
      <span className="text-sm font-medium text-text-primary">
        {done ? t('card.kyc.s3.uploaded') : label}
      </span>
      {!done && (
        <span className="text-xs text-text-muted">{subtitle}</span>
      )}
    </button>
  );
}
