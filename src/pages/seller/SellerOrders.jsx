import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, RefreshCw, X as CloseIcon, MapPin, Package } from 'lucide-react'
import { fetchSellerOrders, updateOrderStatus } from '../../services/api'
import { img, formatPrice } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'

const STATUSES = ['Pending', 'Confirmed', 'In Transit', 'Arrived', 'Delivered', 'Cancelled']

/**
 * OrderDetailModal — full read-only order preview for sellers.
 * Shows customer/shipping info, every item, and the totals breakdown.
 */
function OrderDetailModal({ order, onClose, onStatusChange, updating }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!order) return null

  const cancelled = order.status === 'Cancelled'
  const delivered = order.status === 'Delivered'

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-xl shadow-2xl my-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border-col bg-bg-light">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="font-bold text-text-primary truncate">Order details</h2>
            <span className="font-mono text-xs text-text-secondary truncate">#{order._id.slice(-10)}</span>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary rounded-lg p-1.5 hover:bg-bg-light transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Status row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-text-muted">Placed on {new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-xs text-text-muted mt-0.5">
                Payment: {order.paymentMethod || 'Cash on Delivery'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  cancelled
                    ? 'bg-red-100 text-danger'
                    : delivered
                      ? 'bg-green-100 text-success'
                      : 'bg-primary-light text-primary'
                }`}
              >
                {order.status}
              </span>
              <select
                value={order.status}
                disabled={updating === order._id}
                onChange={(e) => onStatusChange(order, e.target.value)}
                className="border border-border-col rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-primary disabled:opacity-60"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {updating === order._id && <Loader2 size={16} className="animate-spin text-primary" />}
            </div>
          </div>

          {/* Customer + shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-border-col rounded-lg p-4">
              <h3 className="font-semibold text-sm text-text-primary mb-2">Customer</h3>
              <p className="text-sm text-text-secondary">
                {order.shippingAddress?.fullName || '—'}
                <br />
                {order.shippingAddress?.email && <>{order.shippingAddress.email}<br /></>}
                {order.shippingAddress?.phone}
              </p>
            </div>
            <div className="border border-border-col rounded-lg p-4">
              <h3 className="font-semibold text-sm text-text-primary mb-2 flex items-center gap-1.5">
                <MapPin size={14} className="text-primary" /> Shipping address
              </h3>
              <p className="text-sm text-text-secondary">
                {order.shippingAddress?.address}
                <br />
                {order.shippingAddress?.city} {order.shippingAddress?.zipCode}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold text-sm text-text-primary mb-2 flex items-center gap-1.5">
              <Package size={14} className="text-primary" /> Items
            </h3>
            <ul className="divide-y divide-border-col border border-border-col rounded-lg">
              {order.items.map((item) => (
                <li key={item._id || item.product} className="py-3 px-4 flex gap-3">
                  <img
                    src={item.image ? img(item.image) : 'https://placehold.co/48x48/f7f7f7/999?text=P'}
                    alt={item.name}
                    className="w-12 h-12 object-contain border border-border-col rounded bg-bg-light p-1 flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/48x48/f7f7f7/999?text=P' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{item.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {formatPrice(item.price)} × {item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-text-primary whitespace-nowrap">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Totals */}
          <div className="border border-border-col rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Subtotal</span>
              <span className="text-text-primary">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-danger">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-secondary">Tax (7%)</span>
              <span className="text-text-primary">+{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-border-col">
              <span>Total</span>
              <span className="text-text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-5 py-4 border-t border-border-col bg-bg-light">
          <button onClick={onClose} className="btn-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * SellerOrders — orders containing at least one of the seller's items,
 * with an inline dropdown to update the tracking status.
 */
export default function SellerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [detailOrder, setDetailOrder] = useState(null)
  const showToast = useToast()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setOrders(await fetchSellerOrders())
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleStatusChange = async (order, status) => {
    if (status === order.status) return
    setUpdating(order._id)
    try {
      const updated = await updateOrderStatus(order._id, status)
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)))
      setDetailOrder((prev) => (prev && prev._id === updated._id ? updated : prev))
      showToast(`Order marked as "${status}"`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', { type: 'error', duration: 4000 })
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <Loader2 size={36} className="animate-spin text-primary mb-3" />
        <p className="text-sm">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-border-col p-12 text-center">
        <AlertCircle size={36} className="mx-auto mb-3 text-danger" />
        <p className="text-lg font-medium text-text-primary mb-1">Unable to load orders</p>
        <p className="text-sm text-text-muted mb-4">{error}</p>
        <button onClick={load} className="btn-primary inline-flex items-center gap-2">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Orders</h1>
        <p className="text-sm text-text-muted mt-1">{orders.length} order{orders.length !== 1 && 's'} containing your products</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-border-col p-12 text-center">
          <p className="text-lg text-text-secondary mb-2">No orders yet</p>
          <p className="text-sm text-text-muted">Orders containing your products will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border-col overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-light text-left text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-col">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-bg-light/50 transition-colors">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDetailOrder(order)}
                        className="font-mono text-xs text-primary hover:underline transition-colors"
                      >
                        #{order._id.slice(-10)}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-text-primary">{order.shippingAddress?.fullName}</p>
                      <p className="text-xs text-text-muted">{order.shippingAddress?.city}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 4).map((item) => (
                          <img
                            key={item._id || item.product}
                            src={item.image || 'https://placehold.co/32x32/f7f7f7/999?text=P'}
                            alt={item.name}
                            className="w-8 h-8 rounded-full border-2 border-white object-contain bg-bg-light"
                            onError={(e) => { e.target.src = 'https://placehold.co/32x32/f7f7f7/999?text=P' }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-text-muted mt-1 line-clamp-1 max-w-[160px]">
                        {order.items.map((i) => i.name).join(', ')}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-text-primary">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          disabled={updating === order._id}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          className="border border-border-col rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-primary disabled:opacity-60"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {updating === order._id && (
                          <Loader2 size={16} className="animate-spin text-primary" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="md:hidden divide-y divide-border-col">
            {orders.map((order) => (
              <li key={order._id} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setDetailOrder(order)}
                    className="font-mono text-xs text-primary hover:underline transition-colors"
                  >
                    #{order._id.slice(-10)}
                  </button>
                  <span className="text-sm font-semibold text-text-primary">{formatPrice(order.total)}</span>
                </div>
                <p className="text-sm font-medium text-text-primary">
                  {order.shippingAddress?.fullName} · {order.shippingAddress?.city}
                </p>
                <p className="text-xs text-text-muted line-clamp-2">
                  {order.items.map((i) => i.name).join(', ')}
                </p>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-xs text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <select
                    value={order.status}
                    disabled={updating === order._id}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    className="border border-border-col rounded-lg px-2 py-1 text-sm outline-none focus:border-primary disabled:opacity-60"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  )
}
