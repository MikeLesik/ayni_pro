import { mockApi } from './mockApi';

export interface QuarterlyProjectionItem {
  quarterNumber: number;
  estimatedUsd: number;
  estimatedPaxg: number;
  payoutDate: string;
  label: string; // e.g. "Jun '26"
}

export interface EarnProjectionResponse {
  participationAmount: number;
  termMonths: number;
  estimatedDistributions: number;
  monthlyDistributions: number;
  dailyDistributions: number;
  totalGoldGrams: number;
  monthlyGoldGrams: number;
  dailyGoldGrams: number;
  firstPayoutDate: string;
  goldPriceUsed: number;
  tokensReceived: number;
  disclaimer: string;
  quarterlyProjections: QuarterlyProjectionItem[];
  totalPayouts: number;
  annualYieldPercent: number;
}

export interface CreateParticipationRequest {
  amount: number;
  termMonths: number;
  autoActivate: boolean;
  paymentMethod: string;
  currency: string;
}

export interface CreateParticipationResponse {
  id: string;
  status: 'confirmed';
  amount: number;
  termMonths: number;
  estimatedDistributions: number;
  firstPayoutDate: string;
  createdAt: string;
}

export async function createParticipation(
  req: CreateParticipationRequest,
): Promise<CreateParticipationResponse> {
  return mockApi.participate(req.amount, req.termMonths, req.autoActivate);
}

export async function getProjection(
  amount: number,
  months: number,
): Promise<EarnProjectionResponse> {
  return mockApi.getProjection(amount, months);
}
