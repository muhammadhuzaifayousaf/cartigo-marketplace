import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * ErrorBoundary — class-based error boundary that catches rendering and
 * lifecycle errors in its children so a failing section never leaves the
 * user with a blank white screen.
 *
 * - getDerivedStateFromError triggers the fallback UI.
 * - componentDidCatch logs the error details to the console for debugging
 *   (technical details are intentionally NOT shown to end users).
 * - The "Try Again" button resets the boundary state so children re-render.
 * - Passing a changing `resetKey` (e.g. the current route) automatically
 *   clears the error when the user navigates to a different page.
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Unhandled error caught:', error, errorInfo)
  }

  componentDidUpdate(prevProps) {
    if (this.props.resetKey !== prevProps.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-light flex items-center justify-center px-4 py-16">
          <div className="bg-white rounded-lg border border-border-col shadow-card p-8 sm:p-10 max-w-md w-full text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle size={28} className="text-danger" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Something went wrong</h2>
            <p className="text-sm text-text-muted mb-6">
              We couldn't load this section correctly.
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
