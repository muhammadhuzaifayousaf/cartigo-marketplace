import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductForm from '../../components/seller/ProductForm'
import { createSellerProduct } from '../../services/api'
import { useToast } from '../../context/ToastContext'

/**
 * AddProduct — form for creating a seller product with Cloudinary upload.
 */
export default function AddProduct() {
  const navigate = useNavigate()
  const showToast = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      const product = await createSellerProduct(formData)
      showToast('Product created successfully')
      navigate('/seller/products')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create product'
      showToast(message, { type: 'error', duration: 4000 })
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Add Product</h1>
        <p className="text-sm text-text-muted mt-1">Fill in the details below. Images are uploaded to Cloudinary.</p>
      </div>
      <div className="bg-white rounded-lg border border-border-col p-4 sm:p-6">
        <ProductForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Create Product" />
      </div>
    </div>
  )
}
