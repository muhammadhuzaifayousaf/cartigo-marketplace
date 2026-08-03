import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, AlertCircle, RefreshCw, Package, ChevronRight, Ban, Check } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchMyOrders, cancelOrder } from '../services/api'
import { img, placeholderImg, formatPrice } from '../utils/helpers'
import { useToast } from '../context/ToastContext'

/**
 * MyOrders — the customer's order history with a link to each tracking page.
 */
export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirming, setConfirming] = useState(null)
  const [cancelling, setCancelling] = useState(null)
  const showToast = useToast()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setOrders(await fetchMyOrders())
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCancel = async (order) => {
    setCancelling(order._id)
    try {
      const updated = await cancelOrder(order._id)
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)))
      setConfirming(null)
      showToast('Order cancelled successfully')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel order', { type: 'error', duration: 4000 })
      setConfirming(null)
    } finally {
      setCancelling(null)
    }
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-1">My Orders</h1>
        <p className="text-sm text-text-muted mb-5">Track your purchases and view order history.</p>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Loader2 size={36} className="animate-spin text-primary mb-3" />
            <p className="text-sm">Loading orders...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-white rounded-lg border border-border-col p-12 text-center">
            <AlertCircle size={36} className="mx-auto mb-3 text-danger" />
            <p className="text-lg font-medium text-text-primary mb-1">Unable to load orders</p>
            <p className="text-sm text-text-muted mb-4">{error}</p>
            <button onClick={load} className="btn-primary inline-flex items-center gap-2">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-lg border border-border-col p-12 text-center">
            <Package size={40} className="mx-auto mb-3 text-text-muted" />
            <p className="text-lg text-text-secondary mb-2">No orders yet</p>
            <p className="text-sm text-text-muted mb-6">When you place an order, it will appear here.</p>
            <Link
              to="/products"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="block bg-white rounded-lg border border-border-col hover:shadow-card-hover transition-shadow"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-text-secondary">
                        Order <span className="text-text-primary">{order._id.slice(-10)}</span>
                      </span>
                      <span className="text-xs text-text-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-success'
                            : order.status === 'Cancelled'
                              ? 'bg-red-100 text-danger'
                              : 'bg-primary-light text-primary'
                        }`}
                      >
                        {order.status}
                      </span>
                      {order.status === 'Pending' && (
                        confirming === order._id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-danger font-medium">Cancel?</span>
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCancel(order) }}
                              disabled={cancelling === order._id}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-danger bg-red-50 hover:bg-red-100 rounded px-2 py-1 transition-colors disabled:opacity-50"
                            >
                              {cancelling === order._id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                              Yes
                            </button>
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirming(null) }}
                              disabled={cancelling === order._id}
                              className="inline-flex items-center gap-1 text-xs text-text-secondary hover:bg-bg-light rounded px-2 py-1 transition-colors"
                            >
                              Keep
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirming(order._id) }}
                            className="inline-flex items-center gap-1 text-xs font-medium text-danger border border-danger/40 hover:bg-red-50 rounded px-2 py-1 transition-colors"
                          >
                            <Ban size={12} /> Cancel
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 4).map((item) => (
                        <img
                          key={item._id || item.product}
                          src={item.image ? img(item.image) : placeholderImg}
                          alt={item.name}
                          className="w-10 h-10 rounded-full border-2 border-white object-contain bg-bg-light"
                          onError={(e) => { e.target.src = placeholderImg }}
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {order.items.map((i) => i.name).join(', ')}
                      </p>
                      <p className="text-xs text-text-muted">
                        {order.items.reduce((s, i) => s + i.qty, 0)} item(s) · {order.shippingAddress?.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="font-bold text-text-primary">{formatPrice(order.total)}</span>
                      <ChevronRight size={16} className="text-text-muted" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
