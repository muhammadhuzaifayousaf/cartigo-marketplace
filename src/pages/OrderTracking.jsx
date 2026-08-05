import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loader2, AlertCircle, RefreshCw, Check, X, MapPin, Package, Ban, UserRound } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchOrderById, cancelOrder, cancelItem } from '../services/api'
import { img, placeholderImg, formatPrice } from '../utils/helpers'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'

// Tracking order — later steps are "further along". Each item follows its own
// copy of this timeline. Cancelled items only show Pending → Cancelled.
const TRACK_STEPS = ['Pending', 'Confirmed', 'In Transit', 'Arrived', 'Delivered']

const stepDescription = (step) => {
  switch (step) {
    case 'Pending': return 'Order placed, awaiting seller confirmation'
    case 'Confirmed': return 'Seller confirmed the item'
    case 'In Transit': return 'Package is on its way'
    case 'Arrived': return 'Package arrived at destination'
    case 'Delivered': return 'Delivered — thank you for shopping!'
    default: return ''
  }
}

/**
 * ItemTimeline — one product's independent tracking progress, plus a
 * "Cancel Item" button while the item is still Pending.
 */
function ItemTimeline({ item, onCancelItem, confirming, cancelling, setConfirming }) {
  const cancelled = item.status === 'Cancelled'
  const currentIndex = TRACK_STEPS.indexOf(item.status)

  return (
    <div className="border border-border-col rounded-lg overflow-hidden">
      {/* Item header */}
      <div className="flex gap-3 p-4 bg-bg-light/40">
        <img
          src={item.image ? img(item.image) : placeholderImg}
          alt={item.name}
          className="w-14 h-14 object-contain border border-border-col rounded bg-bg-light p-1 flex-shrink-0"
          onError={(e) => { e.target.src = placeholderImg }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">{item.name}</p>
          <p className="text-xs text-text-muted mt-0.5">
            Sold by <span className="text-text-secondary">{item.sellerName || 'ShopHub'}</span>
          </p>
          <p className="text-xs text-text-muted">Qty: {item.qty} · {formatPrice(item.price * item.qty)}</p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full self-start whitespace-nowrap ${
            cancelled
              ? 'bg-red-100 text-danger'
              : item.status === 'Delivered'
                ? 'bg-green-100 text-success'
                : 'bg-primary-light text-primary'
          }`}
        >
          {item.status}
        </span>
      </div>

      {/* Tracking number */}
      {item.trackingNumber && (
        <p className="text-xs text-text-muted px-4 pt-3">
          Tracking: <span className="font-mono text-text-secondary">{item.trackingNumber}</span>
        </p>
      )}

      {/* Timeline */}
      <div className="p-4">
        {cancelled ? (
          <ol className="relative">
            <div className="absolute left-[17px] top-6 bottom-6 w-0.5 bg-border-col" />
            {[
              { key: 'Pending', desc: 'Order placed, awaiting seller confirmation' },
              { key: 'Cancelled', desc: 'This item was cancelled', cancelled: true },
            ].map((step) => (
              <li key={step.key} className="relative flex items-start gap-3 pb-6 last:pb-0">
                <span
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.cancelled ? 'bg-danger text-white' : 'bg-success text-white'
                  }`}
                >
                  {step.cancelled ? <X size={18} /> : <Check size={18} />}
                </span>
                <div className="pt-1.5">
                  <p className={`text-sm font-semibold ${step.cancelled ? 'text-danger' : 'text-text-primary'}`}>
                    {step.key}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <ol className="relative">
            <div className="absolute left-[17px] top-6 bottom-6 w-0.5 bg-border-col" />
            {TRACK_STEPS.map((step, i) => {
              const done = i < currentIndex
              const current = i === currentIndex
              const reached = done || current
              return (
                <li key={step} className="relative flex items-start gap-3 pb-6 last:pb-0">
                  <span
                    className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      reached ? 'bg-success text-white' : 'bg-bg-light text-text-muted border border-border-col'
                    }`}
                  >
                    {reached ? <Check size={18} /> : <Package size={16} />}
                  </span>
                  <div className="pt-1.5">
                    <p
                      className={`text-sm font-semibold ${
                        reached ? 'text-text-primary' : 'text-text-muted'
                      }`}
                    >
                      {step}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{stepDescription(step)}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        )}

        {/* Cancel this pending item */}
        {!cancelled && item.status === 'Pending' && (
          <div className="mt-3 pt-3 border-t border-border-col">
            {confirming === item._id ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-danger font-medium">Cancel this item?</span>
                <button
                  onClick={() => onCancelItem(item)}
                  disabled={cancelling === item._id}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-danger bg-red-50 hover:bg-red-100 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                >
                  {cancelling === item._id ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  Yes, cancel
                </button>
                <button
                  onClick={() => setConfirming(null)}
                  disabled={cancelling === item._id}
                  className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:bg-bg-light rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                >
                  <X size={15} /> Keep item
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(item._id)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-danger border border-danger/40 hover:bg-red-50 rounded-lg px-3 py-1.5 transition-colors"
              >
                <Ban size={15} /> Cancel Item
              </button>
            )}
          </div>
        )}

        {!cancelled && (
          <p className="text-xs text-text-muted mt-3 pt-3 border-t border-border-col">
            Est. delivery: 3–5 business days after the seller ships.
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * OrderTracking — detailed view of one order. Every product shows its own
 * timeline and cancel button; the overall status is derived from the
 * per-item statuses.
 */
export default function OrderTracking() {
  const { id } = useParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [confirmItemCancel, setConfirmItemCancel] = useState(null)
  const [cancellingItem, setCancellingItem] = useState(null)
  const showToast = useToast()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setOrder(await fetchOrderById(id))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const updated = await cancelOrder(id)
      setOrder(updated)
      setConfirmCancel(false)
      showToast('Order cancelled successfully')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel order', { type: 'error', duration: 4000 })
      setConfirmCancel(false)
    } finally {
      setCancelling(false)
    }
  }

  const handleCancelItem = async (item) => {
    setCancellingItem(item._id)
    try {
      const updated = await cancelItem(order._id, item._id)
      setOrder(updated)
      setConfirmItemCancel(null)
      showToast('Item cancelled successfully')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel item', { type: 'error', duration: 4000 })
      setConfirmItemCancel(null)
    } finally {
      setCancellingItem(null)
    }
  }

  const cancelled = order?.overallStatus === 'Cancelled'
  // Whole-order cancel is only offered while EVERY item is still Pending.
  const allPending = order?.items?.every((item) => item.status === 'Pending')

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />
      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Link to="/orders" className="text-sm text-text-muted hover:text-primary mb-4 inline-block">
          ← Back to My Orders
        </Link>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Loader2 size={36} className="animate-spin text-primary mb-3" />
            <p className="text-sm">Loading order...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-white rounded-lg border border-border-col p-12 text-center">
            <AlertCircle size={36} className="mx-auto mb-3 text-danger" />
            <p className="text-lg font-medium text-text-primary mb-1">Unable to load order</p>
            <p className="text-sm text-text-muted mb-4">{error}</p>
            <button onClick={load} className="btn-primary inline-flex items-center gap-2">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {!loading && !error && order && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg border border-border-col p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-text-primary">Order Tracking</h1>
                  <p className="text-xs text-text-muted mt-1">
                    Order <span className="font-mono">{order._id}</span> ·{' '}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {user?._id && (
                    <Link
                      to={`/profile/${user._id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary border border-border-col hover:border-primary hover:text-primary rounded-lg px-2.5 py-1.5 transition-colors"
                    >
                      <Avatar name={user.name} avatar={user.avatar} size={20} />
                      <span className="hidden sm:inline">Public profile</span>
                      <UserRound size={13} className="sm:hidden" />
                    </Link>
                  )}
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      cancelled
                        ? 'bg-red-100 text-danger'
                        : order.overallStatus === 'Delivered'
                          ? 'bg-green-100 text-success'
                          : 'bg-primary-light text-primary'
                    }`}
                  >
                    {order.overallStatus}
                  </span>
                </div>
              </div>

              {/* Whole-order cancel — only when every item is still Pending */}
              {allPending && (
                <div className="flex flex-wrap items-center justify-between gap-3 mt-2 pt-4 border-t border-border-col">
                  <p className="text-sm text-text-muted">
                    Nothing has been confirmed by a seller yet. You can cancel this order.
                  </p>
                  {confirmCancel ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-danger font-medium">Cancel this order?</span>
                      <button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-danger bg-red-50 hover:bg-red-100 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                      >
                        {cancelling ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                        Yes, cancel
                      </button>
                      <button
                        onClick={() => setConfirmCancel(false)}
                        disabled={cancelling}
                        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:bg-bg-light rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                      >
                        <X size={15} /> Keep order
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmCancel(true)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-danger border border-danger/40 hover:bg-red-50 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      <Ban size={15} /> Cancel order
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Per-product tracking timelines */}
            <div className="space-y-4">
              <h2 className="font-semibold text-text-primary">Item tracking</h2>
              {order.items.map((item) => (
                <ItemTimeline
                  key={item._id || item.product}
                  item={item}
                  onCancelItem={handleCancelItem}
                  confirming={confirmItemCancel}
                  cancelling={cancellingItem}
                  setConfirming={setConfirmItemCancel}
                />
              ))}
            </div>

            {/* Items summary */}
            <div className="bg-white rounded-lg border border-border-col p-4 sm:p-6">
              <h2 className="font-semibold text-text-primary mb-3">Summary</h2>
              <ul className="divide-y divide-border-col">
                {order.items.map((item) => (
                  <li key={item._id || item.product} className="py-3 flex gap-3">
                    <img
                      src={item.image ? img(item.image) : placeholderImg}
                      alt={item.name}
                      className="w-12 h-12 object-contain border border-border-col rounded bg-bg-light p-1 flex-shrink-0"
                      onError={(e) => { e.target.src = placeholderImg }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{item.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Sold by <span className="text-text-secondary">{item.sellerName || 'ShopHub'}</span>
                        {' '}· Qty {item.qty}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-text-primary whitespace-nowrap">
                        {formatPrice(item.price * item.qty)}
                      </p>
                      {item.status === 'Cancelled' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-danger">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Totals: original + cancelled + final charged */}
              <div className="border-t border-border-col pt-4 space-y-2 text-sm mt-2">
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
                <div className="flex justify-between">
                  <span className="text-text-secondary">Original Total</span>
                  <span className="text-text-primary">{formatPrice(order.total)}</span>
                </div>
                {order.cancelledAmount > 0 && (
                  <>
                    <div className="flex justify-between text-danger">
                      <span>Cancelled Amount</span>
                      <span>-{formatPrice(order.cancelledAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <span>Final Charged Total</span>
                      <span className="text-text-primary">{formatPrice(order.finalTotal)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-lg border border-border-col p-4 sm:p-6">
              <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> Shipping address
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {order.shippingAddress?.fullName} · {order.shippingAddress?.phone}
                <br />
                {order.shippingAddress?.address}, {order.shippingAddress?.city} {order.shippingAddress?.zipCode}
                <br />
                {order.paymentMethod}
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
