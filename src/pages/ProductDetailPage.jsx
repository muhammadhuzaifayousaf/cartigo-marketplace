import { useState, useEffect, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Star, Shield, Globe, ChevronLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StarRating from '../components/StarRating'
import PromoBanner from '../components/PromoBanner'
import { fetchProductById, fetchProducts } from '../services/api'
import { img, formatPrice } from '../utils/helpers'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import Flag from 'react-world-flags'

// "You may like" sidebar items (static data matching design)
const youMayLike = [
  { name: 'Men Blazers Sets Elegant Formal', price: '$7.00 - $99.50',  image: 'tshirt.jpg' },
  { name: 'Men Shirt Sleeve Polo Contrast',  price: '$7.00 - $99.50',  image: 'tshirt.jpg' },
  { name: 'Apple Watch Series Space Gray',   price: '$7.00 - $99.50',  image: 'smartwatch.jpg' },
  { name: 'Basketball Crew Socks Long Stuff',price: '$7.00 - $99.50',  image: 'tshirt.jpg' },
  { name: "New Summer Men's castrol T-Shirts", price: '$7.00 - $99.50', image: 'backpack.jpg' },
]

// ── Loading Spinner ────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-text-muted">
      <Loader2 size={40} className="animate-spin text-primary mb-3" />
      <p className="text-sm">Loading product details...</p>
    </div>
  )
}

// ── Error State ────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-white rounded border border-border-col p-12 text-center">
      <AlertCircle size={40} className="mx-auto mb-3 text-danger" />
      <p className="text-lg font-medium text-text-primary mb-1">Unable to load product</p>
      <p className="text-sm text-text-muted mb-4">{message || 'The product could not be found.'}</p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="btn-primary inline-flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Retry
        </button>
        <Link to="/products" className="btn-outline">
          Back to Products
        </Link>
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { addItem } = useCart()
  const showToast = useToast()

  // ── Backend data state ──
  const [product, setProduct]           = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const [activeImg,     setActiveImg]     = useState(0)
  const [activeTab,     setActiveTab]     = useState('description')
  const [wishlisted,    setWishlisted]    = useState(false)
  const [qty,           setQty]           = useState(1)

  // ── Fetch single product + all products for related section ──
  const loadProduct = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch the single product and all products in parallel
      const [productData, allProducts] = await Promise.all([
        fetchProductById(id),
        fetchProducts(),
      ])
      setProduct(productData)
      // Related products: exclude current product, take first 6
      setRelatedProducts(allProducts.filter((p) => p.id !== productData.id).slice(0, 6))
    } catch (err) {
      console.error('Failed to fetch product:', err)
      if (err.response?.status === 404) {
        setError('Product not found. It may have been removed.')
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load product')
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadProduct()
    // Reset scroll and state when navigating to a different product
    window.scrollTo(0, 0)
    setActiveImg(0)
    setActiveTab('description')
    setWishlisted(false)
    setQty(1)
  }, [loadProduct])

  // ── Loading State ──
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light">
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </div>
    )
  }

  // ── Error State ──
  if (error || !product) {
    return (
      <div className="min-h-screen bg-bg-light">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <ErrorState message={error} onRetry={loadProduct} />
        </div>
        <Footer />
      </div>
    )
  }

  // Thumbnail images — use uploaded images when available (Cloudinary), else repeat the single image
  const thumbImages = product.images && product.images.length > 0
    ? product.images
    : Array(6).fill(product.image)
  const tabs = ['description', 'reviews', 'shipping', 'about seller']
  const sellerName = product.sellerName || 'ShopHub'
  const sellerInitial = (sellerName.charAt(0) || 'S').toUpperCase()

  const priceTiers = [
    { range: '1-49 pcs',   price: product.price },
    { range: '50-99 pcs',  price: Math.round(product.price * 0.92 * 100) / 100 },
    { range: '100+ pcs',   price: Math.round(product.price * 0.82 * 100) / 100 },
  ]

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1 text-sm text-text-muted flex-wrap">
        <Link to="/"         className="hover:text-primary">Home</Link>
        <span>›</span>
        <Link to="/products" className="hover:text-primary">{product.category}</Link>
        <span>›</span>
        <span className="text-text-primary truncate max-w-[200px]">{product.name}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-10 space-y-5">

        {/* ── Top Product Section ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Image gallery */}
          <div className="bg-white rounded border border-border-col p-4">
            <div className="aspect-square bg-bg-light rounded flex items-center justify-center overflow-hidden mb-3">
              <img
                src={img(thumbImages[activeImg])}
                alt={product.name}
                className="object-contain w-full h-full p-4"
                onError={(e) => { e.target.src = `https://placehold.co/400x400/f7f7f7/999?text=Product` }}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {thumbImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-14 h-14 rounded border-2 overflow-hidden transition-colors ${
                    i === activeImg ? 'border-primary' : 'border-border-col hover:border-primary/50'
                  }`}
                >
                  <img
                    src={img(src)}
                    alt={`View ${i + 1}`}
                    className="object-contain w-full h-full p-1"
                    onError={(e) => { e.target.src = `https://placehold.co/56x56/f7f7f7/999?text=` }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded border border-border-col p-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 text-sm font-medium ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                {product.stock > 0 ? '✓ In stock' : '✕ Out of stock'}
              </span>
              <span className="text-sm text-text-muted">•</span>
              <span className="text-sm text-text-muted">Category: {product.category}</span>
            </div>

            <h1 className="text-lg font-bold text-text-primary leading-snug mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
              <StarRating rating={product.rating} size="md" />
              <span className="font-medium">{product.rating}</span>
              <span className="flex items-center gap-1">
                💬 {product.reviews || 32} reviews
              </span>
              <span className="flex items-center gap-1">
                🛒 {product.orders || 120} sold
              </span>
            </div>

            <div className="mb-4">
              <div className="text-2xl font-bold text-text-primary">{formatPrice(product.price)}</div>
              <p className="text-sm text-text-secondary mt-2">{product.description}</p>
            </div>

            {/* Price tiers */}
            <div className="grid grid-cols-3 gap-0 mb-5 border border-border-col rounded overflow-hidden">
              {priceTiers.map((tier, i) => (
                <div
                  key={i}
                  className={`p-2 text-center border-r last:border-r-0 border-border-col ${
                    i === 0 ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className={`font-bold text-sm ${i === 0 ? 'text-danger' : 'text-text-primary'}`}>
                    ${tier.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-text-muted">{tier.range}</div>
                </div>
              ))}
            </div>

            {/* Specs table */}
            <table className="w-full text-sm mb-4">
              <tbody>
                {[
                  ['Price',         'Negotiable'],
                  ['Type',          product.category],
                  ['Material',      product.specs?.Material || 'Premium material'],
                  ['Customization', 'Customized logo and design custom packages'],
                  ['Protection',    'Refund Policy'],
                  ['Warranty',      '2 years full warranty'],
                ].map(([key, val]) => (
                  <tr key={key} className="border-b border-border-col last:border-0">
                    <td className="py-2 pr-4 text-text-muted w-32">{key}</td>
                    <td className="py-2 text-text-secondary">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 mt-4">
              <label className="text-sm text-text-secondary">Quantity:</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border border-border-col rounded px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: img(product.image),
                    seller: product.seller || null,
                    sellerName: product.sellerName || 'ShopHub',
                  }, qty)
                  showToast('Successfully added to cart!')
                  setQty(1)
                }}
                className="flex-1 bg-primary text-white py-2.5 rounded text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Supplier card */}
          <div className="bg-white rounded border border-border-col p-5 h-fit">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold text-lg">
                {sellerInitial}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Supplier</p>
                <p className="font-semibold text-text-primary text-sm">{sellerName}</p>
              </div>
            </div>
            
            <div className="space-y-1.5 mb-4 text-sm">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Flag code="DE" style={{ width: 16, height: 10, borderRadius: 1, objectFit: 'cover' }} />
                <span>Germany, Berlin</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Shield size={14} className="text-success" /> Verified Seller
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Globe size={14} className="text-primary" /> Worldwide shipping
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full bg-primary text-white py-2 rounded text-sm font-semibold hover:bg-primary-dark transition-colors">
                Send inquiry
              </button>
              <button className="w-full border border-border-col text-text-secondary py-2 rounded text-sm font-medium hover:border-primary hover:text-primary transition-colors">
                Seller's profile
              </button>
            </div>
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className={`w-full mt-3 flex items-center justify-center gap-2 text-sm py-2 rounded border transition-colors ${
                wishlisted
                  ? 'border-danger text-danger bg-red-50'
                  : 'border-border-col text-text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              <Heart size={14} className={wishlisted ? 'fill-danger' : ''} />
              {wishlisted ? 'Saved' : 'Save for later'}
            </button>
          </div>
        </div>

        {/* ── Description + You may like ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-white rounded border border-border-col overflow-hidden">
            <div className="flex border-b border-border-col overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-5 py-3 text-sm font-medium capitalize whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary -mb-px bg-white'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {product.description}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur.
                  </p>

                  {/* Specs table */}
                  {product.specs && Object.keys(product.specs).length > 0 && (
                    <table className="w-full border border-border-col rounded text-sm overflow-hidden">
                      <tbody>
                        {Object.entries(product.specs).map(([k, v]) => (
                          <tr key={k} className="border-b border-border-col last:border-0">
                            <td className="px-4 py-2 bg-bg-light font-medium text-text-primary w-40">{k}</td>
                            <td className="px-4 py-2 text-text-secondary">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Features list */}
                  {product.features && product.features.length > 0 && (
                    <ul className="space-y-1.5">
                      {product.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-success mt-0.5">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="text-sm text-text-muted py-6 text-center">
                  <Star size={32} className="mx-auto mb-2 text-yellow-400" />
                  <p>{product.reviews || 32} customer reviews — average rating {product.rating}/10</p>
                </div>
              )}
              {activeTab === 'shipping' && (
                <p className="text-sm text-text-secondary">Free worldwide shipping on orders over $50.</p>
              )}
              {activeTab === 'about seller' && (
                <p className="text-sm text-text-secondary">
                  {sellerName} — verified seller. Worldwide shipping with 2-year warranty.
                </p>
              )}
            </div>
          </div>

          {/* You may like */}
          <div className="bg-white rounded border border-border-col p-4 h-fit">
            <h3 className="font-semibold text-text-primary mb-3 text-sm">You may like</h3>
            <ul className="space-y-3">
              {relatedProducts.filter((p) => p.id !== product.id).slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link to={`/products/${item.id}`} className="flex gap-3 hover:bg-bg-light rounded p-1 transition-colors">
                    <div className="w-12 h-12 bg-bg-light rounded flex-shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        src={img(item.image)}
                        alt={item.name}
                        className="object-contain w-full h-full p-1"
                        onError={(e) => { e.target.src = `https://placehold.co/48x48/f7f7f7/999?text=` }}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary leading-snug line-clamp-2">{item.name}</p>
                      <p className="text-xs font-medium text-text-primary mt-0.5">{formatPrice(item.price)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded border border-border-col p-5">
            <h2 className="font-bold text-text-primary mb-4">Related products</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="flex-shrink-0 w-40 group"
                >
                  <div className="h-32 bg-bg-light rounded flex items-center justify-center overflow-hidden mb-2">
                    <img
                      src={img(p.image)}
                      alt={p.name}
                      className="object-contain w-full h-full p-3 group-hover:scale-105 transition-transform"
                      onError={(e) => { e.target.src = `https://placehold.co/160x128/f7f7f7/999?text=Image` }}
                    />
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-snug">{p.name}</p>
                  <p className="text-xs font-semibold text-text-primary mt-1">
                    {formatPrice(p.price)} – {formatPrice((p.originalPrice || p.price * 1.5))}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Promo Banner ── */}
        <div className="mt-8">
          <PromoBanner />
        </div>
      </main>

      <Footer />
    </div>
  )
}
