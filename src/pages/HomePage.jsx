import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Send } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CountdownTimer from '../components/CountdownTimer'
import {
  heroCategories, homeOutdoorCategories,
  electronicsCategories, suppliersRegion,
} from '../data/products'
import { fetchProducts } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { img, formatPrice } from '../utils/helpers'
import Flag from "react-world-flags";

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-bold text-lg text-text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export default function HomePage() {
  const [allProducts, setAllProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()
  const userName = user?.name || ''

  const [inquiry, setInquiry] = useState({ item: '', details: '', quantity: '', unit: 'Pcs' })

  // Fetch featured products from backend API
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await fetchProducts()
        setAllProducts(data)
        setFeaturedProducts(data.slice(0, 6))
      } catch (err) {
        console.error('Failed to load featured products:', err)
        // Fallback: show empty state gracefully — UI stays intact
      }
    }
    loadFeatured()
  }, [])

  // Deals: products currently on sale (originalPrice > price)
  const deals = allProducts.filter((p) => p.originalPrice > p.price)
  // Recommended: remaining products after the featured set
  const recommended = allProducts.slice(6, 16)

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">

        {/* ── Hero Section ── */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <aside className="hidden lg:block bg-white rounded border border-border-col py-3">
            <ul>
              {heroCategories.map((cat) => (
                <li key={cat}>
                  <Link
                    to="/products"
                    className="block px-4 py-2.5 text-sm text-text-secondary hover:bg-primary-light hover:text-primary transition-colors flex items-center justify-between"
                  >
                    {cat}
                    {cat !== 'More category' && <span className="text-text-muted text-xs">›</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="lg:col-span-2 rounded overflow-hidden relative bg-teal-100 min-h-[220px] flex items-end">
            <img
              src={img('hero-banner.jpg')}
              alt="Latest trending Electronic items"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <div className="relative z-10 p-6">
              <p className="text-sm text-text-primary font-medium">Latest trending</p>
              <h1 className="text-2xl font-bold text-text-primary leading-tight mt-1">
                Electronic items
              </h1>
              <Link to="/products" className="mt-3 inline-block bg-white border border-border-col text-text-primary text-sm px-4 py-2 rounded hover:bg-bg-light transition-colors">
                Learn more
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-primary rounded p-4 text-white text-sm">
              <div className="flex items-center gap-2 mb-3">
                {isLoggedIn ? (
                  <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center text-lg font-bold border border-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <img
                    src={img("pic1.jpg")}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border border-white"
                    onError={(e) => { e.target.src = "https://placehold.co/40x40" }}
                  />
                )}
                <div>
                  <div className="font-medium">
                    Hi, {isLoggedIn ? userName.split(' ')[0] : 'user'}
                  </div>
                  <div className="text-xs opacity-80">
                    {isLoggedIn ? "Welcome back" : "let's get started"}
                  </div>
                </div>
              </div>
              {isLoggedIn ? (
                <button
                  onClick={() => navigate('/products')}
                  className="w-full bg-white text-primary text-xs font-semibold py-1.5 rounded hover:opacity-90"
                >
                  Shop now
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/signup"
                    className="flex-1 bg-white text-primary text-xs font-semibold py-1.5 rounded hover:opacity-90 text-center"
                  >
                    Join now
                  </Link>
                  <Link
                    to="/login"
                    className="flex-1 border border-white text-white text-xs font-semibold py-1.5 rounded hover:bg-white/10 text-center"
                  >
                    Log in
                  </Link>
                </div>
              )}
            </div>
            <div className="bg-orange-400 rounded p-3 text-white text-sm">
              <div className="font-semibold text-sm leading-snug">
                Get US $10 off<br />with a new supplier
              </div>
            </div>
            <div className="bg-teal-500 rounded p-3 text-white text-sm flex-1">
              <div className="font-semibold text-sm leading-snug">
                Send quotes with<br />supplier preferences
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured products ── */}
        <section className="bg-white rounded border border-border-col p-5">
          <SectionHeader
            title="Featured products"
            subtitle="Hand-picked products from our catalog"
            action={
              <Link to="/products" className="text-primary text-sm font-medium hover:underline">
                View all products
              </Link>
            }
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-bg-light rounded-lg overflow-hidden p-3 text-center hover:shadow-card-hover transition-shadow"
              >
                <div className="aspect-square bg-white rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                  <img
                    src={img(product.image)}
                    alt={product.name}
                    className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform"
                    onError={(e) => { e.target.src = `https://placehold.co/200x200/f7f7f7/999?text=Image` }}
                  />
                </div>
                <p className="text-xs text-text-muted mb-1 line-clamp-2">{product.category}</p>
                <p className="font-semibold text-sm text-text-primary">{product.name}</p>
                <p className="text-sm text-text-secondary mt-1">{formatPrice(product.price)}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Deals and Offers ── */}
        <section className="bg-white rounded border border-border-col p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="font-bold text-lg text-text-primary">Deals and offers</h2>
              <p className="text-sm text-text-muted">Hygienic equipments</p>
            </div>
            <CountdownTimer />
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {deals.map((item) => {
              const discountPct = item.originalPrice > item.price
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 0
              return (
                <Link
                  key={item.id}
                  to={`/products/${item.id}`}
                  className="flex-shrink-0 w-40 text-center group"
                >
                  <div className="bg-bg-light rounded-lg h-32 flex items-center justify-center overflow-hidden mb-2">
                    <img
                      src={img(item.image)}
                      alt={item.name}
                      className="object-contain w-full h-full p-3 group-hover:scale-105 transition-transform"
                      onError={(e) => { e.target.src = `https://placehold.co/160x128/f7f7f7/999?text=Image` }}
                    />
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-1">{item.name}</p>
                  {discountPct > 0 && (
                    <span className="inline-block mt-1 bg-danger text-white text-xs px-2 py-0.5 rounded-full">
                      {discountPct}% off
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── Home and Outdoor ── */}
        <section className="bg-white rounded border border-border-col overflow-hidden">
          <div className="flex">
            <div className="hidden sm:flex flex-col justify-between bg-green-50 p-5 min-w-[160px] max-w-[180px]">
              <div>
                <h2 className="font-bold text-text-primary">Home and outdoor</h2>
              </div>
              <Link to="/products" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                Source now <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 border-l border-border-col">
              {homeOutdoorCategories.slice(0, 8).map((item, i) => (
                <Link
                  key={i}
                  to="/products"
                  className="border-r border-b border-border-col last:border-r-0 p-3 flex flex-col items-center text-center hover:bg-bg-light transition-colors"
                >
                  <div className="w-16 h-16 bg-bg-light rounded flex items-center justify-center mb-2">
                    <img
                      src={img(item.image)}
                      alt={item.name}
                      className="object-contain w-full h-full p-1"
                      onError={(e) => { e.target.src = `https://placehold.co/64x64/f7f7f7/999?text=` }}
                    />
                  </div>
                  <p className="text-xs font-medium text-text-primary">{item.name}</p>
                  <p className="text-xs text-text-muted">From USD {item.price}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="sm:hidden flex items-center justify-between px-4 py-2 border-t border-border-col">
            <span className="font-semibold text-sm text-text-primary">Home and outdoor</span>
            <Link to="/products" className="text-primary text-sm flex items-center gap-1">
              Source now <ArrowRight size={12} />
            </Link>
          </div>
        </section>

        {/* ── Consumer Electronics ── */}
        <section className="bg-white rounded border border-border-col overflow-hidden">
          <div className="flex">
            <div className="hidden sm:flex flex-col justify-between bg-blue-50 p-5 min-w-[160px] max-w-[180px]">
              <div>
                <h2 className="font-bold text-text-primary">Consumer electronics and gadgets</h2>
              </div>
              <Link to="/products" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                Source now <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 border-l border-border-col">
              {electronicsCategories.slice(0, 8).map((item, i) => (
                <Link
                  key={i}
                  to="/products"
                  className="border-r border-b border-border-col last:border-r-0 p-3 flex flex-col items-center text-center hover:bg-bg-light transition-colors"
                >
                  <div className="w-16 h-16 bg-bg-light rounded flex items-center justify-center mb-2">
                    <img
                      src={img(item.image)}
                      alt={item.name}
                      className="object-contain w-full h-full p-1"
                      onError={(e) => { e.target.src = `https://placehold.co/64x64/f7f7f7/999?text=` }}
                    />
                  </div>
                  <p className="text-xs font-medium text-text-primary">{item.name}</p>
                  <p className="text-xs text-text-muted">From USD {item.price}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="sm:hidden flex items-center justify-between px-4 py-2 border-t border-border-col">
            <span className="font-semibold text-sm text-text-primary">Consumer electronics</span>
            <Link to="/products" className="text-primary text-sm flex items-center gap-1">
              Source now <ArrowRight size={12} />
            </Link>
          </div>
        </section>

        {/* ── Send Inquiry Banner ── */}
        <section className="relative overflow-hidden rounded-xl min-h-[420px]">
          <img
            src={img("inquiry-bg.jpg")}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C7CF1]/90 via-[#2C7CF1]/75 to-[#00B5FF]/30" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">
            <div className="text-white flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                An easy way to send requests to all suppliers
              </h2>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base text-white/90 leading-6 sm:leading-7">
                Browse thousands of products from verified suppliers worldwide.
                Submit your requirements and receive competitive quotes within hours.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full">
              <h3 className="font-bold text-xl mb-4 text-text-primary">
                Send quote to suppliers
              </h3>

              <input
                placeholder="What item you need?"
                value={inquiry.item}
                onChange={(e) => setInquiry({ ...inquiry, item: e.target.value })}
                className="w-full border border-border-col rounded-lg px-4 py-3 mb-4 outline-none focus:border-primary text-sm"
              />

              <textarea
                rows="3"
                placeholder="Type more details"
                value={inquiry.details}
                onChange={(e) => setInquiry({ ...inquiry, details: e.target.value })}
                className="w-full border border-border-col rounded-lg px-4 py-3 mb-4 resize-none outline-none focus:border-primary text-sm"
              />

              <div className="flex gap-2 sm:gap-3 mb-5">
                <input
                  placeholder="Quantity"
                  value={inquiry.quantity}
                  onChange={(e) => setInquiry({ ...inquiry, quantity: e.target.value })}
                  className="flex-1 border border-border-col rounded-lg px-3 sm:px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <select
                  value={inquiry.unit}
                  onChange={(e) => setInquiry({ ...inquiry, unit: e.target.value })}
                  className="sm:w-28 px-2 sm:px-3 py-3 border border-border-col rounded-lg bg-white text-sm outline-none focus:border-primary"
                >
                  <option>Pcs</option>
                  <option>Kg</option>
                  <option>Box</option>
                </select>
              </div>

              <button className="bg-primary hover:bg-primary-dark text-white rounded-lg px-7 py-3 font-medium flex items-center gap-2 transition-colors">
                <Send size={18} />
                Send inquiry
              </button>
            </div>
          </div>
        </section>

        {/* ── Recommended Items ── */}
        <section>
          <SectionHeader title="Recommended items" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {recommended.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="product-card overflow-hidden group text-center p-3"
              >
                <div className="w-full aspect-square bg-bg-light rounded mb-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={img(p.image)}
                    alt={p.name}
                    className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform"
                    onError={(e) => { e.target.src = `https://placehold.co/200x200/f7f7f7/999?text=Image` }}
                  />
                </div>
                <p className="font-semibold text-sm text-text-primary">{formatPrice(p.price)}</p>
                <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{p.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Our Extra Services ── */}
        <section>
          <SectionHeader title="Our extra services" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🏭', title: 'Source from Industry Hubs', bg: 'bg-amber-50' },
              { icon: '🎨', title: 'Customize Your Products', bg: 'bg-blue-50' },
              { icon: '✈️', title: 'Fast, reliable shipping by ocean or air', bg: 'bg-green-50' },
              { icon: '🌐', title: 'Product monitoring and inspection', bg: 'bg-purple-50' },
            ].map((service) => (
              <div key={service.title} className={`${service.bg} rounded-lg p-5 flex flex-col items-center text-center cursor-pointer hover:shadow-card-hover transition-shadow`}>
                <span className="text-3xl mb-3">{service.icon}</span>
                <p className="text-sm font-medium text-text-primary leading-snug">{service.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Suppliers by Region ── */}
        <section className="bg-white rounded border border-border-col p-5">
          <SectionHeader title="Suppliers by region" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {suppliersRegion.map((s, i) => (
              <Link
                key={i}
                to="/products"
                className="flex items-center gap-2 p-2 rounded hover:bg-bg-light transition-colors group"
              >
                <Flag
                  code={s.code}
                  style={{
                    width: "28px",
                    height: "20px",
                    borderRadius: "2px",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{s.country}</p>
                  <p className="text-xs text-text-muted truncate">{s.domain}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
