import { AnimatedOutlet } from './AnimatedOutlet';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-bg px-4">
      <div className="w-full max-w-[420px]">
        <AnimatedOutlet />
      </div>
    </div>
  );
}
