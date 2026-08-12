import { Heart } from 'lucide-react'
import { useWishlist } from './WishlistContext'
import { useAuth } from '../../context/AuthContext'

/**
 * WishlistButton — reusable wishlist toggle used on product cards and any
 * product listing. Reads/writes the shared wishlist context so the state is
 * consistent everywhere and the navbar badge updates immediately.
 * Hidden for sellers since wishlists are a customer-only feature.
 *
 * @param {Object} props
 * @param {Object} props.product   full product object (stored on add)
 * @param {string} props.className extra classes for the button
 * @param {number} props.size      heart icon size
 */
export default function WishlistButton({ product, className = '', size = 16 }) {
  const { isSeller } = useAuth()
  const { isWishlisted, toggleItem } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  if (isSeller) return null

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleItem(product)
      }}
      className={className}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={wishlisted}
    >
      <Heart
        size={size}
        className={wishlisted ? 'fill-danger text-danger' : 'text-text-muted'}
      />
    </button>
  )
}
