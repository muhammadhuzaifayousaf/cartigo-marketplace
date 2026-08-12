import { Link, useLocation } from 'react-router-dom'
import { X, Scale } from 'lucide-react'
import { useCompare } from './CompareContext'
import { img } from '../../utils/helpers'

/**
 * CompareBar — floating bar fixed to the bottom of the screen. Appears once
 * at least 2 products are selected (hidden on the /compare page itself, where
 * the full comparison table is already shown). Lets the user see what's
 * selected, drop individual products, clear everything, or jump to /compare.
 */
export default function CompareBar() {
  const { items, count, removeItem, clearItems } = useCompare()
  const { pathname } = useLocation()

  if (pathname === '/compare' || count < 2) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pointer-events-none">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-border-col shadow-card pointer-events-auto flex items-center gap-3 px-4 py-3">
        <Scale size={18} className="text-primary flex-shrink-0" />
        <span className="text-sm font-semibold text-text-primary whitespace-nowrap flex-shrink-0">
          {count}/3
        </span>

        <div className="flex items-center gap-2 overflow-x-auto min-w-0 flex-1">
          {items.map((p) => (
            <div key={p.id} className="relative flex-shrink-0">
              <img
                src={img(p.image)}
                alt={p.name}
                className="w-9 h-9 object-contain rounded border border-border-col bg-bg-light p-0.5"
              />
              <button
                onClick={() => removeItem(p.id)}
                aria-label={`Remove ${p.name} from comparison`}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-danger text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X size={10} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 flex-shrink-0">
          <button
            onClick={clearItems}
            className="text-xs font-medium text-text-muted hover:text-danger transition-colors"
          >
            Clear all
          </button>
          <Link to="/compare" className="btn-primary !px-4 !py-2 text-sm">
            Compare
          </Link>
        </div>
      </div>
    </div>
  )
}
