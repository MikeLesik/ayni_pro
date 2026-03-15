import type {
  PortfolioResponse,
  PositionDetailResponse,
  CancelPositionResponse,
  ReinvestResponse,
  StakeResponse,
} from '@/types/portfolio';
import { mockApi } from './mockApi';

export async function getPortfolio(): Promise<PortfolioResponse> {
  return mockApi.getPortfolio();
}

export async function getPositionDetail(id: string): Promise<PositionDetailResponse> {
  return mockApi.getPositionDetail(id);
}

export async function cancelPosition(id: string): Promise<CancelPositionResponse> {
  return mockApi.cancelPosition(id);
}

export async function reinvest(amountPaxg: number, termMonths: number): Promise<ReinvestResponse> {
  return mockApi.reinvest(amountPaxg, termMonths);
}

export async function stakeAyni(ayniAmount: number, termMonths: number): Promise<StakeResponse> {
  return mockApi.stakeAyni(ayniAmount, termMonths);
}

export async function withdrawPaxg(amount: number): Promise<{ status: string }> {
  return mockApi.withdrawPaxg(amount);
}

export async function withdrawAyni(amount: number): Promise<{ status: string }> {
  return mockApi.withdrawAyni(amount);
}
