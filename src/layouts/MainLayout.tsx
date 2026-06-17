import React from 'react';
import { Outlet } from 'react-router-dom';
import { Cpu, RefreshCw, Layers } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../constants';

export const MainLayout: React.FC = () => {
  const queryClient = useQueryClient();
  const [isResetting, setIsResetting] = React.useState(false);

  // Clear query client cache manually to show off TanStack Query reactivity
  const handleClearCache = () => {
    setIsResetting(true);
    queryClient.clear();
    setTimeout(() => {
      setIsResetting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-zinc-100 selection:bg-brand-500/30 selection:text-brand-200">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-dark-950/75 border-b border-dark-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white font-sans bg-clip-text">
                ViteReact<span className="text-brand-400">19</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider -mt-1">
                PRODUCTION TEMPLATE
              </p>
            </div>
          </div>

          {/* Connection Status & Utilities */}
          <div className="flex items-center gap-4">
            
            {/* API Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-dark-900 border border-dark-800 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono text-zinc-400">
                API: {API_BASE_URL.replace('https://', '')}
              </span>
            </div>

            {/* Clear Query Cache Button */}
            <button
              onClick={handleClearCache}
              disabled={isResetting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-900 hover:bg-dark-800 active:scale-95 border border-dark-800 text-zinc-400 hover:text-white rounded-lg transition-all duration-200 text-xs font-medium cursor-pointer"
              title="Reset TanStack Query cache to trigger refetching"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-brand-400' : ''}`} />
              <span className="hidden md:inline">Reset Cache</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        <Outlet />
      </main>

      {/* Footer Info */}
      <footer className="mt-auto py-6 border-t border-dark-900 bg-dark-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-zinc-500 font-sans">
            &copy; {new Date().getFullYear()} React 19 Starter Template. Open source boilerplate.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-brand-500" />
              React 19.2
            </span>
            <span>&bull;</span>
            <span>Query v5</span>
            <span>&bull;</span>
            <span>Axios 1.7</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
