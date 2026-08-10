import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../features/cart/CartContext'

export default function OrderSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const orderId = location.state?.orderId

  useEffect(() => {
    clearCart()
    if (!orderId) {
      navigate('/products', { replace: true })
    }
  }, [orderId, clearCart, navigate])

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="bg-white rounded-2xl border border-border-col shadow-sm p-8 sm:p-12">
          <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-success/10 flex items-center justify-center animate-bounceIn">
            <CheckCircle size={48} className="text-success" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
            Order placed successfully!
          </h1>
          <p className="text-text-secondary mb-2">
            Thank you for shopping with{' '}
            <span className="font-semibold text-primary">Cartiqo</span>.
          </p>

          {orderId && (
            <p className="text-sm text-text-muted mb-8">
              Order ID: <span className="font-mono text-text-secondary">{orderId}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/products"
              className="flex-1 border border-border-col text-text-primary py-3 rounded-lg text-sm font-semibold hover:bg-bg-light transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="flex-1 bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
