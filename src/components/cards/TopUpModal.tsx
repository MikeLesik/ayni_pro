import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useCardStore, useCardTier } from '@/stores/cardStore';
import { getCardPrivileges } from '@/lib/cardConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation } from '@/i18n';

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
}

export function TopUpModal({ open, onClose }: TopUpModalProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  const paxgAvailable = useCardStore((s) => s.paxgAvailable);
  const goldPriceEur = useCardStore((s) => s.goldPriceEur);
  const monthlyToppedUp = useCardStore((s) => s.monthlyToppedUp);
  const topUp = useCardStore((s) => s.topUp);

  const tier = useCardTier();
  const privileges = getCardPrivileges(tier);

  const [paxgInput, setPaxgInput] = useState('');
  const [eurInput, setEurInput] = useState('');
  const [editingPaxg, setEditingPaxg] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [receivedAmount, setReceivedAmount] = useState(0);

  const paxgAmount = parseFloat(paxgInput) || 0;
  const eurGross = paxgAmount * goldPriceEur;
  const fee = eurGross * (privileges.conversionFeePercent / 100);
  const eurNet = eurGross - fee;
  const monthlyRemaining = privileges.monthlyTopUpLimit - monthlyToppedUp;

  // Sync inputs
  useEffect(() => {
    if (editingPaxg && paxgInput) {
      const gross = (parseFloat(paxgInput) || 0) * goldPriceEur;
      const netVal = gross - gross * (privileges.conversionFeePercent / 100);
      setEurInput(netVal > 0 ? netVal.toFixed(2) : '');
    }
  }, [paxgInput, editingPaxg, goldPriceEur, privileges.conversionFeePercent]);

  useEffect(() => {
    if (!editingPaxg && eurInput) {
      const eurVal = parseFloat(eurInput) || 0;
      // Reverse: eurNet = paxg * price * (1 - fee%)
      const multiplier = goldPriceEur * (1 - privileges.conversionFeePercent / 100);
      if (multiplier > 0) {
        setPaxgInput((eurVal / multiplier).toFixed(6));
      }
    }
  }, [eurInput, editingPaxg, goldPriceEur, privileges.conversionFeePercent]);

  const validationError = (() => {
    if (paxgAmount <= 0) return null;
    if (paxgAmount > paxgAvailable) return 'Insufficient PAXG balance';
    if (eurGross > monthlyRemaining) return `Exceeds monthly top-up limit (€${monthlyRemaining.toFixed(0)} remaining)`;
    if (eurNet < 10) return 'Minimum top-up is €10';
    return null;
  })();

  const isValid = paxgAmount > 0 && !validationError;

  function handleConvert() {
    if (!isValid) return;
    setLoading(true);
    setError('');

    setTimeout(() => {
      const result = topUp(paxgAmount, tier);
      setLoading(false);
      if (result.success) {
        setReceivedAmount(result.eurReceived ?? 0);
        setSuccess(true);
      } else {
        setError(result.error ?? 'Conversion failed');
      }
    }, 1200);
  }

  function handleClose() {
    setSuccess(false);
    setPaxgInput('');
    setEurInput('');
    setError('');
    setLoading(false);
    setEditingPaxg(true);
    onClose();
  }

  function setQuickAmount(percent: number) {
    const val = paxgAvailable * percent;
    setPaxgInput(val.toFixed(6));
    setEditingPaxg(true);
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('card.topUp.title')}>
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-6"
          >
            <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mb-4">
              <Check size={32} className="text-success" />
            </div>
            <h3 className="font-display text-xl text-text-primary mb-1">
              {t('card.topUp.successTitle')}
            </h3>
            <p className="text-sm text-text-muted text-center mb-6">
              {t('card.topUp.successDesc', { amount: receivedAmount.toFixed(2) })}
            </p>
            <Button variant="primary" fullWidth onClick={handleClose}>
              {t('card.topUp.done')}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={reducedMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* From PAXG */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-text-muted">{t('card.topUp.paxgBalance')}</span>
                <span className="text-xs text-text-muted">
                  {t('card.topUp.available')}: {paxgAvailable.toFixed(3)} PAXG (~€{(paxgAvailable * goldPriceEur).toFixed(2)})
                </span>
              </div>

              {/* Dual linked inputs */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-medium">
                    PAXG
                  </span>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={paxgInput}
                    onChange={(e) => {
                      setPaxgInput(e.target.value);
                      setEditingPaxg(true);
                    }}
                    placeholder="0.000"
                    className="w-full h-12 pl-14 pr-4 rounded-xl border border-border bg-surface-card text-text-primary text-lg font-mono focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <span className="text-text-muted text-lg">⇄</span>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-medium">
                    EUR
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={eurInput}
                    onChange={(e) => {
                      setEurInput(e.target.value);
                      setEditingPaxg(false);
                    }}
                    placeholder="0.00"
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-surface-card text-text-primary text-lg font-mono focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2 mt-2">
                {[
                  { label: '25%', value: 0.25 },
                  { label: '50%', value: 0.5 },
                  { label: '75%', value: 0.75 },
                  { label: 'Max', value: 1 },
                ].map((q) => (
                  <button
                    key={q.label}
                    onClick={() => setQuickAmount(q.value)}
                    className="flex-1 text-xs font-semibold text-primary bg-primary-light px-2 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Breakdown */}
            {paxgAmount > 0 && (
              <div className="bg-surface-secondary rounded-xl p-4 mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">{t('card.topUp.goldPrice')}</span>
                  <span className="text-text-primary">€{goldPriceEur.toLocaleString()} / oz</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">{t('card.topUp.grossAmount')}</span>
                  <span className="text-text-primary">€{eurGross.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">
                    {t('card.topUp.fee')} ({privileges.conversionFeePercent}%)
                  </span>
                  <span className="text-text-primary">−€{fee.toFixed(2)}</span>
                </div>
                <hr className="border-border-light" />
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-text-primary">{t('card.topUp.youReceive')}</span>
                  <span className="text-success">€{eurNet.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>{t('card.topUp.monthlyUsed')}</span>
                  <span>
                    €{monthlyToppedUp.toLocaleString()} / €{privileges.monthlyTopUpLimit.toLocaleString()}
                  </span>
                </div>
                {eurGross > 0 && (
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>{t('card.topUp.afterTopup')}</span>
                    <span>
                      €{(monthlyToppedUp + eurGross).toLocaleString(undefined, { maximumFractionDigits: 0 })} / €{privileges.monthlyTopUpLimit.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Errors */}
            {validationError && paxgAmount > 0 && (
              <div className="flex items-center gap-2 text-error text-sm mb-4">
                <AlertCircle size={16} />
                <span>{validationError}</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-error text-sm mb-4">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <Button
              variant="gold-cta"
              fullWidth
              size="lg"
              loading={loading}
              disabled={!isValid}
              onClick={handleConvert}
            >
              {t('card.topUp.cta')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
