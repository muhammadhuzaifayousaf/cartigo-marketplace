import { createContext, useContext, useCallback, useMemo } from 'react'
import useLocalStorage from '../../shared/hooks/useLocalStorage'

const CartContext = createContext()

const CART_STORAGE_KEY = 'shopcart_items'

/**
 * CartProvider — global cart state persisted to localStorage.
 *
 * Uses the shared useLocalStorage hook (instead of manual getItem/setItem)
 * so serialization, corruption handling and persistence live in one place.
 * Handler functions are wrapped in useCallback and the context value is
 * memoized so memoized consumers (e.g. ProductCard) are not re-rendered
 * when unrelated state changes.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage(
    CART_STORAGE_KEY,
    [],
    (stored) => (Array.isArray(stored) ? stored : [])
  )

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        )
      }
      return [...prev, { ...product, qty }]
    })
  }, [setItems])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [setItems])

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.min(qty, 99) } : item))
    )
  }, [setItems])

  const clearCart = useCallback(() => setItems([]), [setItems])

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }),
    [items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
