import { useState, useEffect } from 'react'

/**
 * useLocalStorage — synchronize React state with localStorage.
 *
 * - Reads the stored value once during initialization (lazy initializer).
 * - Persists every state change to localStorage automatically.
 * - Handles JSON serialization/deserialization safely: corrupt or missing
 *   entries fall back to the provided initial value instead of crashing.
 * - The setter returned is React's native setState, so it also supports the
 *   functional updater pattern (e.g. setValue(prev => ...)).
 *
 * Works for any serializable state (arrays, objects, primitives).
 *
 * @param {string}   key          localStorage key
 * @param {*}        initialValue value used when nothing (valid) is stored
 * @param {Function} [transform]  optional normalizer applied to parsed data
 * @returns {[*, function]}     [value, setValue]
 */
export default function useLocalStorage(key, initialValue, transform) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored !== null) {
        const parsed = JSON.parse(stored)
        return transform ? transform(parsed) : parsed
      }
    } catch {
      // Invalid JSON or storage access blocked — fall through to initial value.
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  // Persist on change. Reads never write, so the only writes happen here
  // when the value actually changes (avoids redundant storage operations).
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Private mode / quota exceeded — fail silently, state still works.
    }
  }, [key, value])

  return [value, setValue]
}
