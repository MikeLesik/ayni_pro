import { Navigate } from 'react-router-dom';
import { WelcomeCarousel } from '@/components/onboarding/WelcomeCarousel';
import { useOnboardingStore } from '@/stores/onboardingStore';

export default function WelcomeCarouselPage() {
  const carouselCompleted = useOnboardingStore((s) => s.carouselCompleted);

  if (carouselCompleted) {
    return <Navigate to="/home" replace />;
  }

  return <WelcomeCarousel />;
}
