import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, PlusCircle, ClipboardList, User,
  LogOut, ArrowLeft, Store, BadgeCheck, Menu, X, Home,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { img } from '../utils/helpers'
import Avatar from './Avatar'

const BASE_NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/seller', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/seller/products', label: 'Products', icon: Package, end: false },
  { to: '/seller/products/add', label: 'Add Product', icon: PlusCircle, end: false },
  { to: '/seller/orders', label: 'Orders', icon: ClipboardList, end: false },
  { to: '/seller/profile', label: 'Profile', icon: User, end: false },
]

function SidebarContent({ onNavigate, navItems }) {
  return (
    <nav className="space-y-1 p-3">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-light text-primary'
                : 'text-text-secondary hover:bg-bg-light hover:text-primary'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

/**
 * SellerLayout — shared shell for all seller pages.
 * Renders a top bar, a desktop sidebar, a mobile scrollable nav,
 * and the nested page via <Outlet />.
 */
export default function SellerLayout() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setProfileMenuOpen(false)
    setMobileOpen(false)
    navigate('/')
  }

  const userName = user?.name || 'Seller'

  const navItems = isAdmin
    ? [
        BASE_NAV_ITEMS[0],
        ...BASE_NAV_ITEMS.slice(1, 5),
        { to: '/seller/approvals', label: 'Approvals', icon: BadgeCheck, end: false },
        BASE_NAV_ITEMS[5],
      ]
    : BASE_NAV_ITEMS

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Top bar */}
      <header className="bg-white border-b border-border-col sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden text-text-secondary"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src={img('logo.png')} alt="Cartiqo" className="h-10" />
            </Link>
            <span className="inline-flex items-center gap-1.5 bg-primary-light text-primary text-xs font-bold px-2.5 py-1 rounded-full">
              <Store size={13} /> Seller Center
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} /> Back to shop
            </Link>
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity"
                aria-label="Profile menu"
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
              >
                <Avatar name={userName} avatar={user?.avatar} size={32} />
                <span className="hidden sm:block text-sm font-medium text-text-primary truncate max-w-[140px]">
                  Hi, {userName.split(' ')[0]}
                </span>
              </button>

              {profileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setProfileMenuOpen(false)}
                  />
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-3 z-50 w-56 bg-white rounded-xl border border-border-col shadow-card"
                  >
                    <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white border-t border-l border-border-col rotate-45" />
                    <div className="p-4 border-b border-border-col flex items-center gap-3">
                      <Avatar name={userName} avatar={user?.avatar} size={40} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{userName}</p>
                        <p className="text-xs text-text-muted truncate">
                          {user?.email || 'Welcome back'}
                        </p>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/seller/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-light hover:text-primary transition-colors"
                      >
                        <User size={16} /> Go to my profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        role="menuitem"
                        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm text-danger hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`md:hidden fixed inset-0 z-50 flex ${
            mobileOpen ? '' : 'pointer-events-none'
          }`}
        >
          <div
            className={`w-72 max-w-full bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out ${
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="px-4 py-4 border-b border-border-col flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={userName} avatar={user?.avatar} size={44} variant="soft" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">Hi, {userName.split(' ')[0]}</p>
                  <p className="text-xs text-text-muted">Seller Center</p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-text-secondary"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <SidebarContent navItems={navItems} onNavigate={() => setMobileOpen(false)} />

            <div className="px-4 py-4 border-t border-border-col">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-danger hover:bg-red-50 w-full"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
          <div
            className={`flex-1 bg-black/40 transition-opacity duration-300 ${
              mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setMobileOpen(false)}
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0 border-r border-border-col sticky top-16 h-[calc(100vh-4rem)]">
          <SidebarContent navItems={navItems} />
        </aside>

        {/* Page content */}
        <main className="flex-1 min-w-0 p-3 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
