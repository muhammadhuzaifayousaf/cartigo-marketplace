import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, User, MessageSquare, Package,
  Search, ChevronDown, Menu, X, ShoppingBag,
  Home, List, Heart, FileText, Globe, LogOut,
} from 'lucide-react'
import { navCategories } from '../data/products'
import { useCart } from '../context/CartContext'
import ReactCountryFlag from "react-country-flag";

const getFlagEmoji = (countryCode) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
      <div className="bg-primary rounded p-1.5">
        <ShoppingBag size={18} className="text-white" />
      </div>
      <span className="text-xl font-bold text-primary">Brand</span>
    </Link>
  )
}

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`)
      onSearch?.()
    }
  }

  return (
    <div className="flex flex-1 max-w-2xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search"
        className="flex-1 border border-border-col border-r-0 rounded-l px-4 py-2 text-sm outline-none focus:border-primary"
      />
      <select className="border border-border-col border-r-0 px-2 py-2 text-sm bg-white text-text-secondary outline-none cursor-pointer">
        <option>All category</option>
        <option>Electronics</option>
        <option>Clothes</option>
        <option>Home</option>
      </select>
      <button
        onClick={handleSearch}
        className="bg-primary text-white px-5 py-2 rounded-r text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        Search
      </button>
    </div>
  )
}

function IconBtn({ icon: Icon, label, to, badge }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-0.5 text-text-secondary hover:text-primary transition-colors relative">
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-danger text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
          {badge}
        </span>
      )}
      <Icon size={20} />
      <span className="text-[11px] leading-none">{label}</span>
    </Link>
  )
}

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true')
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '')

  useEffect(() => {
    const onStorage = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true')
      setUserName(localStorage.getItem('userName') || '')
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { isLoggedIn, userName }
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const { isLoggedIn, userName } = useAuth()

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userName')
    setMobileOpen(false)
    navigate('/')
    window.location.reload()
  }

  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U'

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* ── Top bar: Logo | Search | Icons ── */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <button
          className="md:hidden text-text-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Logo />

        <div className="hidden md:flex flex-1">
          <SearchBar />
        </div>

        {/* Desktop nav: icons + auth buttons */}
        <nav className="hidden md:flex items-center gap-5">
          <IconBtn icon={MessageSquare} label="Message" to="/" />
          <IconBtn icon={Package} label="Orders" to="/" />
          <IconBtn icon={ShoppingCart} label="My cart" to="/cart" badge={totalItems} />

          <div className="w-px h-8 bg-border-col" />

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  {userInitial}
                </div>
                <span className="text-sm font-medium text-text-primary">
                  Hi, {userName.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-danger transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/signup"
                className="text-sm font-semibold text-primary border border-primary px-4 py-1.5 rounded-lg hover:bg-primary-light transition-colors"
              >
                Join now
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold text-white bg-primary px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile: cart + user */}
        <div className="flex md:hidden items-center gap-3 ml-auto">
          <Link to="/cart" className="relative text-text-secondary">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-danger text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          {isLoggedIn ? (
            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
              {userInitial}
            </div>
          ) : (
            <Link to="/login" className="text-text-secondary">
              <User size={22} />
            </Link>
          )}
        </div>
      </div>

      {/* ── Mobile search ── */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar onSearch={() => setMobileOpen(false)} />
      </div>

      {/* ── Secondary nav bar (desktop) ── */}
      <div className="hidden md:flex border-t border-border-col">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1 text-sm font-medium text-text-primary hover:text-primary">
              <Menu size={16} /> All category
            </button>
            {navCategories.slice(1).map((cat) => (
              <Link
                key={cat}
                to="/products"
                className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                {cat}
                {cat === 'Help' && <ChevronDown size={12} />}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <button className="flex items-center gap-1 hover:text-primary">
              English, USD
              <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1 hover:text-primary">
              Ship to <img
                src="https://flagcdn.com/w20/us.png"
                alt="USA"
                className="w-5 h-4 object-cover rounded-sm"
              />
              <ChevronDown size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile category chips ── */}
      <div className="md:hidden border-t border-border-col">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-2">
          {['All category', 'Gadgets', 'Clothes', 'Accessories', 'Electronics', 'Sports'].map((cat) => (
            <Link
              key={cat}
              to="/products"
              className="flex-shrink-0 text-sm text-primary font-medium whitespace-nowrap"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Mobile drawer menu ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 max-w-full bg-white shadow-xl overflow-y-auto">
            <div className="px-4 py-4 border-b border-border-col">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                    {isLoggedIn ? userInitial : <User size={20} />}
                  </div>
                  <div>
                    {isLoggedIn ? (
                      <>
                        <p className="text-sm font-semibold text-text-primary">Hi, {userName.split(' ')[0]}</p>
                        <p className="text-xs text-text-muted">Welcome back</p>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-text-primary block">Sign in</Link>
                        <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-sm text-text-muted">Register</Link>
                      </>
                    )}
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-text-secondary">
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="px-4 py-4 space-y-2">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-text-secondary hover:bg-bg-light hover:text-primary">
                <Home size={18} /> Home
              </Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-text-secondary hover:bg-bg-light hover:text-primary">
                <List size={18} /> Categories
              </Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-text-secondary hover:bg-bg-light hover:text-primary">
                <Heart size={18} /> Favorites
              </Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-text-secondary hover:bg-bg-light hover:text-primary">
                <Package size={18} /> My orders
              </Link>

              <div className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-text-secondary">
                <Globe size={16} />
                <span>English | USD</span>
              </div>

              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-text-secondary hover:bg-bg-light hover:text-primary">
                <MessageSquare size={18} /> Contact us
              </Link>
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-text-secondary hover:bg-bg-light hover:text-primary">
                <FileText size={18} /> About
              </Link>
            </div>

            <div className="px-4 py-4 border-t border-border-col">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-danger hover:bg-red-50 w-full"
                >
                  <LogOut size={18} /> Logout
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center border border-primary text-primary text-sm font-semibold py-2 rounded-lg hover:bg-primary-light transition-colors"
                  >
                    Join now
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center bg-primary text-white text-sm font-semibold py-2 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            <div className="px-4 py-4 border-t border-border-col text-sm text-text-muted space-y-2">
              <Link to="/" onClick={() => setMobileOpen(false)} className="block hover:text-primary">User agreement</Link>
              <Link to="/" onClick={() => setMobileOpen(false)} className="block hover:text-primary">Partnership</Link>
              <Link to="/" onClick={() => setMobileOpen(false)} className="block hover:text-primary">Privacy policy</Link>
            </div>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </header>
  )
}
