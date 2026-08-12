import { memo } from 'react'
import { BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import StarRating from '../../components/StarRating'
import { img, formatPrice } from '../../utils/helpers'
import { useCart } from '../cart/CartContext'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import WishlistButton from '../wishlist/WishlistButton'
import CompareButton from '../compare/CompareButton'

// ── Grid Card ──────────────────────────────────────────────────────────────
function GridCard({ product, onAddToCart }) {
  const rating = product.totalReviews > 0 ? product.averageRating : product.rating
  const reviewCount = product.totalReviews > 0 ? product.totalReviews : product.reviews || 0

  return (
    <div className="product-card overflow-hidden group relative">
      <WishlistButton
        product={product}
        size={16}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow"
      />
      <CompareButton
        product={product}
        className="absolute top-2 left-2 z-10 bg-white rounded-md p-1 shadow"
      />

      <Link to={`/products/${product.id}`}>
        {/* Product image — loading="lazy" defers below-the-fold images */}
        <div className="aspect-square bg-bg-light flex items-center justify-center overflow-hidden">
          <img
            src={img(product.image)}
            alt={product.name}
            loading="lazy"
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
function ListCard({ product, onAddToCart }) {
  const rating = product.totalReviews > 0 ? product.averageRating : product.rating
  const reviewCount = product.totalReviews > 0 ? product.totalReviews : product.reviews || 0

  return (
    <div className="product-card p-4 flex gap-4">
      <Link to={`/products/${product.id}`} className="flex-shrink-0">
        <div className="w-32 h-32 bg-bg-light rounded overflow-hidden flex items-center justify-center">
          <img
            src={img(product.image)}
            alt={product.name}
            loading="lazy"
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

      {/* Right: wishlist + compare */}
      <div className="flex flex-col gap-2 flex-shrink-0 self-start">
        <WishlistButton
          product={product}
          size={18}
          className="self-end p-1"
        />
        <CompareButton product={product} className="self-end bg-white rounded-md p-1 shadow" />
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
// Memoized with React.memo because ProductCard is rendered many times in
// product grids/lists and receives stable props (the same product object and
// a string `mode`). Skipping re-renders here keeps search-typing and filter
// changes cheap — the card's own context reads (cart/wishlist/toast/auth)
// still update when those specific values change.
const ProductCard = memo(function ProductCard({ product, mode = 'grid' }) {
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
    ? <GridCard product={product} onAddToCart={handleAddToCart} />
    : <ListCard product={product} onAddToCart={handleAddToCart} />
})

export default ProductCard
