import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught an uncaught error]', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-2 font-sans">Something went wrong</h1>
          <p className="text-zinc-400 max-w-md mb-6 text-sm font-sans leading-relaxed">
            An unexpected error occurred during rendering. Details: {this.state.error?.message || 'Unknown Error'}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 active:scale-95 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-brand-600/20 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
