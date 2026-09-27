import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Playground crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-lg border-l-2 border-red-400/70 bg-zinc-900/40 p-4 font-sans">
          <p className="text-sm font-medium text-red-300">El playground ha fallado al iniciar el motor de audio.</p>
          <p className="mt-1 text-xs text-red-400/90">{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
            className="mt-3 rounded-md border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-sm font-medium text-red-200 transition-colors hover:border-red-400/50 hover:bg-red-400/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400/60"
          >
            Recargar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
