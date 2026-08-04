import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, ClipboardList, DollarSign, Clock, CheckCircle2, Loader2, AlertCircle, RefreshCw,
} from 'lucide-react'
import { fetchSellerProducts, fetchSellerOrders } from '../../services/api'
import { fetchSellerReviews } from '../../services/reviewApi'
import { formatPrice } from '../../utils/helpers'
import StarRating from '../../components/StarRating'
import { useAuth } from '../../context/AuthContext'

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function StatCard({ icon: Icon, label, value, accent = 'text-primary bg-primary-light' }) {
  return (
    <div className="bg-white rounded-lg border border-border-col p-3.5 sm:p-5 flex items-center gap-3">
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon size={20} className="sm:hidden" />
        <Icon size={22} className="hidden sm:block" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] sm:text-xs text-text-muted">{label}</p>
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-text-primary leading-snug break-words">
          {value}
        </p>
      </div>
    </div>
  )
}

/**
 * SellerDashboard — overview stats and recent orders.
 */
export default function SellerDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [productData, orderData, reviewData] = await Promise.all([
        fetchSellerProducts(),
        fetchSellerOrders(),
        fetchSellerReviews(),
      ])
      setProducts(productData)
      setOrders(orderData)
      setReviews(reviewData)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <Loader2 size={36} className="animate-spin text-primary mb-3" />
        <p className="text-sm">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-border-col p-12 text-center">
        <AlertCircle size={36} className="mx-auto mb-3 text-danger" />
        <p className="text-lg font-medium text-text-primary mb-1">Unable to load dashboard</p>
        <p className="text-sm text-text-muted mb-4">{error}</p>
        <button onClick={load} className="btn-primary inline-flex items-center gap-2">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    )
  }

  // Revenue = sum of the seller's item lines across DELIVERED orders only.
  const revenue = orders
    .filter((order) => order.status === 'Delivered')
    .reduce(
      (sum, order) =>
        sum +
        order.items
          .filter((item) => item.seller === user?._id)
          .reduce((s, item) => s + item.price * item.qty, 0),
      0
    )
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length
  const completedOrders = orders.filter((o) => o.status === 'Delivered').length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">
          Welcome back, <span className="text-text-secondary font-medium">{user?.name}</span> — here's your store at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <StatCard icon={Package} label="Total Products" value={products.length} />
        <StatCard icon={ClipboardList} label="Total Orders" value={orders.length} accent="text-success bg-green-100" />
        <StatCard icon={CheckCircle2} label="Completed Orders" value={completedOrders} accent="text-primary bg-primary-light" />
        <StatCard icon={DollarSign} label="Revenue" value={formatPrice(revenue)} accent="text-warning bg-orange-100" />
        <StatCard icon={Clock} label="Pending Orders" value={pendingOrders} accent="text-danger bg-red-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent products */}
        <div className="bg-white rounded-lg border border-border-col p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Recent products</h2>
            <Link to="/seller/products" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="text-sm text-text-muted py-6 text-center">
              No products yet.{' '}
              <Link to="/seller/products/add" className="text-primary hover:underline">Add your first product</Link>
            </p>
          ) : (
            <ul className="divide-y divide-border-col">
              {products.slice(0, 5).map((p) => (
                <li key={p._id} className="py-3 flex items-center gap-3">
                  <img
                    src={p.images?.[0] || p.image}
                    alt={p.name}
                    className="w-10 h-10 object-contain border border-border-col rounded bg-bg-light p-1 flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/40x40/f7f7f7/999?text=P' }}
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${p._id}`}
                      className="text-sm font-medium text-text-primary truncate hover:text-primary transition-colors"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-text-muted">{formatPrice(p.price)} · Stock: {p.stock}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-lg border border-border-col p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Recent orders</h2>
            <Link to="/seller/orders" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-text-muted py-6 text-center">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-border-col">
              {orders.slice(0, 5).map((order) => (
                <li key={order._id} className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-text-primary truncate">
                      Order <span className="font-mono text-xs">{order._id.slice(-8)}</span>
                    </p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-light text-primary whitespace-nowrap">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    {order.shippingAddress?.fullName} · {formatPrice(order.total)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent reviews */}
      <div className="bg-white rounded-lg border border-border-col p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-text-primary">Recent reviews</h2>
          <Link to="/seller/products" className="text-sm text-primary hover:underline">
            View products
          </Link>
        </div>
        {reviews.length === 0 ? (
          <p className="text-sm text-text-muted py-6 text-center">
            No reviews yet. Reviews appear here once customers receive their orders.
          </p>
        ) : (
          <ul className="divide-y divide-border-col">
            {reviews.slice(0, 5).map((review) => (
              <li key={review._id} className="py-3">
                <div className="flex items-center justify-between gap-2">
                  <Link
                    to={`/products/${review.product?._id}`}
                    className="text-sm font-medium text-text-primary truncate hover:text-primary transition-colors"
                  >
                    {review.product?.name || 'Product'}
                  </Link>
                  <StarRating rating={review.rating} maxRating={5} size="sm" />
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {review.user?.name || 'Customer'} · {formatDate(review.createdAt)}
                </p>
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
