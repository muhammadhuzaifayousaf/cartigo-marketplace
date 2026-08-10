import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { PRODUCT_CATEGORIES } from '../../data/categories'
import { brands, features, conditions, ratingFilters } from '../../data/products'
import StarRating from '../../components/StarRating'

// Collapsible section wrapper
function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border-col py-4">
      <button
        className="flex items-center justify-between w-full text-sm font-semibold text-text-primary mb-2"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  )
}

export default function FilterSidebar({ filters, onChange }) {
  const toggle = (key, value) => {
    const current = filters[key] || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: updated })
  }

  const setCondition = (value) => onChange({ ...filters, condition: value })
  const setPriceRange = (key, value) => onChange({ ...filters, price: { ...filters.price, [key]: value } })

  const CheckRow = ({ label, filterKey, value }) => (
    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer py-0.5 hover:text-primary">
      <input
        type="checkbox"
        checked={(filters[filterKey] || []).includes(value)}
        onChange={() => toggle(filterKey, value)}
        className="accent-primary w-3.5 h-3.5"
      />
      {label}
    </label>
  )

  return (
    <aside className="bg-white rounded border border-border-col p-4 w-full">
      {/* Category */}
      <Section title="Category">
        <ul className="space-y-1">
          {PRODUCT_CATEGORIES.map((name) => (
            <li key={name}>
              <button
                onClick={() => toggle('categories', name)}
                className="text-sm text-text-secondary hover:text-primary w-full text-left py-0.5"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {/* Brands */}
      <Section title="Brands">
        <div className="space-y-1">
          {brands.map((b) => (
            <CheckRow key={b} label={b} filterKey="brands" value={b} />
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section title="Features">
        <div className="space-y-1">
          {features.map((f) => (
            <CheckRow key={f} label={f} filterKey="features" value={f} />
          ))}
        </div>
      </Section>

      {/* Price Range */}
      <Section title="Price range">
        <div className="space-y-2">
          <input
            type="range" min={0} max={999999}
            value={filters.price?.max || 999999}
            onChange={(e) => setPriceRange('max', Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-text-muted block mb-1">Min</label>
              <input
                type="number"
                value={filters.price?.min || 0}
                onChange={(e) => setPriceRange('min', Number(e.target.value))}
                placeholder="0"
                className="border border-border-col rounded px-2 py-1 text-sm w-full"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-text-muted block mb-1">Max</label>
              <input
                type="number"
                value={filters.price?.max || ''}
                onChange={(e) => setPriceRange('max', Number(e.target.value))}
                placeholder="999999"
                className="border border-border-col rounded px-2 py-1 text-sm w-full"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Condition */}
      <Section title="Condition">
        <div className="space-y-1">
          {conditions.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer py-0.5">
              <input
                type="radio"
                name="condition"
                checked={filters.condition === c}
                onChange={() => setCondition(c)}
                className="accent-primary"
              />
              {c}
            </label>
          ))}
        </div>
      </Section>

      {/* Ratings */}
      <Section title="Ratings">
        <div className="space-y-1">
          {ratingFilters.map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={(filters.ratings || []).includes(r)}
                onChange={() => toggle('ratings', r)}
                className="accent-primary w-3.5 h-3.5"
              />
              <StarRating rating={r * 2} size="sm" />
            </label>
          ))}
        </div>
      </Section>

      {/* Manufacturer */}
      <Section title="Manufacturer" defaultOpen={false}>
        <p className="text-sm text-text-muted italic">Select manufacturer…</p>
      </Section>
    </aside>
  )
}
