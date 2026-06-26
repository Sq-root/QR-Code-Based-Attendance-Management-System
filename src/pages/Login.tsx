import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Lock, Mail, ArrowRight, QrCode, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLogin } from '../queries/authQueries';
import { ROUTES, APP_NAME } from '../constants';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const FEATURES = [
  { icon: Zap,          label: 'Instant QR scanning' },
  { icon: CheckCircle2, label: 'Auto reports' },
  { icon: ShieldCheck,  label: 'Secure access' },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const loginMutation = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => {
    setApiError(null);
    loginMutation.mutate(
      { identifier: data.identifier, password: data.password, role: 'admin' },
      {
        onSuccess: (res) => {
          toast.success('Signed in successfully!', { description: `Welcome back, ${res.user.name}.` });
          navigate(ROUTES.HOME);
        },
        onError: (err) => {
          const msg = err.message || 'Unable to authenticate. Please check your credentials.';
          setApiError(msg);
          toast.error('Authentication failed', { description: msg });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex font-sans antialiased bg-surface-container-low">

      {/* ── LEFT PANEL — desktop only ─────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-14 overflow-hidden bg-surface-container-lowest border-r border-outline-variant">

        {/* Subtle indigo glow blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] opacity-50"
          style={{ background: 'radial-gradient(circle, #d4d8ff 0%, transparent 70%)' }} />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full blur-[120px] opacity-40"
          style={{ background: 'radial-gradient(circle, #dcd9ff 0%, transparent 70%)' }} />

        {/* Brand top */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-secondary to-on-secondary-fixed-variant flex items-center justify-center shadow-lg shadow-secondary/30">
            <QrCode className="w-5 h-5 text-on-secondary" />
          </div>
          <span className="text-xl font-bold text-on-surface tracking-tight">{APP_NAME}</span>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col gap-10">
          <div>
            <h2 className="text-[52px] font-bold text-on-surface leading-[1.1] tracking-tight">
              Attendance,<br />
              <span className="text-secondary">Reimagined.</span>
            </h2>
            <p className="mt-4 text-on-surface-variant text-lg leading-relaxed max-w-sm">
              Fast QR-based attendance tracking built for modern institutions.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low border border-outline-variant hover:border-secondary/40 hover:bg-secondary-fixed/30 transition-all duration-200 cursor-default">
                <Icon className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-on-surface-variant">{label}</span>
              </div>
            ))}
          </div>


        </div>

        <p className="relative z-10 text-xs text-on-surface-variant">© {new Date().getFullYear()} {APP_NAME}</p>
      </div>

      {/* ── RIGHT PANEL — form ────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

        {/* Very subtle bg accent */}
        <div className="pointer-events-none absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[120px] opacity-40 lg:hidden"
          style={{ background: 'radial-gradient(circle, #d4d8ff 0%, transparent 70%)' }} />

        <div className="w-full max-w-[400px] relative z-10 flex flex-col gap-6">

          {/* Mobile brand header */}
          <div className="lg:hidden flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-secondary to-on-secondary-fixed-variant flex items-center justify-center shadow-lg shadow-secondary/30">
              <QrCode className="w-7 h-7 text-on-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-on-surface tracking-tight">{APP_NAME}</h1>
              <p className="text-sm text-on-surface-variant mt-0.5">QR Attendance Management</p>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xl p-8 flex flex-col gap-6">

            <div>
              <h2 className="text-xl font-bold text-on-surface">Sign in</h2>
              <p className="text-sm text-on-surface-variant mt-1">Enter your credentials to continue</p>
            </div>

            {apiError && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-error bg-error-container/60 border border-error/20">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {apiError}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>

              {/* Email / ID */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="identifier" className="text-sm font-semibold text-on-surface">
                  Email or ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                  <input
                    id="identifier"
                    type="text"
                    placeholder="admin@school.edu"
                    {...register('identifier')}
                    disabled={loginMutation.isPending}
                    className={`w-full h-12 pl-10 pr-4 rounded-xl text-sm text-on-surface placeholder-outline-variant bg-surface outline-none transition-all duration-200 disabled:opacity-50 border ${
                      errors.identifier
                        ? 'border-error focus:ring-2 focus:ring-error/20'
                        : 'border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/15'
                    }`}
                  />
                </div>
                {errors.identifier && <span className="text-xs text-error pl-0.5">{errors.identifier.message}</span>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-on-surface">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    disabled={loginMutation.isPending}
                    className={`w-full h-12 pl-10 pr-11 rounded-xl text-sm text-on-surface placeholder-outline-variant bg-surface outline-none transition-all duration-200 disabled:opacity-50 border ${
                      errors.password
                        ? 'border-error focus:ring-2 focus:ring-error/20'
                        : 'border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/15'
                    }`}
                  />
                  <button type="button" aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant cursor-pointer transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-xs text-error pl-0.5">{errors.password.message}</span>}
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-12 mt-1 rounded-xl bg-secondary hover:bg-on-secondary-fixed-variant active:scale-[0.98] text-on-secondary font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-lg shadow-secondary/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? (
                  <><LoadingSpinner size="sm" label="" /><span>Signing in...</span></>
                ) : (
                  <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

          </div>

          <p className="text-center text-xs text-on-surface-variant lg:hidden">
            © {new Date().getFullYear()} {APP_NAME}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
