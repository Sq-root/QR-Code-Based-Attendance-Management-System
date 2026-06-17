import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Lock, User, ArrowRight, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLogin } from '../queries/authQueries';
import { ROUTES } from '../constants';

// Define Zod validation schema
const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'admin' | 'attendee'>('admin');
  const [apiError, setApiError] = useState<string | null>(null);

  // TanStack Query Login Mutation
  const loginMutation = useLogin();

  // Setup React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setApiError(null);

    // Call TanStack mutation (using the selected role)
    loginMutation.mutate(
      {
        identifier: data.identifier,
        password: data.password,
        role: role,
      },
      {
        onSuccess: (response) => {
          console.log(`[Login Page] Successfully logged in user: ${response.user.name} (${response.user.role})`);
          
          // Trigger success toast
          toast.success('Signed in successfully!', {
            description: `Welcome back, ${response.user.name}.`,
          });

          // Redirect to dashboard home path
          navigate(ROUTES.HOME);
        },
        onError: (err) => {
          const errMsg = err.message || 'Unable to authenticate. Please check your credentials.';
          setApiError(errMsg);
          
          // Trigger error toast
          toast.error('Authentication failed', {
            description: errMsg,
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop font-sans text-on-surface antialiased relative overflow-hidden select-none">
      {/* Decorative Gradients to match main layout */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary-fixed/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-secondary-container/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Container */}
      <main className="w-full max-w-[400px] sm:max-w-[440px] relative z-10 flex flex-col gap-4">
        
        {/* Mobile Header (matches Stitch mobile layout exactly) */}
        <header className="text-center mb-4 flex flex-col items-center gap-2 sm:hidden">
          <div className="w-16 h-16 bg-secondary-container rounded-xl flex items-center justify-center text-on-secondary-container shadow-sm mb-1">
            <UserCheck className="w-8 h-8 text-on-secondary-container" />
          </div>
          <h1 className="font-sans text-headline-lg-mobile font-semibold text-primary tracking-tight">AttendPro</h1>
          <p className="text-body-sm text-on-surface-variant">Secure Access Portal</p>
        </header>

        {/* Login Form Card */}
        <div className="bg-surface-container-lowest border border-outline-variant shadow-md rounded-xl p-6 sm:p-8 flex flex-col gap-6 transition-all duration-300">
          
          {/* Desktop Branding (matches Stitch desktop layout) */}
          <div className="hidden sm:flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-2 shadow-sm">
              <UserCheck className="w-6 h-6 text-on-primary-fixed" />
            </div>
            <h1 className="font-sans text-headline-lg font-semibold text-primary tracking-tight">
              Attend<span className="text-secondary">Pro</span>
            </h1>
            <p className="text-body-sm text-on-surface-variant">Secure Attendance Verification</p>
          </div>

          {/* Segmented Control Toggle (matches Stitch design exactly) */}
          <div className="flex bg-surface-container p-1 rounded-lg w-full mb-1">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 font-sans text-label-md text-center rounded-md transition-all duration-200 cursor-pointer focus:outline-none ${
                role === 'admin'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-primary font-medium'
              }`}
            >
              Administrator
            </button>
            <button
              type="button"
              onClick={() => setRole('attendee')}
              className={`flex-1 py-2 font-sans text-label-md text-center rounded-md transition-all duration-200 cursor-pointer focus:outline-none ${
                role === 'attendee'
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-primary font-medium'
              }`}
            >
              Attendee
            </button>
          </div>

          {/* Error Message Alert */}
          {apiError && (
            <div className="p-3 bg-error-container/20 border border-error/30 text-error rounded-lg text-xs leading-relaxed">
              {apiError}
            </div>
          )}

          {/* Login Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Input Group: Email/ID */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-label-md font-semibold text-on-surface pl-1" htmlFor="identifier">
                Email or ID
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none flex items-center">
                  <User className="w-4.5 h-4.5" />
                </span>
                <input
                  id="identifier"
                  type="text"
                  placeholder="Enter your credentials"
                  {...register('identifier')}
                  className={`w-full h-12 pl-10 pr-4 bg-surface-container-lowest border ${
                    errors.identifier ? 'border-error' : 'border-outline-variant'
                  } rounded-lg text-body-lg text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors font-sans`}
                  disabled={loginMutation.isPending}
                />
              </div>
              {errors.identifier && (
                <span className="text-error text-xs pl-1 font-sans">{errors.identifier.message}</span>
              )}
            </div>

            {/* Input Group: Password */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="flex justify-between items-center pl-1 pr-1">
                <label className="text-label-md font-semibold text-on-surface" htmlFor="password">
                  Password
                </label>
                <a
                  className="text-label-md font-semibold text-secondary hover:text-on-secondary-fixed-variant transition-colors"
                  href="#forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Password recovery is currently disabled.');
                  }}
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none flex items-center">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full h-12 pl-10 pr-10 bg-surface-container-lowest border ${
                    errors.password ? 'border-error' : 'border-outline-variant'
                  } rounded-lg text-body-lg text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors font-sans`}
                  disabled={loginMutation.isPending}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors focus:outline-none cursor-pointer flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-xs pl-1 font-sans">{errors.password.message}</span>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between mt-1 pl-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded-[4px] border-2 border-outline-variant bg-surface-container-lowest peer-checked:bg-secondary peer-checked:border-secondary peer-checked:[&_svg]:scale-100 peer-focus-visible:ring-2 peer-focus-visible:ring-secondary/50 flex items-center justify-center transition-all duration-150 shadow-xs group-hover:border-secondary/70">
                    <svg
                      className="w-3.5 h-3.5 text-on-secondary stroke-[3.5] scale-0 transition-transform duration-150"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors select-none">
                  Remember device
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <button
              className="w-full h-12 bg-secondary text-on-secondary font-sans text-label-md font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-on-secondary-fixed-variant active:opacity-90 transition-all duration-150 shadow-sm mt-2 cursor-pointer disabled:opacity-50"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" label="" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        </div>

        {/* Mobile-Only Support Link (matches Stitch exactly) */}
        <div className="text-center mt-2 block sm:hidden select-none">
          <p className="text-body-sm text-on-surface-variant font-sans">
            Having trouble?{' '}
            <a 
              className="text-secondary font-semibold hover:underline focus:outline-none" 
              href="#support" 
              onClick={(e) => {
                e.preventDefault();
                toast.info('Support contact form is under development.');
              }}
            >
              Contact Support
            </a>
          </p>
        </div>

        {/* Desktop-Only Footer for Login (matches Stitch exactly) */}
        <div className="mt-8 text-center hidden sm:flex flex-col items-center gap-2 select-none">
          <p className="text-body-sm text-on-surface-variant font-sans">
            &copy; {new Date().getFullYear()} AttendPro Systems.
          </p>
          <div className="flex items-center justify-center gap-4 text-body-sm">
            <a className="text-outline hover:text-on-surface transition-colors" href="#privacy" onClick={(e) => e.preventDefault()}>
              Privacy
            </a>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <a className="text-outline hover:text-on-surface transition-colors" href="#terms" onClick={(e) => e.preventDefault()}>
              Terms
            </a>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <a className="text-outline hover:text-on-surface transition-colors" href="#help" onClick={(e) => e.preventDefault()}>
              Help
            </a>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Login;
