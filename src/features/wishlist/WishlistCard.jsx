import { Link } from 'react-router-dom'
import { BadgeCheck, ShoppingCart, X } from 'lucide-react'
import { img, formatPrice } from '../../utils/helpers'

/**
 * WishlistCard — a single saved product on the wishlist page.
 * Follows the same design language as ProductCard, plus a one-click
 * "Add to Cart" (moves the item into the cart) and a remove button.
 */
export default function WishlistCard({ item, onAddToCart, onRemove }) {
  return (
    <div className="product-card overflow-hidden group relative">
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors"
        aria-label="Remove from wishlist"
      >
        <X size={15} className="text-text-muted hover:text-danger" />
      </button>

      <Link to={`/products/${item.id}`}>
        <div className="aspect-square bg-bg-light flex items-center justify-center overflow-hidden">
          <img
            src={img(item.image)}
            alt={item.name}
            loading="lazy"
            className="object-contain w-full h-full p-4 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = `https://placehold.co/300x300/f7f7f7/999?text=Image` }}
          />
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary">{formatPrice(item.price)}</span>
            {item.originalPrice && (
              <span className="text-xs text-text-muted line-through">
                {formatPrice(item.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-xs text-text-muted mt-1 flex items-center gap-1 truncate">
            by {item.sellerName || 'ShopHub'}
            <BadgeCheck size={13} className="text-primary flex-shrink-0" />
          </p>

          <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-snug">
            {item.name}
          </p>
        </div>
      </Link>

      <div className="px-3 pb-3 pt-1">
        <button
          type="button"
          onClick={() => onAddToCart(item)}
          className="w-full rounded bg-primary px-3 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition flex items-center justify-center gap-1.5"
        >
          <ShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
