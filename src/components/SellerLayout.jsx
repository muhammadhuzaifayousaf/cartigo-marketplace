import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, PlusCircle, ClipboardList, User,
  LogOut, ArrowLeft, Store,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { img } from '../utils/helpers'

const NAV_ITEMS = [
  { to: '/seller', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/seller/products', label: 'Products', icon: Package, end: false },
  { to: '/seller/products/add', label: 'Add Product', icon: PlusCircle, end: false },
  { to: '/seller/orders', label: 'Orders', icon: ClipboardList, end: false },
  { to: '/seller/profile', label: 'Profile', icon: User, end: false },
]

function SidebarContent({ onNavigate }) {
  return (
    <nav className="space-y-1 p-3">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
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
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const userName = user?.name || 'Seller'

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Top bar */}
      <header className="bg-white border-b border-border-col sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src={img('logo.png')} alt="Cartiqo" className="h-10" />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-primary-light text-primary text-xs font-bold px-2.5 py-1 rounded-full">
              <Store size={13} /> Seller Center
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} /> Back to store
            </Link>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-text-primary truncate max-w-[140px]">
              Hi, {userName.split(' ')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-danger transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile horizontal nav */}
        <div className="md:hidden border-t border-border-col overflow-x-auto scrollbar-hide">
          <div className="flex px-2 py-2 gap-1 min-w-max">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                    isActive ? 'bg-primary-light text-primary font-semibold' : 'text-text-secondary'
                  }`
                }
              >
                <Icon size={15} /> {label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0 border-r border-border-col sticky top-16 h-[calc(100vh-4rem)]">
          <SidebarContent />
        </aside>

        {/* Page content */}
        <main className="flex-1 min-w-0 p-3 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
