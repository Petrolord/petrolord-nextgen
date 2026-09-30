import React from 'react';
import { readLastTheme } from '@/design/ThemeProvider';

// The panel is a design-system scope of its own (as the themed loader is):
// the root boundary sits outside every scope, and an error can take the
// page scope down with it. It paints the theme this device last resolved,
// light when unknown.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          data-pl-theme={readLastTheme() || 'light'}
          data-pl-root=""
          data-testid="error-boundary-panel"
          role="alert"
          className="min-h-screen flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full bg-pl-surface p-6 rounded-lg border border-pl-danger/40 shadow-pl-lg">
            <h2 className="text-xl font-bold text-pl-danger-text mb-2">Something went wrong</h2>
            <p className="text-pl-muted mb-6 text-sm">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-pl-sunken hover:bg-pl-border text-pl-text px-4 py-2 rounded text-sm font-medium transition-colors border border-pl-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
