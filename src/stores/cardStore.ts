import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uid } from '@/lib/uid';
import { getCardPrivileges } from '@/lib/cardConfig';
import { useTierData } from '@/hooks/useTierData';
import type { AyniTier } from '@/lib/cardConfig';

// ── Types ────────────────────────────────────────────────────────────────

export type CardLifecycle =
  | 'not_eligible'
  | 'eligible'
  | 'kyc_step_1'
  | 'kyc_step_2'
  | 'kyc_step_3'
  | 'kyc_step_4'
  | 'kyc_submitted'
  | 'kyc_in_review'
  | 'kyc_approved'
  | 'card_issuing'
  | 'active'
  | 'frozen'
  | 'blocked';

export type PhysicalCardState =
  | 'not_eligible'
  | 'eligible'
  | 'requested'
  | 'production'
  | 'shipped'
  | 'delivered'
  | 'active';

export interface KycFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
  documentType: '' | 'passport' | 'id_card' | 'drivers_license';
  documentUploaded: boolean;
  selfieUploaded: boolean;
  termsAccepted: boolean;
}

export interface CardTransaction {
  id: string;
  type: 'purchase' | 'topup' | 'atm' | 'refund' | 'cashback' | 'fee';
  merchant: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'declined';
  declineReason?: string;
}

export interface VirtualCardDetails {
  number: string;
  last4: string;
  expiry: string;
  cvv: string;
  holderName: string;
}

export interface PhysicalCardDetails {
  last4: string;
  expiry: string;
  shippingAddress: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface CardState {
  lifecycle: CardLifecycle;
  physicalCard: PhysicalCardState;

  virtualCard: VirtualCardDetails | null;
  physicalCardDetails: PhysicalCardDetails | null;

  cardBalance: number;
  cardCurrency: 'EUR' | 'USD';
  paxgAvailable: number;
  goldPriceEur: number;

  dailySpent: number;
  monthlySpent: number;
  monthlyToppedUp: number;

  transactions: CardTransaction[];

  kyc: KycFormData;

  contactlessEnabled: boolean;
  onlinePaymentsEnabled: boolean;
  atmEnabled: boolean;
  spendingNotifications: boolean;
  autoTopUp: {
    enabled: boolean;
    threshold: number;
    amount: number;
  };

  demoMode: boolean;
  cardDetailsRevealed: boolean;

  // Actions
  startKyc: () => void;
  updateKyc: (fields: Partial<KycFormData>) => void;
  advanceKycStep: () => void;
  goBackKycStep: () => void;
  submitKyc: () => void;
  _simulateReview: () => void;
  _issueCard: () => void;

  freezeCard: () => void;
  unfreezeCard: () => void;
  revealDetails: () => void;
  hideDetails: () => void;

  topUp: (paxgAmount: number, tierOverride?: AyniTier) => {
    success: boolean;
    error?: string;
    eurReceived?: number;
  };

  spend: (merchant: string, amount: number, category: string, tierOverride?: AyniTier) => {
    success: boolean;
    error?: string;
  };

  requestPhysicalCard: (address: string) => void;
  advancePhysicalCardState: () => void;
  activatePhysicalCard: () => void;

  toggleCardSetting: (
    key: 'contactlessEnabled' | 'onlinePaymentsEnabled' | 'atmEnabled' | 'spendingNotifications',
  ) => void;
  setAutoTopUp: (settings: Partial<CardState['autoTopUp']>) => void;

  setLifecycle: (state: CardLifecycle) => void;
  setPhysicalCard: (state: PhysicalCardState) => void;
  addPaxg: (amount: number) => void;
  setCardBalance: (amount: number) => void;
  setGoldPrice: (price: number) => void;
  resetAll: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function daysAgo(days: number, hoursOffset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hoursOffset);
  return d.toISOString();
}

function generateCardNumber(): string {
  const groups = ['4157'];
  for (let i = 0; i < 3; i++) {
    groups.push(String(Math.floor(1000 + Math.random() * 9000)));
  }
  return groups.join(' ');
}

// ── Initial KYC form ─────────────────────────────────────────────────────

const EMPTY_KYC: KycFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  nationality: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  country: '',
  documentType: '',
  documentUploaded: false,
  selfieUploaded: false,
  termsAccepted: false,
};

// ── Mock transactions ────────────────────────────────────────────────────

const MOCK_TRANSACTIONS: CardTransaction[] = [
  { id: 'tx-001', type: 'purchase', merchant: 'Amazon EU', category: 'Online Shopping', amount: 89.99, currency: 'EUR', date: daysAgo(0, 0), status: 'completed' },
  { id: 'tx-002', type: 'purchase', merchant: 'Uber', category: 'Transportation', amount: 14.50, currency: 'EUR', date: daysAgo(0, 2), status: 'completed' },
  { id: 'tx-003', type: 'topup', merchant: 'PAXG → EUR', category: 'Top Up', amount: 750.00, currency: 'EUR', date: daysAgo(1), status: 'completed' },
  { id: 'tx-004', type: 'purchase', merchant: 'Bolt Food', category: 'Food Delivery', amount: 27.80, currency: 'EUR', date: daysAgo(1), status: 'completed' },
  { id: 'tx-005', type: 'purchase', merchant: 'Continente', category: 'Groceries', amount: 83.47, currency: 'EUR', date: daysAgo(2), status: 'completed' },
  { id: 'tx-006', type: 'purchase', merchant: 'Apple Services', category: 'Digital Services', amount: 9.99, currency: 'EUR', date: daysAgo(3), status: 'completed' },
  { id: 'tx-007', type: 'purchase', merchant: 'Pingo Doce', category: 'Groceries', amount: 52.13, currency: 'EUR', date: daysAgo(4), status: 'completed' },
  { id: 'tx-008', type: 'atm', merchant: 'ATM Multibanco', category: 'Cash Withdrawal', amount: 200.00, currency: 'EUR', date: daysAgo(5), status: 'completed' },
  { id: 'tx-009', type: 'topup', merchant: 'PAXG → EUR', category: 'Top Up', amount: 1000.00, currency: 'EUR', date: daysAgo(7), status: 'completed' },
  { id: 'tx-010', type: 'purchase', merchant: 'Zara', category: 'Clothing', amount: 129.90, currency: 'EUR', date: daysAgo(8), status: 'completed' },
  { id: 'tx-011', type: 'purchase', merchant: 'Wolt', category: 'Food Delivery', amount: 19.50, currency: 'EUR', date: daysAgo(10), status: 'completed' },
  { id: 'tx-012', type: 'purchase', merchant: 'Netflix', category: 'Entertainment', amount: 15.49, currency: 'EUR', date: daysAgo(12), status: 'completed' },
  { id: 'tx-013', type: 'cashback', merchant: 'PAXG Cashback', category: 'Cashback', amount: 0, currency: 'EUR', date: daysAgo(12), status: 'completed' },
  { id: 'tx-014', type: 'topup', merchant: 'PAXG → EUR', category: 'Top Up', amount: 2750.00, currency: 'EUR', date: daysAgo(15), status: 'completed' },
  { id: 'tx-015', type: 'purchase', merchant: 'TAP Air Portugal', category: 'Travel', amount: 347.00, currency: 'EUR', date: daysAgo(20), status: 'declined', declineReason: 'Daily limit exceeded' },
];

// ── Initial state ────────────────────────────────────────────────────────

const initialState: Omit<
  CardState,
  | 'startKyc' | 'updateKyc' | 'advanceKycStep' | 'goBackKycStep' | 'submitKyc'
  | '_simulateReview' | '_issueCard'
  | 'freezeCard' | 'unfreezeCard' | 'revealDetails' | 'hideDetails'
  | 'topUp' | 'spend'
  | 'requestPhysicalCard' | 'advancePhysicalCardState' | 'activatePhysicalCard'
  | 'toggleCardSetting' | 'setAutoTopUp'
  | 'setLifecycle' | 'setPhysicalCard' | 'addPaxg' | 'setCardBalance' | 'setGoldPrice' | 'resetAll'
> = {
  lifecycle: 'active',
  physicalCard: 'not_eligible',

  virtualCard: {
    number: '4157 8900 7431 2856',
    last4: '2856',
    expiry: '03/29',
    cvv: '419',
    holderName: 'YURIY DEMO',
  },
  physicalCardDetails: null,

  cardBalance: 1247.83,
  cardCurrency: 'EUR',
  paxgAvailable: 0.089,
  goldPriceEur: 2793.75,

  dailySpent: 104.49,
  monthlySpent: 3847.21,
  monthlyToppedUp: 4500.00,

  transactions: MOCK_TRANSACTIONS,

  kyc: {
    firstName: 'Yuriy',
    lastName: 'Demo',
    dateOfBirth: '1990-01-15',
    nationality: 'PT',
    addressLine1: 'Rua Augusta 100',
    addressLine2: '',
    city: 'Lisboa',
    postalCode: '1100-015',
    country: 'PT',
    documentType: 'passport',
    documentUploaded: true,
    selfieUploaded: true,
    termsAccepted: true,
  },

  contactlessEnabled: true,
  onlinePaymentsEnabled: true,
  atmEnabled: true,
  spendingNotifications: true,
  autoTopUp: {
    enabled: false,
    threshold: 100,
    amount: 250,
  },

  demoMode: false,
  cardDetailsRevealed: false,
};

// ── Store ────────────────────────────────────────────────────────────────

export const useCardStore = create<CardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ── KYC Flow ─────────────────────────────────────────────

      startKyc: () =>
        set({
          lifecycle: 'kyc_step_1',
          kyc: EMPTY_KYC,
        }),

      updateKyc: (fields) =>
        set((s) => ({
          kyc: { ...s.kyc, ...fields },
        })),

      advanceKycStep: () =>
        set((s) => {
          const steps: CardLifecycle[] = ['kyc_step_1', 'kyc_step_2', 'kyc_step_3', 'kyc_step_4'];
          const idx = steps.indexOf(s.lifecycle);
          if (idx >= 0 && idx < steps.length - 1) {
            return { lifecycle: steps[idx + 1] };
          }
          return {};
        }),

      goBackKycStep: () =>
        set((s) => {
          const steps: CardLifecycle[] = ['eligible', 'kyc_step_1', 'kyc_step_2', 'kyc_step_3', 'kyc_step_4'];
          const idx = steps.indexOf(s.lifecycle);
          if (idx > 0) {
            return { lifecycle: steps[idx - 1] };
          }
          return {};
        }),

      submitKyc: () => {
        const s = get();
        const k = s.kyc;
        if (
          !k.firstName || !k.lastName || !k.dateOfBirth || !k.nationality ||
          !k.addressLine1 || !k.city || !k.postalCode || !k.country ||
          !k.documentType || !k.documentUploaded || !k.selfieUploaded || !k.termsAccepted
        ) return;

        set({ lifecycle: 'kyc_submitted' });
        setTimeout(() => {
          set({ lifecycle: 'kyc_in_review' });
          setTimeout(() => get()._simulateReview(), 3000);
        }, 1500);
      },

      _simulateReview: () => {
        set({ lifecycle: 'kyc_approved' });
        setTimeout(() => get()._issueCard(), 800);
      },

      _issueCard: () => {
        set({ lifecycle: 'card_issuing' });
        const k = get().kyc;
        const number = generateCardNumber();
        const now = new Date();
        const expiryMonth = String(now.getMonth() + 1).padStart(2, '0');
        const expiryYear = String((now.getFullYear() + 3) % 100).padStart(2, '0');

        setTimeout(() => {
          set({
            lifecycle: 'active',
            virtualCard: {
              number,
              last4: number.slice(-4),
              expiry: `${expiryMonth}/${expiryYear}`,
              cvv: String(Math.floor(100 + Math.random() * 900)),
              holderName: `${k.firstName} ${k.lastName}`.toUpperCase(),
            },
            cardBalance: 0,
            paxgAvailable: get().paxgAvailable,
          });
        }, 2500);
      },

      // ── Card Actions ─────────────────────────────────────────

      freezeCard: () =>
        set({ lifecycle: 'frozen' }),

      unfreezeCard: () =>
        set({ lifecycle: 'active' }),

      revealDetails: () => {
        set({ cardDetailsRevealed: true });
        setTimeout(() => set({ cardDetailsRevealed: false }), 10000);
      },

      hideDetails: () =>
        set({ cardDetailsRevealed: false }),

      // ── Top-up ───────────────────────────────────────────────

      topUp: (paxgAmount: number, tierOverride?: AyniTier) => {
        const s = get();
        const tier = tierOverride ?? 'contributor';
        const privileges = getCardPrivileges(tier);

        if (paxgAmount <= 0) return { success: false, error: 'Amount must be positive' };
        if (paxgAmount > s.paxgAvailable) return { success: false, error: 'Insufficient PAXG balance' };

        const grossEur = paxgAmount * s.goldPriceEur;
        const fee = grossEur * (privileges.conversionFeePercent / 100);
        const netEur = grossEur - fee;

        if (s.monthlyToppedUp + grossEur > privileges.monthlyTopUpLimit) {
          const remaining = privileges.monthlyTopUpLimit - s.monthlyToppedUp;
          return { success: false, error: `Exceeds monthly top-up limit (€${remaining.toFixed(0)} remaining)` };
        }

        if (netEur < 10) return { success: false, error: 'Minimum top-up is €10' };

        const txs: CardTransaction[] = [
          {
            id: uid(),
            type: 'topup',
            merchant: 'PAXG → EUR',
            category: 'Top Up',
            amount: netEur,
            currency: 'EUR',
            date: new Date().toISOString(),
            status: 'completed',
          },
        ];

        if (fee > 0.01) {
          txs.push({
            id: uid(),
            type: 'fee',
            merchant: 'Conversion fee',
            category: 'Fee',
            amount: fee,
            currency: 'EUR',
            date: new Date().toISOString(),
            status: 'completed',
          });
        }

        set({
          cardBalance: s.cardBalance + netEur,
          paxgAvailable: Math.max(0, s.paxgAvailable - paxgAmount),
          monthlyToppedUp: s.monthlyToppedUp + grossEur,
          transactions: [...txs, ...s.transactions].slice(0, 50),
        });

        return { success: true, eurReceived: netEur };
      },

      // ── Spending Simulation ──────────────────────────────────

      spend: (merchant: string, amount: number, category: string, tierOverride?: AyniTier) => {
        const s = get();
        const tier = tierOverride ?? 'contributor';
        const privileges = getCardPrivileges(tier);

        const addDeclinedTx = (reason: string) => {
          const tx: CardTransaction = {
            id: uid(),
            type: category === 'Cash Withdrawal' ? 'atm' : 'purchase',
            merchant,
            category,
            amount,
            currency: 'EUR',
            date: new Date().toISOString(),
            status: 'declined',
            declineReason: reason,
          };
          set({ transactions: [tx, ...s.transactions].slice(0, 50) });
          return { success: false as const, error: reason };
        };

        if (s.lifecycle === 'frozen') return addDeclinedTx('Card is frozen');
        if (s.lifecycle !== 'active') return { success: false, error: 'Card is not active' };

        const isOnline = ['Online Shopping', 'Digital Services'].includes(category);
        if (isOnline && !s.onlinePaymentsEnabled) return addDeclinedTx('Online payments disabled');

        const isAtm = category === 'Cash Withdrawal';
        if (isAtm && !s.atmEnabled) return addDeclinedTx('ATM withdrawals disabled');

        if (amount > s.cardBalance) return addDeclinedTx('Insufficient balance');

        if (s.dailySpent + amount > privileges.dailySpendLimit) {
          return addDeclinedTx(`Daily spending limit reached (€${privileges.dailySpendLimit.toLocaleString()})`);
        }

        if (s.monthlySpent + amount > privileges.monthlySpendLimit) {
          return addDeclinedTx(`Monthly spending limit reached (€${privileges.monthlySpendLimit.toLocaleString()})`);
        }

        if (isAtm && s.dailySpent + amount > privileges.dailyAtmLimit) {
          return addDeclinedTx(`Daily ATM limit reached (€${privileges.dailyAtmLimit.toLocaleString()})`);
        }

        const txs: CardTransaction[] = [
          {
            id: uid(),
            type: isAtm ? 'atm' : 'purchase',
            merchant,
            category,
            amount,
            currency: 'EUR',
            date: new Date().toISOString(),
            status: 'completed',
          },
        ];

        let cashbackAmount = 0;
        if (privileges.cashbackPercent > 0) {
          cashbackAmount = amount * (privileges.cashbackPercent / 100);
          txs.push({
            id: uid(),
            type: 'cashback',
            merchant: 'PAXG Cashback',
            category: 'Cashback',
            amount: cashbackAmount,
            currency: 'EUR',
            date: new Date().toISOString(),
            status: 'completed',
          });
        }

        set({
          cardBalance: s.cardBalance - amount,
          dailySpent: s.dailySpent + amount,
          monthlySpent: s.monthlySpent + amount,
          transactions: [...txs, ...s.transactions].slice(0, 50),
        });

        return { success: true };
      },

      // ── Physical Card ────────────────────────────────────────

      requestPhysicalCard: (address: string) => {
        set({
          physicalCard: 'requested',
          physicalCardDetails: {
            last4: String(Math.floor(1000 + Math.random() * 9000)),
            expiry: get().virtualCard?.expiry ?? '03/29',
            shippingAddress: address,
            trackingNumber: `AYNI${Date.now().toString(36).toUpperCase()}`,
            estimatedDelivery: new Date(Date.now() + 10 * 86400000).toLocaleDateString('en-GB'),
          },
        });
      },

      advancePhysicalCardState: () =>
        set((s) => {
          const flow: PhysicalCardState[] = ['requested', 'production', 'shipped', 'delivered'];
          const idx = flow.indexOf(s.physicalCard);
          if (idx >= 0 && idx < flow.length - 1) {
            return { physicalCard: flow[idx + 1] };
          }
          return {};
        }),

      activatePhysicalCard: () =>
        set({ physicalCard: 'active' }),

      // ── Settings ─────────────────────────────────────────────

      toggleCardSetting: (key) =>
        set((s) => ({ [key]: !s[key] })),

      setAutoTopUp: (settings) =>
        set((s) => ({
          autoTopUp: { ...s.autoTopUp, ...settings },
        })),

      // ── Demo Controls ────────────────────────────────────────

      setLifecycle: (state) => set({ lifecycle: state }),
      setPhysicalCard: (state) => set({ physicalCard: state }),
      addPaxg: (amount) => set((s) => ({ paxgAvailable: s.paxgAvailable + amount })),
      setCardBalance: (amount) => set({ cardBalance: amount }),
      setGoldPrice: (price) => set({ goldPriceEur: price }),

      resetAll: () => set({ ...initialState, kyc: EMPTY_KYC }),
    }),
    {
      name: 'ayni-card-v2',
      partialize: (s) => ({
        lifecycle: s.lifecycle,
        physicalCard: s.physicalCard,
        virtualCard: s.virtualCard,
        physicalCardDetails: s.physicalCardDetails,
        cardBalance: s.cardBalance,
        cardCurrency: s.cardCurrency,
        paxgAvailable: s.paxgAvailable,
        goldPriceEur: s.goldPriceEur,
        dailySpent: s.dailySpent,
        monthlySpent: s.monthlySpent,
        monthlyToppedUp: s.monthlyToppedUp,
        transactions: s.transactions,
        kyc: s.kyc,
        contactlessEnabled: s.contactlessEnabled,
        onlinePaymentsEnabled: s.onlinePaymentsEnabled,
        atmEnabled: s.atmEnabled,
        spendingNotifications: s.spendingNotifications,
        autoTopUp: s.autoTopUp,
        demoMode: s.demoMode,
      }),
    },
  ),
);

// ── Hook: Get current tier for card system ───────────────────────────────
// This reads from the existing tier system — does NOT duplicate tier logic.

export function useCardTier(): AyniTier {
  const { tierData } = useTierData();
  return tierData?.currentTier ?? 'contributor';
}
