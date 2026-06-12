"use client";

import React from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Unhandled error:', error, info);
  }

  componentDidMount() {
    // Auto-recovery: when tab becomes visible after an error,
    // attempt to clear the error and re-render children.
    this._handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && this.state.hasError) {
        console.log('[ErrorBoundary] Tab visible after error, attempting auto-recovery');
        this.setState({ hasError: false, error: undefined });
      }
    };
    document.addEventListener('visibilitychange', this._handleVisibilityChange);
  }

  componentWillUnmount() {
    if (this._handleVisibilityChange) {
      document.removeEventListener('visibilitychange', this._handleVisibilityChange);
    }
  }

  private _handleVisibilityChange?: () => void;

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Terjadi Kesalahan</h1>
            <p className="text-sm text-slate-500 mb-6">
              Terjadi kesalahan yang tidak terduga. Silakan coba lagi atau refresh halaman.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                  Detail teknis
                </summary>
                <pre className="mt-2 p-3 rounded-lg bg-slate-100 text-xs text-slate-600 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Coba Lagi
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
