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
    <div className="min-h-screen flex font-sans antialiased bg-[#f2f4f6] select-none">

      {/* ── LEFT PANEL — desktop only ─────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-14 overflow-hidden bg-white border-r border-[#e0e3e5]">

        {/* Subtle blue blob top-left */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] opacity-40"
          style={{ background: 'radial-gradient(circle, #dbe1ff 0%, transparent 70%)' }} />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full blur-[120px] opacity-30"
          style={{ background: 'radial-gradient(circle, #dae2fd 0%, transparent 70%)' }} />

        {/* Brand top */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0051d5] flex items-center justify-center shadow-md">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#191c1e] tracking-tight">{APP_NAME}</span>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col gap-10">
          <div>
            <h2 className="text-[52px] font-bold text-[#191c1e] leading-[1.1] tracking-tight">
              Attendance,<br />
              <span className="text-[#0051d5]">Reimagined.</span>
            </h2>
            <p className="mt-4 text-[#45464d] text-lg leading-relaxed max-w-sm">
              Fast QR-based attendance tracking built for modern institutions.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#f2f4f6] border border-[#e0e3e5] hover:border-[#0051d5]/40 hover:bg-[#dbe1ff]/30 transition-all duration-200 cursor-default">
                <Icon className="w-4 h-4 text-[#0051d5]" />
                <span className="text-sm font-medium text-[#45464d]">{label}</span>
              </div>
            ))}
          </div>


        </div>

        <p className="relative z-10 text-xs text-[#c6c6cd]">© {new Date().getFullYear()} {APP_NAME}</p>
      </div>

      {/* ── RIGHT PANEL — form ────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

        {/* Very subtle bg accent */}
        <div className="pointer-events-none absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[120px] opacity-40"
          style={{ background: 'radial-gradient(circle, #dbe1ff 0%, transparent 70%)' }} />

        <div className="w-full max-w-[400px] relative z-10 flex flex-col gap-6">

          {/* Mobile brand header */}
          <div className="lg:hidden flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#0051d5] flex items-center justify-center shadow-lg">
              <QrCode className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight">{APP_NAME}</h1>
              <p className="text-sm text-[#76777d] mt-0.5">QR Attendance Management</p>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-[#e0e3e5] shadow-xl shadow-black/5 p-8 flex flex-col gap-6">

            <div>
              <h2 className="text-xl font-bold text-[#191c1e]">Sign in</h2>
              <p className="text-sm text-[#76777d] mt-1">Enter your credentials to continue</p>
            </div>

            {apiError && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-[#ba1a1a] bg-[#ffdad6]/60 border border-[#ba1a1a]/20">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {apiError}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>

              {/* Email / ID */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="identifier" className="text-sm font-semibold text-[#191c1e]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777d] pointer-events-none" />
                  <input
                    id="identifier"
                    type="text"
                    placeholder="admin@school.edu"
                    {...register('identifier')}
                    disabled={loginMutation.isPending}
                    className={`w-full h-12 pl-10 pr-4 rounded-xl text-sm text-[#191c1e] placeholder-[#c6c6cd] bg-[#f7f9fb] outline-none transition-all duration-200 disabled:opacity-50 border ${
                      errors.identifier
                        ? 'border-[#ba1a1a] focus:ring-2 focus:ring-[#ba1a1a]/20'
                        : 'border-[#e0e3e5] focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/15'
                    }`}
                  />
                </div>
                {errors.identifier && <span className="text-xs text-[#ba1a1a] pl-0.5">{errors.identifier.message}</span>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-[#191c1e]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777d] pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    disabled={loginMutation.isPending}
                    className={`w-full h-12 pl-10 pr-11 rounded-xl text-sm text-[#191c1e] placeholder-[#c6c6cd] bg-[#f7f9fb] outline-none transition-all duration-200 disabled:opacity-50 border ${
                      errors.password
                        ? 'border-[#ba1a1a] focus:ring-2 focus:ring-[#ba1a1a]/20'
                        : 'border-[#e0e3e5] focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/15'
                    }`}
                  />
                  <button type="button" aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#45464d] cursor-pointer transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-xs text-[#ba1a1a] pl-0.5">{errors.password.message}</span>}
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-12 mt-1 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-lg shadow-[#0051d5]/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? (
                  <><LoadingSpinner size="sm" label="" /><span>Signing in...</span></>
                ) : (
                  <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-[#c6c6cd]">
              Demo: use any email &amp; password with 6+ characters
            </p>
          </div>

          <p className="text-center text-xs text-[#c6c6cd] lg:hidden">
            © {new Date().getFullYear()} {APP_NAME}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
