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
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center select-none font-sans">
          <div className="w-16 h-16 bg-error-container border border-error/20 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
          <h1 className="text-title-md font-bold text-primary mb-2 tracking-tight">Something went wrong</h1>
          <p className="text-on-surface-variant max-w-md mb-6 text-body-sm leading-relaxed">
            An unexpected error occurred during rendering. Details: {this.state.error?.message || 'Unknown Error'}
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-on-secondary-fixed-variant active:scale-[0.97] text-on-secondary font-semibold rounded-lg transition-all duration-200 shadow-sm shadow-secondary/25 hover:shadow-md text-label-md cursor-pointer"
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
