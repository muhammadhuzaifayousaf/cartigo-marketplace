import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loader2, AlertCircle, RefreshCw, Check, X, MapPin, Package } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchOrderById } from '../services/api'
import { formatPrice } from '../utils/helpers'

// Tracking order — later steps are "further along".
const TRACK_STEPS = ['Pending', 'Confirmed', 'In Transit', 'Arrived', 'Delivered']

/**
 * OrderTracking — detailed view of one order with a visual timeline
 * highlighting every completed tracking step.
 */
export default function OrderTracking() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const cancelled = order?.status === 'Cancelled'
  const currentIndex = TRACK_STEPS.indexOf(order?.status)

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
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    cancelled
                      ? 'bg-red-100 text-danger'
                      : currentIndex >= TRACK_STEPS.length - 1
                        ? 'bg-green-100 text-success'
                        : 'bg-primary-light text-primary'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Timeline */}
              {cancelled ? (
                <div className="flex items-center gap-3 text-danger py-6">
                  <span className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <X size={18} />
                  </span>
                  <p className="text-sm font-medium">This order was cancelled.</p>
                </div>
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
                          <p className="text-xs text-text-muted mt-0.5">
                            {i === 0 && 'Order placed, awaiting confirmation'}
                            {i === 1 && 'Seller confirmed the order'}
                            {i === 2 && 'Package is on its way'}
                            {i === 3 && 'Package arrived at destination'}
                            {i === 4 && 'Order delivered — thank you for shopping!'}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg border border-border-col p-4 sm:p-6">
              <h2 className="font-semibold text-text-primary mb-3">Items</h2>
              <ul className="divide-y divide-border-col">
                {order.items.map((item) => (
                  <li key={item._id || item.product} className="py-3 flex gap-3">
                    <img
                      src={item.image || 'https://placehold.co/56x56/f7f7f7/999?text=P'}
                      alt={item.name}
                      className="w-14 h-14 object-contain border border-border-col rounded bg-bg-light p-1 flex-shrink-0"
                      onError={(e) => { e.target.src = 'https://placehold.co/56x56/f7f7f7/999?text=P' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{item.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Sold by <span className="text-text-secondary">{item.sellerName || 'ShopHub'}</span>
                      </p>
                      <p className="text-xs text-text-muted">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-semibold text-text-primary whitespace-nowrap">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </li>
                ))}
              </ul>

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
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-text-primary">{formatPrice(order.total)}</span>
                </div>
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
