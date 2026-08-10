import { useState, useEffect } from 'react'

/**
 * useDebounce — return a debounced copy of `value`.
 *
 * The returned value only updates after `value` has stopped changing for
 * `delay` ms. Used to defer expensive work (e.g. filtering the product
 * list while the user types in the search box) until typing pauses.
 *
 * @param {*}   value  the changing value to debounce
 * @param {number} delay debounce delay in milliseconds (search uses 400ms)
 * @returns {*} the debounced value
 */
export default function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    // Cleanup cancels the pending timer on every change/unmount so stale
    // updates never fire after the value has already changed again.
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
