import { Heart, BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import { img, formatPrice } from '../utils/helpers'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

// ── Grid Card ──────────────────────────────────────────────────────────────
function GridCard({ product, onWishlist, wishlisted, onAddToCart }) {
  const rating = product.totalReviews > 0 ? product.averageRating : product.rating
  const reviewCount = product.totalReviews > 0 ? product.totalReviews : product.reviews || 0

  return (
    <div className="product-card overflow-hidden group relative">
      {/* Wishlist button */}
      <button
        onClick={(e) => { e.preventDefault(); onWishlist(product.id) }}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow"
        aria-label="Save to wishlist"
      >
        <Heart
          size={16}
          className={wishlisted ? 'fill-danger text-danger' : 'text-text-muted'}
        />
      </button>

      <Link to={`/products/${product.id}`}>
        {/* Product image */}
        <div className="aspect-square bg-bg-light flex items-center justify-center overflow-hidden">
          <img
            src={img(product.image)}
            alt={product.name}
            className="object-contain w-full h-full p-4 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = `https://placehold.co/300x300/f7f7f7/999?text=Image` }}
          />
        </div>

        {/* Info */}
        <div className="p-3">
          {/* Price row */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <StarRating rating={rating} maxRating={5} />
            <span className="text-xs text-text-muted">
              {rating ? rating.toFixed(1) : '—'}
            </span>
            {reviewCount > 0 && (
              <span className="text-xs text-text-muted">({reviewCount})</span>
            )}
          </div>

          {/* Seller */}
          <p className="text-xs text-text-muted mt-1 flex items-center gap-1 truncate">
            by {product.sellerName || 'ShopHub'}
            <BadgeCheck size={13} className="text-primary flex-shrink-0" />
          </p>

          {/* Name */}
          <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-snug">
            {product.name}
          </p>
        </div>
      </Link>
      <div className="px-3 pb-3 pt-1">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onAddToCart(product) }}
          className="w-full rounded bg-primary px-3 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

// ── List Card ──────────────────────────────────────────────────────────────
function ListCard({ product, onWishlist, wishlisted, onAddToCart }) {
  const rating = product.totalReviews > 0 ? product.averageRating : product.rating
  const reviewCount = product.totalReviews > 0 ? product.totalReviews : product.reviews || 0

  return (
    <div className="product-card p-4 flex gap-4">
      <Link to={`/products/${product.id}`} className="flex-shrink-0">
        <div className="w-32 h-32 bg-bg-light rounded overflow-hidden flex items-center justify-center">
          <img
            src={img(product.image)}
            alt={product.name}
            className="object-contain w-full h-full p-2"
            onError={(e) => { e.target.src = `https://placehold.co/200x200/f7f7f7/999?text=Image` }}
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-text-primary hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price + rating */}
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <span className="font-semibold text-lg text-text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          <StarRating rating={rating} maxRating={5} />
          <span className="text-sm text-text-muted">{rating ? rating.toFixed(1) : '—'}</span>
          {reviewCount > 0 && (
            <span className="text-sm text-text-muted">({reviewCount} reviews)</span>
          )}
          <span className="text-text-muted">•</span>
          <span className="text-sm text-text-muted">{product.orders} orders</span>
          {product.freeShipping && (
            <span className="text-sm text-success font-medium">Free Shipping</span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary mt-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-3 flex flex-col gap-3">
          <Link to={`/products/${product.id}`}>
            <span className="text-sm text-primary hover:underline">View details</span>
          </Link>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="w-full rounded bg-primary px-3 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Right: wishlist */}
      <button
        onClick={() => onWishlist(product.id)}
        className="flex-shrink-0 self-start p-1"
        aria-label="Save to wishlist"
      >
        <Heart
          size={18}
          className={wishlisted ? 'fill-danger text-danger' : 'text-text-muted hover:text-danger'}
        />
      </button>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export default function ProductCard({ product, mode = 'grid', wishlistIds = [], onWishlist = () => {} }) {
  const wishlisted = wishlistIds.includes(product.id)
  const { addItem } = useCart()
  const showToast = useToast()
  const { isSeller } = useAuth()

  const handleAddToCart = (p) => {
    if (isSeller) {
      showToast('Sellers cannot buy products.', { type: 'info', duration: 3000 })
      return
    }

    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      image: img(p.image),
      seller: p.seller || null,
      sellerName: p.sellerName || 'ShopHub',
    })
    showToast('Successfully added to cart!')
  }

  return mode === 'grid'
    ? <GridCard product={product} onWishlist={onWishlist} wishlisted={wishlisted} onAddToCart={handleAddToCart} />
    : <ListCard product={product} onWishlist={onWishlist} wishlisted={wishlisted} onAddToCart={handleAddToCart} />
}
