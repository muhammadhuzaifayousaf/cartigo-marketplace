import { Loader2 } from 'lucide-react'

/**
 * PageLoader — reusable loading fallback rendered by <Suspense> while a
 * lazy-loaded page chunk is being fetched. Ensures the user never sees a
 * blank screen during route transitions.
 */
export default function PageLoader() {
  return (
    <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center gap-3">
      <Loader2 size={36} className="animate-spin text-primary" />
      <p className="text-sm text-text-muted">Loading…</p>
    </div>
  )
}
