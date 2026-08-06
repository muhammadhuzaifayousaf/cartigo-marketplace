import { useState, useEffect } from 'react'
import { Check, X, Loader2, AlertCircle, RefreshCw, BadgeCheck, Clock, XCircle, X as CloseIcon } from 'lucide-react'
import { fetchAdminProducts, updateProductVerification } from '../../services/api'
import { img, formatPrice } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { Navigate, Link } from 'react-router-dom'

// Resolve a product's approval status. Older docs may only have `verified`.
const getStatus = (p) => p.status || (p.verified ? 'approved' : 'pending')

const STATUS_META = {
  approved: { label: 'Approved', classes: 'bg-primary-light text-primary' },
  pending: { label: 'Pending', classes: 'bg-amber-50 text-amber-600' },
  rejected: { label: 'Rejected', classes: 'bg-red-50 text-danger' },
}

const TAB_META = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'rejected', label: 'Rejected', icon: XCircle },
  { key: 'all', label: 'All products', icon: BadgeCheck },
]

/**
 * ProductDetailModal — full read-only product preview for admins.
 * Shows every field the seller submitted so a product can be
 * reviewed (and approved/rejected) before it goes live.
 */
function ProductDetailModal({ product, onClose, onVerify, updating }) {
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!product) return null

  const meta = STATUS_META[getStatus(product)] || STATUS_META.pending
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image]
  const sellerName = product.sellerName || product.seller?.name || '—'

  const discountPct = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const SpecRow = ({ label, value }) => (
    <tr className="border-b border-border-col last:border-0">
      <td className="py-2 pr-4 text-text-muted w-40 align-top">{label}</td>
      <td className="py-2 text-text-secondary break-words">{value || '—'}</td>
    </tr>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl my-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border-col bg-bg-light">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="font-bold text-text-primary truncate">Product details</h2>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${meta.classes}`}>
              {meta.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary rounded-lg p-1.5 hover:bg-bg-light transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-5 gap-5">
          {/* Image gallery */}
          <div className="md:col-span-2">
            <div className="aspect-square bg-bg-light rounded-lg flex items-center justify-center overflow-hidden border border-border-col mb-3">
              <img
                src={img(images[activeImg])}
                alt={product.name}
                className="object-contain w-full h-full p-4"
                onError={(e) => { e.target.src = 'https://placehold.co/300x300/f7f7f7/999?text=No+Image' }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-colors ${
                      i === activeImg ? 'border-primary' : 'border-border-col hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={img(src)}
                      alt={`View ${i + 1}`}
                      className="object-contain w-full h-full p-0.5"
                      onError={(e) => { e.target.src = 'https://placehold.co/48x48/f7f7f7/999?text=' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-bold text-text-primary leading-snug mb-2">{product.name}</h3>
            <p className="text-sm text-text-muted mb-3">
              by{' '}
              {product.seller ? (
                <Link
                  to={`/profile/${product.seller._id}`}
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  {sellerName}
                </Link>
              ) : (
                sellerName
              )}
              {product.seller?.email && <span className="text-text-muted"> · {product.seller.email}</span>}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl font-bold text-text-primary">{formatPrice(product.price)}</div>
              {discountPct > 0 && (
                <>
                  <span className="text-sm text-text-muted line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-xs font-semibold text-danger bg-red-50 px-2 py-0.5 rounded-full">
                    {discountPct}% off
                  </span>
                </>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>
            </div>

            <table className="w-full text-sm">
              <tbody>
                <SpecRow label="Category" value={product.category} />
                <SpecRow label="Brand" value={product.brand} />
                <SpecRow label="Stock" value={product.stock} />
                <SpecRow label="Rating" value={product.rating != null ? `${product.rating} / 5` : null} />
                <SpecRow label="Orders" value={product.orders} />
                <SpecRow label="Reviews" value={product.reviews} />
                <SpecRow label="Submitted" value={product.createdAt ? new Date(product.createdAt).toLocaleDateString() : null} />
                <SpecRow label="Updated" value={product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : null} />
              </tbody>
            </table>
          </div>
        </div>

        {/* Specs + Features */}
        <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-text-primary mb-2">Specifications</h4>
              <table className="w-full text-sm border border-border-col rounded overflow-hidden">
                <tbody>
                  {Object.entries(product.specs).map(([k, v]) => (
                    <tr key={k} className="border-b border-border-col last:border-0">
                      <td className="px-3 py-2 bg-bg-light font-medium text-text-primary w-40">{k}</td>
                      <td className="px-3 py-2 text-text-secondary break-words">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-text-primary mb-2">Features</h4>
              <ul className="space-y-1.5">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-success mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 px-5 py-4 border-t border-border-col bg-bg-light">
          <button onClick={onClose} className="btn-outline inline-flex items-center gap-2">
            Close
          </button>
          {getStatus(product) !== 'approved' && (
            <button
              onClick={() => onVerify(product, true)}
              disabled={updating === product._id}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-success bg-green-50 hover:bg-green-100 rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
            >
              {updating === product._id ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              Approve
            </button>
          )}
          <button
            onClick={() => onVerify(product, false)}
            disabled={updating === product._id}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-danger bg-red-50 hover:bg-red-100 rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
          >
            <X size={15} /> Reject
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * AdminApprovals — product approval queue.
 * Admins approve/reject seller-submitted products before they appear
 * on the public storefront. Admin's own listings are auto-approved.
 */
export default function AdminApprovals() {
  const { isAdmin } = useAuth()
  const [status, setStatus] = useState('pending')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [detailProduct, setDetailProduct] = useState(null)
  const showToast = useToast()

  const load = async (filter = status) => {
    setLoading(true)
    setError(null)
    try {
      setProducts(await fetchAdminProducts(filter))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) load(status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  if (!isAdmin) return <Navigate to="/seller" replace />

  const handleVerify = async (product, verified) => {
    setUpdating(product._id)
    try {
      await updateProductVerification(product._id, verified)
      // After an action the product moves out of the current filtered view.
      setProducts((prev) => prev.filter((p) => p._id !== product._id))
      setDetailProduct((prev) => (prev && prev._id === product._id ? null : prev))
      showToast(verified ? `Approved "${product.name}"` : `Rejected "${product.name}"`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update product', { type: 'error', duration: 4000 })
    } finally {
      setUpdating(null)
    }
  }

  const pendingCount = products.filter((p) => getStatus(p) === 'pending').length

  const StatusBadge = ({ product }) => {
    const meta = STATUS_META[getStatus(product)] || STATUS_META.pending
    return (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.classes}`}>
        {meta.label}
      </span>
    )
  }

  const ActionButtons = ({ product }) => {
    const isApproved = getStatus(product) === 'approved'
    return (
      <div className={`flex items-center gap-2 ${isApproved ? 'justify-end' : ''}`}>
        {!isApproved && (
          <button
            onClick={() => handleVerify(product, true)}
            disabled={updating === product._id}
            className="inline-flex items-center gap-1.5 text-sm text-success hover:bg-green-50 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-50"
          >
            {updating === product._id ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Check size={15} />
            )}
            Approve
          </button>
        )}
        <button
          onClick={() => handleVerify(product, false)}
          disabled={updating === product._id}
          className="inline-flex items-center gap-1.5 text-sm text-danger hover:bg-red-50 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-50"
        >
          <X size={15} /> Reject
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Product Approvals</h1>
          <p className="text-sm text-text-muted mt-1">
            {pendingCount} pending product{pendingCount !== 1 && 's'} awaiting review
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-border-col rounded-lg p-1">
          {TAB_META.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setStatus(key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                status === key
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-bg-light'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <Loader2 size={36} className="animate-spin text-primary mb-3" />
          <p className="text-sm">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg border border-border-col p-12 text-center">
          <AlertCircle size={36} className="mx-auto mb-3 text-danger" />
          <p className="text-lg font-medium text-text-primary mb-1">Unable to load products</p>
          <p className="text-sm text-text-muted mb-4">{error}</p>
          <button onClick={() => load()} className="btn-primary inline-flex items-center gap-2">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg border border-border-col p-12 text-center">
          <BadgeCheck size={36} className="mx-auto mb-3 text-success" />
          <p className="text-lg text-text-secondary mb-2">Nothing here</p>
          <p className="text-sm text-text-muted">
            {status === 'pending' && 'No products are currently waiting for approval.'}
            {status === 'rejected' && 'No products have been rejected.'}
            {status === 'all' && 'There are no products in the catalog yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border-col overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-light text-left text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Seller</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-col">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-bg-light/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || p.image}
                          alt={p.name}
                          className="w-12 h-12 object-contain border border-border-col rounded bg-bg-light p-1 flex-shrink-0"
                          onError={(e) => { e.target.src = 'https://placehold.co/48x48/f7f7f7/999?text=P' }}
                        />
                        <button
                          onClick={() => setDetailProduct(p)}
                          className="font-medium text-text-primary line-clamp-2 max-w-xs text-left hover:text-primary hover:underline transition-colors"
                        >
                          {p.name}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.seller ? (
                        <Link
                          to={`/profile/${p.seller._id}`}
                          className="text-text-secondary hover:text-primary transition-colors"
                        >
                          {p.sellerName || p.seller?.name || '—'}
                        </Link>
                      ) : (
                        <span className="text-text-secondary">{p.sellerName || p.seller?.name || '—'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-primary font-medium">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-text-secondary">{p.category}</td>
                    <td className="px-4 py-3">
                      <StatusBadge product={p} />
                    </td>
                    <td className="px-4 py-3">
                      <ActionButtons product={p} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="md:hidden divide-y divide-border-col">
            {products.map((p) => (
              <li key={p._id} className="p-4 flex gap-3">
                <img
                  src={p.images?.[0] || p.image}
                  alt={p.name}
                  className="w-16 h-16 object-contain border border-border-col rounded bg-bg-light p-1 flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://placehold.co/64x64/f7f7f7/999?text=P' }}
                />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => setDetailProduct(p)}
                    className="text-sm font-medium text-text-primary line-clamp-2 text-left hover:text-primary hover:underline transition-colors"
                  >
                    {p.name}
                  </button>
                  <p className="text-xs text-text-muted mt-0.5">
                    by{' '}
                    {p.seller ? (
                      <Link
                        to={`/profile/${p.seller._id}`}
                        className="text-text-secondary hover:text-primary transition-colors"
                      >
                        {p.sellerName || p.seller?.name || '—'}
                      </Link>
                    ) : (
                      <span className="text-text-secondary">{p.sellerName || p.seller?.name || '—'}</span>
                    )}
                  </p>
                  <div className="mt-1">
                    <StatusBadge product={p} />
                  </div>
                  <p className="text-sm font-semibold text-text-primary mt-1">{formatPrice(p.price)}</p>
                  <p className="text-xs text-text-muted">{p.category}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <ActionButtons product={p} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onVerify={handleVerify}
          updating={updating}
        />
      )}
    </div>
  )
}
