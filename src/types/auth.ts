export type KycStatus = 'none' | 'pending' | 'verified' | 'rejected';
export type UserTier = 'standard' | 'premium';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  tier: UserTier;
  kycStatus: KycStatus;
  country?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
