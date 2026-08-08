import { useState, useRef, useCallback } from 'react'
import { ImagePlus, X } from 'lucide-react'
import FormInput from '../FormInput'
import { img } from '../../utils/helpers'
import { PRODUCT_CATEGORIES } from '../../data/categories'

/**
 * ProductForm — shared seller form used by AddProduct and EditProduct.
 * Handles validation, Cloudinary-ready FormData building, and image
 * previews. Avoids duplicating the form between create and edit pages.
 *
 * @param {Object}   props
 * @param {Object}   [props.initialValues]  Existing product (edit) or null (add)
 * @param {Function} props.onSubmit         (FormData) => Promise
 * @param {boolean}  props.submitting
 * @param {string}   props.submitLabel
 */
export default function ProductForm({ initialValues = null, onSubmit, submitting = false, submitLabel = 'Save Product' }) {
  const isEdit = Boolean(initialValues)

  const [form, setForm] = useState({
    name: initialValues?.name || '',
    price: initialValues?.price ?? '',
    category: initialValues?.category || '',
    brand: initialValues?.brand || '',
    stock: initialValues?.stock ?? '',
    originalPrice: initialValues?.originalPrice ?? '',
    description: initialValues?.description || '',
    features: Array.isArray(initialValues?.features) ? initialValues.features.join(', ') : '',
  })
  const [errors, setErrors] = useState({})
  const [files, setFiles] = useState([])
  const [removedExisting, setRemovedExisting] = useState([])
  const fileInputRef = useRef(null)
  const dragIndexRef = useRef(null)

  // Existing images shown when editing — removable, and kept unless removed.
  const existingImages = initialValues?.images?.length
    ? initialValues.images
    : initialValues?.image
      ? [initialValues.image]
      : []

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleFiles = (e) => {
    const incoming = Array.from(e.target.files || [])
    if (incoming.length === 0) return

    // Enforce a total of 5 images — existing (kept) images count toward the limit.
    if (keptExisting.length + files.length >= 5) {
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Append new selections to the remaining capacity, deduping by
    // name+size+lastModified so picking the same file twice doesn't duplicate.
    // Only the incoming files are limited by remaining room — the existing
    // selection is never truncated (that caused the 4th pick to drop the 3rd).
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => `${f.name}-${f.size}-${f.lastModified}`))
      const fresh = incoming.filter((f) => !existing.has(`${f.name}-${f.size}-${f.lastModified}`))
      const room = 5 - (keptExisting.length + prev.length)
      return [...prev, ...fresh.slice(0, Math.max(room, 0))]
    })

    // Reset the input value so choosing the same file again still fires onChange.
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Drag-to-reorder the newly added images ──
  const handleDragStart = (index) => (e) => {
    dragIndexRef.current = index
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (index) => (e) => {
    e.preventDefault()
    const from = dragIndexRef.current
    dragIndexRef.current = null
    if (from === null || from === index) return
    setFiles((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(from < index ? index - 1 : index, 0, moved)
      return next
    })
  }

  const removeExisting = (src) => {
    setRemovedExisting((prev) => (prev.includes(src) ? prev : [...prev, src]))
  }

  const keptExisting = existingImages.filter((src) => !removedExisting.includes(src))

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Product name is required'
    if (form.price === '' || Number(form.price) < 0 || !Number.isFinite(Number(form.price))) {
      newErrors.price = 'Enter a valid price'
    }
    if (!form.category.trim()) newErrors.category = 'Category is required'
    if (form.stock === '' || Number(form.stock) < 0) newErrors.stock = 'Enter a valid stock quantity'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    if (keptExisting.length === 0 && files.length === 0) {
      newErrors.images = 'Upload or keep at least one product image'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'features') {
        // Features sent as a comma-separated string; backend stores as array.
        formData.append(key, value.split(',').map((f) => f.trim()).filter(Boolean).join(', '))
      } else {
        formData.append(key, value)
      }
    })
    files.forEach((file) => formData.append('images', file))
    if (keptExisting.length > 0) {
      formData.append('existingImages', JSON.stringify(keptExisting))
    }

    await onSubmit(formData)
  }

  const previewSrc = useCallback(
    (file) => file instanceof File ? URL.createObjectURL(file) : img(file),
    []
  )

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <div className="md:col-span-2">
          <FormInput
            label="Product name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g. Wireless Bluetooth Earbuds"
          />
        </div>

        <FormInput
          label="Price (USD)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="0.00"
        />
        <FormInput
          label="Original price (USD, optional)"
          name="originalPrice"
          type="number"
          step="0.01"
          min="0"
          value={form.originalPrice}
          onChange={handleChange}
          error={errors.originalPrice}
          placeholder="0.00"
        />

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-1.5">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-all duration-200 bg-white ${
              errors.category
                ? 'border-danger focus:ring-2 focus:ring-danger/30'
                : 'border-border-col focus:border-primary focus:ring-2 focus:ring-primary/20'
            }`}
          >
            <option value="" disabled>Select a category</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-danger">{errors.category}</p>
          )}
        </div>
        <FormInput
          label="Brand"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          error={errors.brand}
          placeholder="e.g. Cartiqo"
        />

        <FormInput
          label="Stock quantity"
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          error={errors.stock}
          placeholder="0"
        />
        <FormInput
          label="Features (comma separated, optional)"
          name="features"
          value={form.features}
          onChange={handleChange}
          error={errors.features}
          placeholder="1 year warranty, Fast shipping"
        />

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your product..."
            className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-all duration-200 resize-none ${
              errors.description
                ? 'border-danger focus:ring-2 focus:ring-danger/30'
                : 'border-border-col focus:border-primary focus:ring-2 focus:ring-primary/20'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-danger">{errors.description}</p>
          )}
        </div>
      </div>

      {/* ── Image upload with previews ── */}
      <div className="mt-4">
        <span className="block text-sm font-medium text-text-primary mb-1.5">
          Product images ({keptExisting.length + files.length}/5)
        </span>
        <div
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
          role="button"
          tabIndex={0}
          className="border-2 border-dashed border-border-col rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <ImagePlus size={28} className="mx-auto text-text-muted mb-2" />
          <p className="text-sm text-text-secondary">Click to choose images</p>
          <p className="text-xs text-text-muted mt-1">JPG, PNG, WEBP — up to 5MB each</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </div>
        {errors.images && <p className="mt-1 text-xs text-danger">{errors.images}</p>}
        {keptExisting.length + files.length >= 5 && (
          <p className="mt-1 text-xs text-text-muted">Maximum 5 images reached — remove one to add another.</p>
        )}

        {(existingImages.length > 0 || files.length > 0) && (
          <div className="flex flex-wrap gap-3 mt-3">
            {existingImages.filter((src) => !removedExisting.includes(src)).map((src, i) => (
              <div key={`existing-${i}`} className="relative w-24 h-24">
                <img src={previewSrc(src)} alt={`Existing ${i + 1}`} className="w-full h-full object-contain border border-border-col rounded-lg bg-white p-1" />
                <button
                  type="button"
                  onClick={() => removeExisting(src)}
                  className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-0.5 shadow hover:bg-red-600 transition-colors"
                  aria-label="Remove existing image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {files.map((file, i) => (
              <div
                key={`new-${i}`}
                draggable
                onDragStart={handleDragStart(i)}
                onDragOver={handleDragOver}
                onDrop={handleDrop(i)}
                title="Hold and drag to rearrange"
                className="relative w-24 h-24 cursor-grab active:cursor-grabbing select-none"
              >
                <img src={previewSrc(file)} alt={`New ${i + 1}`} className="w-full h-full object-contain border border-border-col rounded-lg bg-bg-light p-1 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-0.5 shadow pointer-events-auto"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        {files.length > 1 && (
          <p className="text-xs text-text-muted mt-2">Hold and drag images to rearrange the order.</p>
        )}
        {isEdit && (
          <p className="text-xs text-text-muted mt-2">Removed images are deleted from the store on save.</p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
