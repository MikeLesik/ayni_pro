import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useErrorStore } from '@/stores/errorStore';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    useErrorStore.getState().captureError(error, info.componentStack ?? undefined);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-warning" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">Something went wrong</h2>
          <p className="text-sm text-text-secondary mb-4 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-surface-secondary text-text-primary hover:bg-surface-card transition-colors"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
