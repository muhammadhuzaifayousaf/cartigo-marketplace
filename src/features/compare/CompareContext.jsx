import { createContext, useContext, useCallback, useMemo, useState } from 'react'

const CompareContext = createContext()

export const MAX_COMPARE_ITEMS = 3

/**
 * CompareProvider — global product comparison state (max 3 items).
 *
 * Intentionally held in memory (not localStorage): the selection is cleared
 * whenever the user navigates away from /compare, so there is nothing worth
 * persisting across sessions. Items store a product snapshot (id, name,
 * price, image, category, stock, description) so the compare page renders
 * instantly without an extra catalog fetch.
 */
export function CompareProvider({ children }) {
  const [items, setItems] = useState([])

  const isCompared = useCallback(
    (id) => items.some((item) => item.id === id),
    [items]
  )

  const addItem = useCallback((product) => {
    setItems((prev) =>
      prev.some((item) => item.id === product.id) || prev.length >= MAX_COMPARE_ITEMS
        ? prev
        : [...prev, product]
    )
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearItems = useCallback(() => setItems([]), [])

  const count = items.length

  const value = useMemo(
    () => ({ items, count, isCompared, addItem, removeItem, clearItems }),
    [items, count, isCompared, addItem, removeItem, clearItems]
  )

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
