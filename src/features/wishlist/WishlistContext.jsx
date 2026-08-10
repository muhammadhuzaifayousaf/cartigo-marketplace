import { createContext, useContext, useCallback } from 'react'
import useLocalStorage from '../../shared/hooks/useLocalStorage'

const WishlistContext = createContext()

const WISHLIST_STORAGE_KEY = 'shopwishlist_items'

/**
 * WishlistProvider — global wishlist state persisted to localStorage.
 *
 * Reuses the same useLocalStorage hook as the cart (a single persistence
 * system — no separate localStorage handling for wishlist). Items store a
 * product snapshot (id, name, price, image, seller info, …) so the
 * wishlist page renders instantly after a refresh even before the catalog
 * API responds.
 *
 * All handlers are useCallback-wrapped and the context value is stable so
 * memoized consumers are not re-rendered by unrelated state changes.
 */
export function WishlistProvider({ children }) {
  const [items, setItems] = useLocalStorage(
    WISHLIST_STORAGE_KEY,
    [],
    (stored) => (Array.isArray(stored) ? stored : [])
  )

  const isWishlisted = useCallback(
    (id) => items.some((item) => item.id === id),
    [items]
  )

  const addItem = useCallback(
    (product) => {
      setItems((prev) =>
        prev.some((item) => item.id === product.id) ? prev : [...prev, product]
      )
    },
    [setItems]
  )

  const removeItem = useCallback(
    (id) => {
      setItems((prev) => prev.filter((item) => item.id !== id))
    },
    [setItems]
  )

  const toggleItem = useCallback(
    (product) => {
      setItems((prev) => {
        const exists = prev.some((item) => item.id === product.id)
        return exists
          ? prev.filter((item) => item.id !== product.id)
          : [...prev, product]
      })
    },
    [setItems]
  )

  const clearWishlist = useCallback(() => setItems([]), [setItems])

  const count = items.length

  return (
    <WishlistContext.Provider
      value={{ items, count, isWishlisted, addItem, removeItem, toggleItem, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
