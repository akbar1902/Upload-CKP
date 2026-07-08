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
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-base)' }}>
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div
              className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--danger-soft)' }}
            >
              <AlertTriangle className="h-9 w-9" style={{ color: 'var(--danger)' }} />
            </div>

            {/* Title */}
            <h1
              className="text-2xl font-semibold mb-3 tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Terjadi Kesalahan
            </h1>

            {/* Description */}
            <p
              className="text-[15px] mb-8 leading-relaxed max-w-sm mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Terjadi kesalahan yang tidak terduga. Silakan coba lagi atau refresh halaman.
            </p>

            {/* Error details */}
            {this.state.error && (
              <details className="mb-8 text-left">
                <summary
                  className="text-[13px] cursor-pointer transition-colors"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Detail teknis
                </summary>
                <pre
                  className="mt-3 p-4 rounded-2xl text-[13px] overflow-auto font-mono"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                >
                  {this.state.error.message}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="btn-primary"
              >
                <RotateCcw className="h-4 w-4" />
                Coba Lagi
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary"
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
