import { Component } from 'react';
import { AlertOctagon } from 'lucide-react';
import Button from './Button.jsx';

/**
 * Top-level safety net for unexpected render/runtime errors anywhere in the
 * React tree. Never shows a stack trace to the user — that's only logged to
 * the console, and only in development.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Unhandled application error:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500">
            <AlertOctagon className="h-8 w-8" aria-hidden="true" />
          </span>
          <h1 className="text-lg font-semibold text-slate-900">Something went wrong.</h1>
          <p className="max-w-sm text-sm text-slate-500">
            An unexpected error occurred. Reloading the application usually resolves this.
          </p>
          <Button onClick={() => window.location.reload()}>Reload Application</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
