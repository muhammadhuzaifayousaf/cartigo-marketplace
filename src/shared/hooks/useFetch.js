import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useFetch — reusable data fetching hook that wraps the existing Axios
 * service layer (src/services/api.js) instead of introducing a second
 * request architecture.
 *
 * Pass an async request function (typically one of the exported API
 * helpers such as `() => fetchProducts()`) plus a dependency array that
 * controls when the request should re-run (e.g. `[id]` for detail pages).
 *
 * @param {Function} requestFn async function returning the resolved data
 * @param {Array}    deps      dependency array controlling re-fetches
 * @returns {{ data, loading, error, refetch }}
 *   - data:    the last resolved response (undefined before/after errors)
 *   - loading: true while a request is in flight
 *   - error:   error message string or null
 *   - refetch: manually re-run the request (used by Retry buttons)
 */
export default function useFetch(requestFn, deps = []) {
  const [data, setData] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Keep the latest request function in a ref so the effect below can
  // depend only on `deps` without going stale, and without forcing callers
  // to memoize inline arrow functions.
  const requestRef = useRef(requestFn)
  useEffect(() => {
    requestRef.current = requestFn
  })

  // Re-run when the caller's dependencies change. The `cancelled` flag
  // ignores stale responses after unmount or dependency changes (avoids
  // setting state on unmounted components / memory leaks).
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const result = await requestRef.current()
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || err?.message || 'Request failed')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    return requestRef.current()
      .then((result) => setData(result))
      .catch((err) => setError(err?.response?.data?.message || err?.message || 'Request failed'))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error, refetch }
}
