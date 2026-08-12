import { Link } from 'react-router-dom'
import { Scale, X, AlertCircle } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useCompare } from './CompareContext'
import { img, formatPrice, placeholderImg } from '../../utils/helpers'

const LABEL_COL = 140

const FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock' },
  { key: 'description', label: 'Description' },
]

function FieldValue({ field, product }) {
  switch (field) {
    case 'name':
      return (
        <Link
          to={`/products/${product.id}`}
          className="font-medium text-text-primary hover:text-primary hover:underline transition-colors"
        >
          {product.name}
        </Link>
      )
    case 'price':
      return <span className="font-bold text-text-primary">{formatPrice(product.price)}</span>
    case 'category':
      return product.category || '—'
    case 'stock': {
      const stock = product.stock
      if (stock === undefined || stock === null) return '—'
      if (stock <= 0) return <span className="font-medium text-danger">Out of stock</span>
      return <span className="font-medium text-success">{stock} in stock</span>
    }
    case 'description':
      return <p className="leading-relaxed">{product.description || '—'}</p>
    default:
      return '—'
  }
}

/**
 * ComparePage — side-by-side comparison table for the selected products
 * (name, price, category, stock, description). Products can be removed from
 * here; the selection is cleared automatically when navigating away.
 */
export default function ComparePage() {
  const { items, removeItem, clearItems } = useCompare()
  const n = items.length

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Compare Products</h1>
            <p className="text-sm text-text-muted mt-1">
              {n > 0 ? `${n} of 3 products selected` : 'Select products to compare side by side'}
            </p>
          </div>
          {n > 0 && (
            <button
              onClick={clearItems}
              className="border border-border-col px-4 py-2 rounded text-danger text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {n === 0 ? (
          <div className="bg-white rounded-lg border border-border-col p-12 text-center">
            <Scale size={40} className="mx-auto mb-3 text-text-muted" />
            <p className="text-lg text-text-secondary mb-2">Nothing to compare yet</p>
            <p className="text-sm text-text-muted mb-6">
              Select at least 2 products from the catalog to compare them side by side.
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Browse products
            </Link>
          </div>
        ) : n === 1 ? (
          <div className="bg-white rounded-lg border border-border-col p-12 text-center">
            <AlertCircle size={40} className="mx-auto mb-3 text-warning" />
            <p className="text-lg text-text-secondary mb-2">Select at least 2 products to compare</p>
            <p className="text-sm text-text-muted mb-6">
              You currently have 1 product selected. Add at least one more from the catalog.
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-border-col overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[760px]">
                {/* Header — remove control + product image */}
                <div
                  className="grid border-b border-border-col"
                  style={{ gridTemplateColumns: `${LABEL_COL}px repeat(${n}, 1fr)` }}
                >
                  <div className="px-4 py-4" />
                  {items.map((p) => (
                    <div key={p.id} className="px-4 py-4 border-l border-border-col relative">
                      <button
                        onClick={() => removeItem(p.id)}
                        aria-label={`Remove ${p.name} from comparison`}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-bg-light text-text-muted hover:bg-danger hover:text-white flex items-center justify-center transition-colors"
                      >
                        <X size={14} />
                      </button>
                      <Link to={`/products/${p.id}`} className="block mb-2">
                        <img
                          src={img(p.image)}
                          alt={p.name}
                          className="h-32 w-full object-contain"
                          onError={(e) => { e.target.src = placeholderImg }}
                        />
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Field rows */}
                {FIELDS.map(({ key, label }) => (
                  <div
                    key={key}
                    className="grid border-b border-border-col last:border-b-0"
                    style={{ gridTemplateColumns: `${LABEL_COL}px repeat(${n}, 1fr)` }}
                  >
                    <div className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-text-muted bg-bg-light/60">
                      {label}
                    </div>
                    {items.map((p) => (
                      <div
                        key={p.id}
                        className="px-4 py-3.5 border-l border-border-col text-sm text-text-secondary"
                      >
                        <FieldValue field={key} product={p} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
