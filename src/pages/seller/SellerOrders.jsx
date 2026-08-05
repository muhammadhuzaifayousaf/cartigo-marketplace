import { useState, useEffect, useMemo, Fragment } from 'react'
import {
  Loader2, AlertCircle, RefreshCw, X as CloseIcon, MapPin, Package, Search, Ban, Save, Eye,
  Clock, Truck, PackageCheck, CheckCircle2, CalendarDays, DollarSign, Send,
} from 'lucide-react'
import { fetchSellerOrders, updateItemStatus } from '../../services/api'
import { img, placeholderImg, formatPrice } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import Avatar from '../../components/Avatar'

// Sellers drive their own item through the full lifecycle, including
// cancelling an item (e.g. when it is out of stock or can't be fulfilled).
const STATUSES = ['Pending', 'Confirmed', 'In Transit', 'Arrived', 'Delivered', 'Cancelled']
const FILTERS = ['All', ...STATUSES]

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'price-desc', label: 'Highest price' },
  { value: 'price-asc', label: 'Lowest price' },
]

// Colorful status badges — inline-flex + whitespace-nowrap + fit-content so
// long labels like "Partially Delivered" never wrap, clip or overflow.
const BADGE_STYLES = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  'In Transit': 'bg-purple-100 text-purple-700',
  Arrived: 'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Processing: 'bg-blue-100 text-blue-700',
  'Partially Shipped': 'bg-purple-100 text-purple-700',
  'Partially Delivered': 'bg-green-100 text-green-700',
  'Partially Cancelled': 'bg-red-100 text-red-700',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none whitespace-nowrap ${
        BADGE_STYLES[status] || 'bg-bg-light text-text-secondary border border-border-col'
      }`}
    >
      {status}
    </span>
  )
}

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Customer card helpers — prefer the live profile (`customer`) attached by the
// backend, falling back to the order's shipping snapshot.
const customerOf = (order) => {
  const name = order.customer?.name || order.shippingAddress?.fullName || '—'
  const id = order.customer?._id || null
  const avatar = order.customer?.avatar || ''
  return { name, id, avatar }
}

function CustomerBadge({ order }) {
  const { name, id, avatar } = customerOf(order)
  return (
    <div className="flex items-center gap-2.5">
      <Avatar name={name} avatar={avatar} size={36} variant="light" />
      <div className="min-w-0">
        {id ? (
          <Link
            to={`/profile/${id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-text-primary line-clamp-1 hover:text-primary hover:underline transition-colors"
          >
            {name}
          </Link>
        ) : (
          <p className="font-medium text-text-primary line-clamp-1">{name}</p>
        )}
        <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
          <MapPin size={11} className="flex-shrink-0" />
          <span className="line-clamp-1">{order.shippingAddress?.city || '—'}</span>
        </p>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-lg border border-border-col p-3.5 flex items-center gap-3 transition-shadow hover:shadow-card">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-text-muted truncate">{label}</p>
        <p className="text-base sm:text-lg font-bold text-text-primary leading-snug truncate">{value}</p>
      </div>
    </div>
  )
}

/**
 * OrderDetailModal — read-only preview of a full order. The seller can only
 * update the status of THEIR OWN items (dropdown + Save per item). Items from
 * other sellers are shown read-only. Header and footer stay pinned while the
 * body scrolls.
 */
function OrderDetailModal({ order, sellerId, onClose, onItemStatus, updating }) {
  const [drafts, setDrafts] = useState({})
  const [trackingDrafts, setTrackingDrafts] = useState({})

  useEffect(() => {
    setDrafts({})
    setTrackingDrafts({})
  }, [order])

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-xl shadow-2xl animate-scaleIn flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border-col bg-bg-light flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0">
              <Package size={16} />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-text-primary leading-tight truncate">
                Order <span className="font-mono">#{order._id.slice(-10)}</span>
              </h2>
              <p className="text-xs text-text-muted">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary rounded-lg p-1.5 hover:bg-bg-light transition-colors"
              aria-label="Close"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Payment + cancellations */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={order.overallStatus} />
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">Payment:</span> {order.paymentMethod || 'Cash on Delivery'}
              </p>
            </div>
            {order.cancelledAmount > 0 && (
              <p className="text-sm text-danger font-medium">−{formatPrice(order.cancelledAmount)} cancelled</p>
            )}
          </div>

          {/* Customer + shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-border-col rounded-lg p-4">
              <h3 className="font-semibold text-sm text-text-primary mb-3">Customer</h3>
              <div className="flex items-center gap-3">
                <Avatar
                  name={customerOf(order).name}
                  avatar={customerOf(order).avatar}
                  size={40}
                  variant="light"
                />
                <div className="min-w-0 text-sm text-text-secondary">
                  {customerOf(order).id ? (
                    <Link
                      to={`/profile/${customerOf(order).id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-semibold text-text-primary truncate block hover:text-primary hover:underline transition-colors"
                    >
                      {customerOf(order).name}
                    </Link>
                  ) : (
                    <p className="font-semibold text-text-primary truncate">{customerOf(order).name}</p>
                  )}
                  {order.shippingAddress?.email && (
                    <p className="text-xs text-text-muted truncate">{order.shippingAddress.email}</p>
                  )}
                  {order.shippingAddress?.phone && (
                    <p className="text-xs text-text-muted">{order.shippingAddress.phone}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="border border-border-col rounded-lg p-4">
              <h3 className="font-semibold text-sm text-text-primary mb-3 flex items-center gap-1.5">
                <MapPin size={14} className="text-primary" /> Shipping address
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {order.shippingAddress?.address}
                <br />
                {order.shippingAddress?.city} {order.shippingAddress?.zipCode}
              </p>
            </div>
          </div>

          {/* Items — per-item status */}
          <div>
            <h3 className="font-semibold text-sm text-text-primary mb-2 flex items-center gap-1.5">
              <Package size={14} className="text-primary" /> Items
            </h3>
            <ul className="divide-y divide-border-col border border-border-col rounded-lg">
              {order.items.map((item) => {
                const mine = item.seller === sellerId
                const draft = drafts[item._id] || item.status
                const trackingDraft = trackingDrafts[item._id] ?? item.trackingNumber
                return (
                  <li key={item._id || item.product} className="p-4 flex flex-col lg:flex-row gap-4">
                    <div className="flex gap-3 min-w-0 flex-1">
                      <img
                        src={item.image ? img(item.image) : placeholderImg}
                        alt={item.name}
                        className="w-14 h-14 object-contain border border-border-col rounded bg-bg-light p-1 flex-shrink-0"
                        onError={(e) => { e.target.src = placeholderImg }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary line-clamp-2">{item.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {formatPrice(item.price)} × {item.qty} ={' '}
                          <span className="font-semibold text-text-primary">{formatPrice(item.price * item.qty)}</span>
                        </p>
                        {!mine && (
                          <p className="text-xs text-text-muted mt-0.5">
                            Sold by <span className="text-text-secondary">{item.sellerName || 'ShopHub'}</span>
                          </p>
                        )}
                        <div className="mt-2"><StatusBadge status={item.status} /></div>
                      </div>
                    </div>

                    {mine && (
                      <div className="flex flex-col gap-2 lg:items-end lg:flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <select
                            value={draft}
                            disabled={updating === item._id}
                            onChange={(e) => setDrafts((d) => ({ ...d, [item._id]: e.target.value }))}
                            className="h-10 border border-border-col rounded-lg px-2.5 text-sm outline-none focus:border-primary bg-white disabled:opacity-60"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => onItemStatus(order._id, item._id, draft, trackingDraft)}
                            disabled={updating === item._id || (draft === item.status && trackingDraft === item.trackingNumber)}
                            className="btn-primary !px-4 h-10 inline-flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {updating === item._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save
                          </button>
                        </div>
                        <input
                          type="text"
                          value={trackingDraft}
                          onChange={(e) => setTrackingDrafts((d) => ({ ...d, [item._id]: e.target.value }))}
                          placeholder="Tracking number (optional)"
                          disabled={updating === item._id}
                          className="h-10 w-full lg:w-64 border border-border-col rounded-lg px-2.5 text-sm outline-none focus:border-primary bg-white disabled:opacity-60"
                        />
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Order summary */}
          <div className="border border-border-col rounded-lg overflow-hidden">
            <h3 className="px-4 py-3 bg-bg-light font-semibold text-sm text-text-primary">Order summary</h3>
            <div className="p-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-text-primary font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-danger">
                  <span>Discount</span>
                  <span>−{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-secondary">Tax (7%)</span>
                <span className="text-text-primary font-medium">+{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Shipping</span>
                <span className="text-success font-medium">Free</span>
              </div>
              {order.cancelledAmount > 0 && (
                <div className="flex justify-between text-danger">
                  <span>Cancelled amount</span>
                  <span>−{formatPrice(order.cancelledAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center font-bold text-base pt-3 mt-1 border-t border-border-col">
                <span className="text-text-primary">Final total</span>
                <span className="text-text-primary">
                  {order.cancelledAmount > 0 && order.finalTotal != null
                    ? formatPrice(order.finalTotal)
                    : formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <footer className="flex items-center justify-between gap-3 px-5 py-3 border-t border-border-col bg-bg-light flex-shrink-0">
          <p className="text-xs text-text-muted hidden sm:block">
            Status changes apply instantly to this item on your storefront.
          </p>
          <button onClick={onClose} className="btn-outline flex-shrink-0">
            Close
          </button>
        </footer>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-border-col p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-bg-light animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-2/3 bg-bg-light rounded animate-pulse" />
              <div className="h-3.5 w-1/2 bg-bg-light rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-border-col overflow-hidden">
        <div className="h-10 bg-bg-light animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-t border-border-col p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-bg-light animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/5 bg-bg-light rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-bg-light rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * SellerOrders — orders containing at least one of the seller's items. Only the
 * seller's own items are listed, each with its own status lifecycle. Supports
 * quick stats, status filtering, search, date range, sorting, and a detailed
 * order modal for per-item status + tracking updates.
 */
export default function SellerOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [detailOrder, setDetailOrder] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
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

  // Orders paired with ONLY this seller's items (never other sellers' lines).
  const sellerRows = useMemo(() => {
    const rows = []
    for (const order of orders) {
      const own = order.items.filter((item) => item.seller === user?._id)
      if (own.length) rows.push({ order, own })
    }
    return rows
  }, [orders, user])

  // Quick stats — item counts per status (seller's own lines), revenue from
  // delivered lines, and distinct orders placed today.
  const stats = useMemo(() => {
    const counts = { Pending: 0, Confirmed: 0, 'In Transit': 0, Arrived: 0, Delivered: 0, Cancelled: 0 }
    let revenue = 0
    const today = new Date().toDateString()
    const todayOrders = new Set()
    for (const { order, own } of sellerRows) {
      for (const item of own) {
        counts[item.status] = (counts[item.status] || 0) + 1
        if (item.status === 'Delivered') revenue += item.price * item.qty
      }
      if (new Date(order.createdAt).toDateString() === today) todayOrders.add(order._id)
    }
    return { ...counts, revenue, todayOrders: todayOrders.size }
  }, [sellerRows])

  const filtered = useMemo(() => {
    let rows = sellerRows
    if (filter !== 'All') {
      rows = rows.filter(({ own }) => own.some((item) => item.status === filter))
    }
    const q = search.trim().toLowerCase()
    if (q) {
      rows = rows.filter(
        ({ order, own }) =>
          order._id.toLowerCase().includes(q) ||
          (order.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
          (order.shippingAddress?.city || '').toLowerCase().includes(q) ||
          own.some((item) => item.name.toLowerCase().includes(q))
      )
    }
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null
    const to = toDate ? new Date(`${toDate}T23:59:59.999`) : null
    if (from) rows = rows.filter(({ order }) => new Date(order.createdAt) >= from)
    if (to) rows = rows.filter(({ order }) => new Date(order.createdAt) <= to)

    const lineTotal = ({ own }) => own.reduce((sum, item) => sum + item.price * item.qty, 0)
    const byDate = (a, b) => new Date(a.order.createdAt) - new Date(b.order.createdAt)
    switch (sort) {
      case 'oldest': rows = [...rows].sort(byDate); break
      case 'price-desc': rows = [...rows].sort((a, b) => lineTotal(b) - lineTotal(a)); break
      case 'price-asc': rows = [...rows].sort((a, b) => lineTotal(a) - lineTotal(b)); break
      default: rows = [...rows].sort((a, b) => -byDate(a, b))
    }
    return rows
  }, [sellerRows, filter, search, fromDate, toDate, sort])

  const hasFilters = search || filter !== 'All' || sort !== 'newest' || fromDate || toDate

  const clearFilters = () => {
    setSearch('')
    setFilter('All')
    setSort('newest')
    setFromDate('')
    setToDate('')
  }

  const handleItemStatus = async (orderId, itemId, status, trackingNumber) => {
    if (updating) return
    setUpdating(itemId)
    try {
      const updated = await updateItemStatus(orderId, itemId, status, trackingNumber)
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)))
      setDetailOrder((prev) => (prev && prev._id === updated._id ? updated : prev))
      showToast(`Item marked as "${status}"`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', { type: 'error', duration: 4000 })
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Orders</h1>
          <p className="text-sm text-text-muted mt-1">Loading your order dashboard…</p>
        </div>
        <LoadingSkeleton />
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

  const statCards = [
    { label: 'Pending', value: stats.Pending, icon: Clock, accent: 'bg-yellow-100 text-yellow-700' },
    { label: 'Confirmed', value: stats.Confirmed, icon: Send, accent: 'bg-blue-100 text-blue-700' },
    { label: 'In Transit', value: stats['In Transit'], icon: Truck, accent: 'bg-purple-100 text-purple-700' },
    { label: 'Arrived', value: stats.Arrived, icon: PackageCheck, accent: 'bg-indigo-100 text-indigo-700' },
    { label: 'Delivered', value: stats.Delivered, icon: CheckCircle2, accent: 'bg-green-100 text-green-700' },
    { label: 'Cancelled', value: stats.Cancelled, icon: Ban, accent: 'bg-red-100 text-red-700' },
    { label: 'Total revenue', value: formatPrice(stats.revenue), icon: DollarSign, accent: 'bg-green-100 text-success' },
    { label: "Today's orders", value: stats.todayOrders, icon: CalendarDays, accent: 'bg-primary-light text-primary' },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Orders</h1>
          <p className="text-sm text-text-muted mt-1">
            {filtered.length} order{filtered.length !== 1 && 's'} containing your products
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-border-col p-3 sm:p-4">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, order ID, or product…"
              className="w-full border border-border-col rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-primary bg-white"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-border-col rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-white"
            >
              {FILTERS.map((f) => (
                <option key={f} value={f}>{f === 'All' ? 'All statuses' : f}</option>
              ))}
            </select>

            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                aria-label="From date"
                className="border border-border-col rounded-lg px-2 py-2 text-sm outline-none focus:border-primary bg-white"
              />
              <span className="text-text-muted text-sm">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                aria-label="To date"
                className="border border-border-col rounded-lg px-2 py-2 text-sm outline-none focus:border-primary bg-white"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-border-col rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-white"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <button
              onClick={load}
              title="Refresh orders"
              className="inline-flex items-center justify-center w-[38px] h-[38px] border border-border-col rounded-lg text-text-secondary hover:text-primary hover:border-primary transition-colors bg-white"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-border-col px-6 py-16 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-bg-light flex items-center justify-center mb-4">
            <Package size={28} className="text-text-muted" />
          </div>
          <p className="text-lg font-semibold text-text-primary">No orders found</p>
          <p className="text-sm text-text-muted mt-1 max-w-sm mx-auto">
            {orders.length === 0
              ? 'Orders containing your products will appear here once customers start purchasing.'
              : 'Try a different status filter, date range, or search term.'}
          </p>
          {orders.length > 0 && hasFilters && (
            <button onClick={clearFilters} className="btn-outline mt-4">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="bg-white rounded-lg border border-border-col overflow-hidden">
            <div className="hidden md:block max-h-[70vh] overflow-auto">
              <table className="w-full text-sm border-separate border-spacing-0">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-bg-light text-left text-xs uppercase tracking-wide text-text-muted">
                    <th className="px-4 py-3 font-medium border-b border-border-col">Order</th>
                    <th className="px-4 py-3 font-medium border-b border-border-col">Customer</th>
                    <th className="px-4 py-3 font-medium border-b border-border-col">Product</th>
                    <th className="px-4 py-3 font-medium border-b border-border-col">Line total</th>
                    <th className="px-4 py-3 font-medium border-b border-border-col">Status</th>
                    <th className="px-4 py-3 font-medium border-b border-border-col text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(({ order, own }) => (
                    <Fragment key={order._id}>
                      {own.map((item, idx) => (
                        <tr
                          key={item._id || item.product}
                          onClick={() => setDetailOrder(order)}
                          className="group cursor-pointer hover:bg-bg-light/60 transition-colors"
                        >
                          {idx === 0 && (
                            <td rowSpan={own.length} className={`align-top px-4 py-3.5 w-40 border-b border-border-col ${idx === 0 ? 'border-t border-border-col' : ''}`}>
                              <button
                                onClick={(e) => { e.stopPropagation(); setDetailOrder(order) }}
                                className="font-mono text-xs font-semibold text-primary hover:underline transition-colors"
                              >
                                #{order._id.slice(-10)}
                              </button>
                              <p className="text-xs text-text-muted mt-1">{formatDate(order.createdAt)}</p>
                              <div className="mt-2"><StatusBadge status={order.overallStatus} /></div>
                            </td>
                          )}
                          {idx === 0 && (
                            <td rowSpan={own.length} className={`align-top px-4 py-3.5 w-52 border-b border-border-col ${idx === 0 ? 'border-t border-border-col' : ''}`}>
                              <CustomerBadge order={order} />
                            </td>
                          )}
                          <td className="px-4 py-3.5 border-b border-border-col">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image ? img(item.image) : placeholderImg}
                                alt={item.name}
                                className="w-10 h-10 object-contain border border-border-col rounded bg-bg-light p-1 flex-shrink-0"
                                onError={(e) => { e.target.src = placeholderImg }}
                              />
                              <div className="min-w-0">
                                <p className="font-medium text-text-primary line-clamp-1">{item.name}</p>
                                <p className="text-xs text-text-muted">
                                  {formatPrice(item.price)} × {item.qty}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 border-b border-border-col font-semibold text-text-primary whitespace-nowrap">
                            {formatPrice(item.price * item.qty)}
                          </td>
                          <td className="px-4 py-3.5 border-b border-border-col">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-4 py-3.5 border-b border-border-col text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); setDetailOrder(order) }}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary-light hover:bg-primary hover:text-white rounded-lg px-3 py-2 transition-colors"
                            >
                              <Eye size={14} /> Quick View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="md:hidden divide-y divide-border-col">
              {filtered.map(({ order, own }) => (
                <li
                  key={order._id}
                  onClick={() => setDetailOrder(order)}
                  className="p-4 space-y-3 cursor-pointer active:bg-bg-light/60 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-xs font-semibold text-primary">#{order._id.slice(-10)}</span>
                      <span className="text-xs text-text-muted">{formatDate(order.createdAt)}</span>
                    </div>
                    <StatusBadge status={order.overallStatus} />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <CustomerBadge order={order} />
                  </div>

                  {own.map((item) => (
                    <div key={item._id || item.product} className="border border-border-col rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image ? img(item.image) : placeholderImg}
                          alt={item.name}
                          className="w-10 h-10 object-contain border border-border-col rounded bg-bg-light p-1 flex-shrink-0"
                          onError={(e) => { e.target.src = placeholderImg }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary line-clamp-1">{item.name}</p>
                          <p className="text-xs text-text-muted">
                            {formatPrice(item.price)} × {item.qty} ={' '}
                            <span className="text-text-primary font-semibold">{formatPrice(item.price * item.qty)}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border-col">
                        <StatusBadge status={item.status} />
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <Eye size={13} /> Quick View
                        </span>
                      </div>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          sellerId={user?._id}
          onClose={() => setDetailOrder(null)}
          onItemStatus={handleItemStatus}
          updating={updating}
        />
      )}
    </div>
  )
}
