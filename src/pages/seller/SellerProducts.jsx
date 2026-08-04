import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Loader2, AlertCircle, RefreshCw, X } from 'lucide-react'
import { fetchSellerProducts, deleteSellerProduct } from '../../services/api'
import { formatPrice } from '../../utils/helpers'
import StarRating from '../../components/StarRating'
import { useToast } from '../../context/ToastContext'

// Approval status badge — rejected is distinct from pending.
const STATUS_META = {
  approved: { label: 'Approved', classes: 'bg-primary-light text-primary' },
  pending: { label: 'Pending', classes: 'bg-amber-50 text-amber-600' },
  rejected: { label: 'Rejected', classes: 'bg-red-50 text-danger' },
}

const productStatus = (p) => p.status || (p.verified ? 'approved' : 'pending')

/**
 * SellerProducts — lists the seller's own products with edit/delete actions.
 */
export default function SellerProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const showToast = useToast()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setProducts(await fetchSellerProducts())
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const confirmDelete = (product) => setPendingDelete(product)

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(pendingDelete._id)
    try {
      await deleteSellerProduct(pendingDelete._id)
      setProducts((prev) => prev.filter((p) => p._id !== pendingDelete._id))
      showToast('Product deleted successfully')
      setPendingDelete(null)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete product', { type: 'error', duration: 4000 })
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <Loader2 size={36} className="animate-spin text-primary mb-3" />
        <p className="text-sm">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-border-col p-12 text-center">
        <AlertCircle size={36} className="mx-auto mb-3 text-danger" />
        <p className="text-lg font-medium text-text-primary mb-1">Unable to load products</p>
        <p className="text-sm text-text-muted mb-4">{error}</p>
        <button onClick={load} className="btn-primary inline-flex items-center gap-2">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">My Products</h1>
          <p className="text-sm text-text-muted mt-1">{products.length} product{products.length !== 1 && 's'}</p>
        </div>
        <Link
          to="/seller/products/add"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg border border-border-col p-12 text-center">
          <p className="text-lg text-text-secondary mb-2">No products yet</p>
          <p className="text-sm text-text-muted mb-6">Start selling by adding your first product.</p>
          <Link
            to="/seller/products/add"
            className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border-col overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-light text-left text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
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
                        <span className="font-medium text-text-primary line-clamp-2 max-w-xs">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-primary font-medium">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={p.stock > 0 ? 'text-success' : 'text-danger'}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${(STATUS_META[productStatus(p)] || STATUS_META.pending).classes}`}>
                        {(STATUS_META[productStatus(p)] || STATUS_META.pending).label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.totalReviews > 0 ? (
                        <div>
                          <StarRating rating={p.averageRating} maxRating={5} size="sm" />
                          <p className="text-xs text-text-muted mt-0.5">
                            {p.averageRating.toFixed(1)} ({p.totalReviews})
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted">No reviews yet</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/seller/products/${p._id}/edit`}
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:bg-primary-light rounded-lg px-2.5 py-1.5 transition-colors"
                        >
                          <Pencil size={15} /> Edit
                        </Link>
                        <button
                          onClick={() => confirmDelete(p)}
                          className="inline-flex items-center gap-1.5 text-sm text-danger hover:bg-red-50 rounded-lg px-2.5 py-1.5 transition-colors"
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
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
                  <p className="text-sm font-medium text-text-primary line-clamp-2">{p.name}</p>
                  <p className="text-sm font-semibold text-text-primary mt-1">{formatPrice(p.price)}</p>
                  <p className="text-xs text-text-muted">{p.category} · Stock: {p.stock}</p>
                  <div className="flex items-center justify-between gap-2 mt-1.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${(STATUS_META[productStatus(p)] || STATUS_META.pending).classes}`}>
                      {(STATUS_META[productStatus(p)] || STATUS_META.pending).label}
                    </span>
                    {p.totalReviews > 0 && (
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <StarRating rating={p.averageRating} maxRating={5} size="sm" />
                        {p.averageRating.toFixed(1)} ({p.totalReviews})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Link to={`/seller/products/${p._id}/edit`} className="inline-flex items-center gap-1 text-sm text-primary">
                      <Pencil size={14} /> Edit
                    </Link>
                    <button onClick={() => confirmDelete(p)} className="inline-flex items-center gap-1 text-sm text-danger">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPendingDelete(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-text-primary">Delete product?</h3>
              <button onClick={() => setPendingDelete(null)} className="text-text-muted hover:text-text-secondary">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-text-secondary mb-5">
              "{pendingDelete.name}" and its uploaded images will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="flex-1 border border-border-col text-text-primary py-2.5 rounded-lg text-sm font-semibold hover:bg-bg-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting === pendingDelete._id}
                className="flex-1 bg-danger text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting === pendingDelete._id && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
