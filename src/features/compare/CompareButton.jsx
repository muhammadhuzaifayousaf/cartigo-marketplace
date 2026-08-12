import { Check } from 'lucide-react'
import { useCompare, MAX_COMPARE_ITEMS } from './CompareContext'
import { useToast } from '../../context/ToastContext'

/**
 * CompareButton — a small checkbox on product cards that toggles the product
 * in the comparison list (max {@link MAX_COMPARE_ITEMS}).
 *
 * @param {Object} props
 * @param {Object} props.product   full product object
 * @param {string} props.className positioning/extra classes for the button
 */
export default function CompareButton({ product, className = '' }) {
  const { isCompared, count, addItem, removeItem } = useCompare()
  const showToast = useToast()
  const checked = isCompared(product.id)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (checked) {
      removeItem(product.id)
      showToast('Removed from comparison', { type: 'info', duration: 2000 })
      return
    }
    if (count >= MAX_COMPARE_ITEMS) {
      showToast(
        `You can compare up to ${MAX_COMPARE_ITEMS} products at a time.`,
        { type: 'error', duration: 3000 }
      )
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || '',
      stock: product.stock,
      description: product.description || '',
    })
    showToast('Added to comparison')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={checked}
      aria-label={checked ? 'Remove from comparison' : 'Add to comparison'}
      title={checked ? 'Remove from comparison' : 'Add to comparison'}
      className={className}
    >
      <span
        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          checked ? 'bg-primary border-primary text-white' : 'border-border-col bg-white'
        }`}
      >
        {checked && <Check size={12} strokeWidth={3.5} />}
      </span>
    </button>
  )
}
