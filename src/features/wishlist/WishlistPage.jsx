import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Loader2 } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useWishlist } from './WishlistContext'
import WishlistCard from './WishlistCard'
import { useCart } from '../cart/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { fetchProducts } from '../../services/api'
import { img } from '../../utils/helpers'
import useFetch from '../../shared/hooks/useFetch'

/**
 * WishlistPage — displays every saved product with one-click move-to-cart.
 *
 * Saved snapshots render instantly from localStorage; the catalog fetch is
 * merged on top so prices/stock shown are current where available.
 */
export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const { isSeller } = useAuth()
  const showToast = useToast()

  const { data: catalog = [], loading } = useFetch(() => fetchProducts(), [])

  // Map of id → fresh product so stored snapshots can be enriched.
  const productById = useMemo(() => {
    const map = {}
    catalog.forEach((p) => { map[p.id] = p })
    return map
  }, [catalog])

  const resolvedItems = useMemo(
    () =>
      items
        .filter((item) => item && item.id)
        .map((item) => productById[item.id] || item),
    [items, productById]
  )

  const handleAddToCart = (item) => {
    if (isSeller) {
      showToast('Sellers cannot buy products.', { type: 'info', duration: 3000 })
      return
    }

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: img(item.image),
      seller: item.seller || null,
      sellerName: item.sellerName || 'ShopHub',
    })
    // Consistent "move to cart" flow: the item leaves the wishlist after
    // being added to the cart so the two lists never hold duplicates.
    removeItem(item.id)
    showToast('Moved to cart!')
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My Wishlist</h1>
            <p className="text-sm text-text-muted mt-1">
              {resolvedItems.length} saved {resolvedItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          {resolvedItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="border border-border-col px-4 py-2 rounded text-danger text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Clear wishlist
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Loader2 size={40} className="animate-spin text-primary mb-3" />
            <p className="text-sm">Loading wishlist...</p>
          </div>
        ) : resolvedItems.length === 0 ? (
          <div className="bg-white rounded-lg border border-border-col p-12 text-center">
            <Heart size={40} className="mx-auto mb-3 text-text-muted" />
            <p className="text-lg text-text-secondary mb-2">Your wishlist is empty</p>
            <p className="text-sm text-text-muted mb-6">
              Save products you love and find them here anytime.
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {resolvedItems.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
