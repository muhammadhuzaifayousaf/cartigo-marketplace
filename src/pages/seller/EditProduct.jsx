import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import ProductForm from '../../components/seller/ProductForm'
import { fetchSellerProducts, updateSellerProduct } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'

/**
 * EditProduct — prefilled form for updating one of the seller's products.
 */
export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()
  const { isAdmin } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const products = await fetchSellerProducts()
      const found = products.find((p) => p._id === id)
      if (!found) {
        setError('Product not found')
      } else {
        setProduct(found)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      await updateSellerProduct(id, formData)
      showToast(
        isAdmin
          ? 'Product updated successfully'
          : 'Product updated — it will go live again after admin approval'
      )
      navigate('/seller/products')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update product'
      showToast(message, { type: 'error', duration: 4000 })
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <Loader2 size={36} className="animate-spin text-primary mb-3" />
        <p className="text-sm">Loading product...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-white rounded-lg border border-border-col p-12 text-center">
        <AlertCircle size={36} className="mx-auto mb-3 text-danger" />
        <p className="text-lg font-medium text-text-primary mb-1">Unable to load product</p>
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
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Edit Product</h1>
        <p className="text-sm text-text-muted mt-1">Update the details below.</p>
      </div>
      <div className="bg-white rounded-lg border border-border-col p-4 sm:p-6">
        <ProductForm initialValues={product} onSubmit={handleSubmit} submitting={submitting} submitLabel="Save Changes" />
      </div>
    </div>
  )
}
