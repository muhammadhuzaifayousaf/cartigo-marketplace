import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FilterSidebar from '../components/FilterSidebar'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 border border-border-col rounded px-2 py-0.5 text-sm text-text-secondary bg-white">
      {label}
      <button onClick={onRemove} className="text-text-muted hover:text-danger ml-0.5">
        <X size={12} />
      </button>
    </span>
  )
}

function Pagination({ currentPage, totalPages, onChange, itemsPerPage, onItemsPerPageChange }) {
  return (
    <div className="flex items-center justify-end gap-1 mt-6">
      <span className="text-sm text-text-muted mr-2">
        Show
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-border-col rounded px-2 py-1 text-sm ml-1 mr-1 bg-white"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </span>
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-1 border border-border-col rounded hover:bg-bg-light disabled:opacity-40 transition-colors"
      >
        <ChevronLeft size={14} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 rounded border text-sm font-medium transition-colors ${
            p === currentPage
              ? 'bg-primary text-white border-primary'
              : 'border-border-col text-text-secondary hover:bg-bg-light'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-1 border border-border-col rounded hover:bg-bg-light disabled:opacity-40 transition-colors"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

export default function ProductListingPage() {
  const [viewMode, setViewMode]           = useState('grid')
  const [sortBy, setSortBy]               = useState('featured')
  const [verifiedOnly, setVerifiedOnly]   = useState(false)
  const [wishlistIds, setWishlistIds]     = useState([])
  const [currentPage, setCurrentPage]     = useState(1)
  const [itemsPerPage, setItemsPerPage]   = useState(10)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const [filters, setFilters] = useState({
    brands: [],
    features: [],
    categories: [],
    ratings: [],
    condition: 'Any',
    price: { min: 0, max: 999999 },
  })

  const categories = ['All', ...new Set(products.map((product) => product.category))]

  useEffect(() => {
    const query = searchParams.get('q') || ''
    setSearchTerm(query)
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = [...products]

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory)
    }
    if (filters.brands.length)
      list = list.filter((p) => filters.brands.includes(p.brand))
    if (filters.categories.length)
      list = list.filter((p) => filters.categories.includes(p.category))
    if (verifiedOnly)
      list = list.filter((p) => p.verified)
    if (filters.ratings.length)
      list = list.filter((p) => filters.ratings.some((r) => p.rating >= r))
    if (filters.condition !== 'Any')
      list = list.filter((p) => p.condition === filters.condition)

    list = list.filter(
      (p) => p.price >= filters.price.min && p.price <= filters.price.max
    )

    switch (sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price);  break
      case 'price-desc': list.sort((a, b) => b.price - a.price);  break
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break
      default: break
    }

    return list
  }, [searchTerm, selectedCategory, filters, sortBy, verifiedOnly])

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleWishlist = (id) =>
    setWishlistIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const activeChips = [
    ...filters.brands.map((b)    => ({ label: b,    key: 'brands',     val: b })),
    ...filters.features.map((f)  => ({ label: f,    key: 'features',   val: f })),
    ...filters.categories.map((c)=> ({ label: c,    key: 'categories', val: c })),
  ]

  const removeChip = ({ key, val }) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key].filter((v) => v !== val) }))
  }

  const clearAll = () => {
    setSearchTerm('')
    setSearchParams({})
    setSelectedCategory('All')
    setFilters({ brands: [], features: [], categories: [], ratings: [], condition: 'Any', price: { min: 0, max: 999999 } })
  }

  const activeCategory = selectedCategory === 'All' ? 'All Products' : selectedCategory

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-text-muted">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-1">›</span>
        <span className="text-text-primary">{activeCategory}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-10">
        <div className="flex gap-5">
          {/* ── Sidebar (desktop) ── */}
          <div className="hidden md:block w-60 flex-shrink-0">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          {/* ── Mobile filter drawer ── */}
          {showMobileFilter && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div className="bg-black/40 flex-1" onClick={() => setShowMobileFilter(false)} />
              <div className="w-72 bg-white overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-text-primary">Filters</span>
                  <button onClick={() => setShowMobileFilter(false)}><X size={18} /></button>
                </div>
                <FilterSidebar filters={filters} onChange={setFilters} />
              </div>
            </div>
          )}

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded border border-border-col p-3 flex flex-col gap-3 mb-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => {
                    const value = event.target.value
                    setSearchTerm(value)
                    setSearchParams({ q: value })
                    setCurrentPage(1)
                  }}
                  placeholder="Search products"
                  className="flex-1 border border-border-col rounded px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <select
                  value={selectedCategory}
                  onChange={(event) => {
                    setSelectedCategory(event.target.value)
                    setCurrentPage(1)
                  }}
                  className="border border-border-col rounded px-3 py-2 text-sm bg-white outline-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-text-muted">
                  <strong className="text-text-primary">{filtered.length}</strong> items in{' '}
                  <strong className="text-text-primary">{activeCategory}</strong>
                </span>
                <label className="flex items-center gap-1.5 text-sm text-text-secondary cursor-pointer ml-auto sm:ml-0">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="accent-primary"
                  />
                  Verified only
                </label>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-border-col rounded px-3 py-1.5 text-sm bg-white outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Best Rating</option>
                </select>

                <div className="flex border border-border-col rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-light'}`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-light'}`}
                    aria-label="List view"
                  >
                    <List size={16} />
                  </button>
                </div>

                <button
                  className="md:hidden flex items-center gap-1 text-sm text-text-secondary border border-border-col rounded px-3 py-1.5"
                  onClick={() => setShowMobileFilter(true)}
                >
                  <SlidersHorizontal size={14} /> Filter
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {activeChips.map((chip, i) => (
                  <FilterChip key={i} label={chip.label} onRemove={() => removeChip(chip)} />
                ))}
                <button onClick={clearAll} className="text-sm text-primary hover:underline">
                  Clear all filters
                </button>
              </div>
            )}

            {/* Products */}
            {paginated.length === 0 ? (
              <div className="bg-white rounded border border-border-col p-12 text-center text-text-muted">
                <p className="text-lg mb-1">No products found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
                <button onClick={clearAll} className="bg-primary text-white mt-4 px-6 py-2 rounded text-sm font-semibold hover:bg-primary-dark transition-colors">
                  Clear all filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {paginated.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    mode="grid"
                    wishlistIds={wishlistIds}
                    onWishlist={toggleWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {paginated.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    mode="list"
                    wishlistIds={wishlistIds}
                    onWishlist={toggleWishlist}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1) }}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
