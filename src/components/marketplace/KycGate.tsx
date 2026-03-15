import { type ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { EmptyState } from '@/components/ui/EmptyState';

interface KycGateProps {
  children: ReactNode;
}

export function KycGate({ children }: KycGateProps) {
  const user = useAuthStore((s) => s.user);
  const isVerified = user?.kycStatus === 'verified';

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm">
      <EmptyState
        illustration={
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
        }
        title="Верификация необходима"
        description="Для участия в P2P-трансферах требуется прохождение верификации"
        ctaLabel="Начать верификацию →"
        onCtaClick={() => {
          // TODO: navigate to KYC verification flow
        }}
        className="bg-surface-card rounded-2xl shadow-lg max-w-md mx-4 py-12"
      />
    </div>
  );
}
