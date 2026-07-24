import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-primary rounded-lg p-2">
            <ShoppingBag size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-primary">Brand</span>
        </Link>

        {/* Glassmorphism card */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8">
          {title && (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
              {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-text-muted mt-6">
          By continuing, you agree to Brand's{' '}
          <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>{' '}
          and{' '}
          <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}
