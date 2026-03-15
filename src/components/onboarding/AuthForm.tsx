import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { useTranslation } from '@/i18n';
import * as authService from '@/services/authService';

type FormData = { email: string; password: string };
type Mode = 'register' | 'login';

export function AuthForm() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('register');
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const schema = z.object({
    email: z.string().email(t('auth.validationEmail')),
    password: z.string().min(8, t('auth.validationPassword')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      if (mode === 'register') {
        await authService.register(data.email, data.password);
      } else {
        await authService.login(data.email, data.password);
      }
      if (mode === 'register') {
        navigate('/welcome', { replace: true });
      } else {
        const redirect = searchParams.get('redirect');
        navigate(redirect ? decodeURIComponent(redirect) : '/home', { replace: true });
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t('auth.genericError'));
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === 'register' ? 'login' : 'register'));
    setServerError(null);
  };

  const isRegister = mode === 'register';

  return (
    <div>
      {/* Title & subtitle */}
      <h2 className="text-center text-heading-2 text-text-primary">
        {isRegister ? t('auth.title.register') : t('auth.title.login')}
      </h2>
      <p className="mb-8 mt-2 text-center text-body-lg text-text-secondary">
        {isRegister ? t('auth.subtitle.register') : t('auth.subtitle.login')}
      </p>

      {/* OAuth buttons */}
      <Tooltip content={t('common.comingSoon')} side="top">
        <Button variant="secondary" fullWidth disabled leftIcon={<GoogleIcon />}>
          {t('auth.continueWithGoogle')}
        </Button>
      </Tooltip>
      <Tooltip content={t('common.comingSoon')} side="bottom">
        <Button variant="secondary" fullWidth disabled leftIcon={<AppleIcon />} className="mt-3">
          {t('auth.continueWithApple')}
        </Button>
      </Tooltip>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-body-sm text-text-muted">{t('auth.or')}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">
          <Input
            label={t('auth.emailLabel')}
            type="email"
            autoComplete="email"
            placeholder={t('auth.emailPlaceholder')}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label={t('auth.passwordLabel')}
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            placeholder={t('auth.passwordPlaceholder')}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {serverError && (
          <p className="mt-3 text-center text-body-sm text-error" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" fullWidth loading={isSubmitting} className="mt-4">
          {isRegister ? t('auth.continue') : t('auth.signIn')}
        </Button>
      </form>

      {/* Toggle link */}
      <p className="mt-4 text-center text-body-sm text-text-secondary">
        {isRegister ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
        <button
          type="button"
          onClick={toggleMode}
          className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          {isRegister ? t('auth.signInLink') : t('auth.signUpLink')}
        </button>
      </p>

      {/* Terms */}
      {isRegister && (
        <p className="mt-6 text-center text-body-sm text-text-muted">
          {t('auth.termsAgreement')}
          <a href="/terms" className="underline hover:text-text-secondary">
            {t('auth.termsLink')}
          </a>
          {t('auth.and')}
          <a href="/privacy" className="underline hover:text-text-secondary">
            {t('auth.privacyLink')}
          </a>
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <path d="M14.94 14.656c-.437 1.005-.647 1.453-1.21 2.34-.785 1.237-1.893 2.777-3.265 2.79-1.218.015-1.531-.793-3.183-.783-1.652.01-1.996.8-3.215.786-1.372-.014-2.42-1.4-3.205-2.637C-.719 13.844-.45 9.6 1.263 7.3c1.213-1.63 3.14-2.588 4.86-2.588 1.463 0 2.382.8 3.592.8 1.174 0 1.89-.802 3.582-.802 1.533 0 3.24.834 4.448 2.275-3.907 2.142-3.274 7.73.698 9.172ZM11.73.715C12.384-.11 12.86-1.27 12.69-2.45c-1.042.07-2.26.735-2.972 1.6-.645.785-1.178 1.954-.97 3.088 1.137.035 2.312-.643 2.982-1.523Z" />
    </svg>
  );
}
