import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FormInput from '../components/FormInput'
import SuccessModal from '../components/SuccessModal'
import { useCart } from '../context/CartContext'
import { formatPrice, validateEmail } from '../utils/helpers'

function SummaryContent({ items, subtotal, discount, tax, total }) {
  return (
    <>
      <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-bg-light rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="object-contain w-full h-full p-1"
                onError={(e) => { e.target.src = 'https://placehold.co/56x56/f7f7f7/999?text=Item' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
              <p className="text-xs text-text-muted">Qty: {item.qty}</p>
            </div>
            <p className="text-sm font-semibold text-text-primary whitespace-nowrap">
              {formatPrice(item.price * item.qty)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-border-col pt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">Subtotal</span>
          <span className="text-text-primary">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-danger">
          <span>Discount</span>
          <span>-{formatPrice(discount)}</span>
        </div>
        <div className="flex justify-between text-success">
          <span>Tax (7%)</span>
          <span>+{formatPrice(tax)}</span>
        </div>
        <div className="border-t border-border-col pt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  })
  const [errors, setErrors] = useState({})

  const discount = subtotal >= 100 ? 60 : 0
  const tax = Math.round(subtotal * 0.07 * 100) / 100
  const total = Math.max(subtotal - discount + tax, 0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d+$/.test(form.phone)) {
      newErrors.phone = 'Phone number must be numeric'
    }
    if (!form.address.trim()) newErrors.address = 'Address is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required'
    } else if (!/^\d+$/.test(form.zipCode)) {
      newErrors.zipCode = 'ZIP code must be numeric'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setIsSubmitting(true)
    await new Promise((res) => setTimeout(res, 800))
    setIsSubmitting(false)
    setShowSuccess(true)
  }

  const handleContinueShopping = () => {
    setShowSuccess(false)
    clearCart()
    navigate('/products')
  }

  const handleGoHome = () => {
    setShowSuccess(false)
    clearCart()
    navigate('/')
  }

  const summaryProps = useMemo(() => ({ items, subtotal, discount, tax, total }), [items, subtotal, discount, tax, total])

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Breadcrumb */}
        <nav className="text-xs sm:text-sm text-text-muted mb-4 sm:mb-6 flex flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-1 sm:mx-2">/</span>
          <Link to="/cart" className="hover:text-primary">Cart</Link>
          <span className="mx-1 sm:mx-2">/</span>
          <span className="text-text-primary">Checkout</span>
        </nav>

        <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6">Checkout</h1>

        {items.length === 0 && !showSuccess ? (
          <div className="bg-white rounded-lg border border-border-col p-6 sm:p-12 text-center">
            <p className="text-lg text-text-secondary mb-2">Your cart is empty</p>
            <p className="text-sm text-text-muted mb-6">Add some items before checking out.</p>
            <Link
              to="/products"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Mobile: collapsible order summary at top */}
            <div className="lg:hidden mb-4 bg-white rounded-lg border border-border-col overflow-hidden">
              <button
                type="button"
                onClick={() => setSummaryOpen(!summaryOpen)}
                className="w-full flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-text-primary">Order summary</span>
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-text-primary">{formatPrice(total)}</span>
                  {summaryOpen ? <ChevronUp size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted" />}
                </div>
              </button>
              {summaryOpen && (
                <div className="px-4 pb-4 border-t border-border-col pt-3">
                  <SummaryContent {...summaryProps} />
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Shipping form */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="bg-white rounded-lg border border-border-col p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-bold text-text-primary mb-4 sm:mb-5">Shipping details</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 sm:gap-x-4">
                    <FormInput
                      label="Full Name"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      error={errors.fullName}
                      placeholder="Muhammad"
                    />
                    <FormInput
                      label="Email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      error={errors.email}
                      placeholder="you@example.com"
                    />
                    <FormInput
                      label="Phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      placeholder="1234567890"
                    />
                    <FormInput
                      label="ZIP Code"
                      name="zipCode"
                      value={form.zipCode}
                      onChange={handleChange}
                      error={errors.zipCode}
                      placeholder="12345"
                    />
                  </div>

                  <FormInput
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    error={errors.address}
                    placeholder="Street address, apartment, suite, etc."
                  />

                  <FormInput
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    error={errors.city}
                    placeholder="New York"
                  />

                  {/* Mobile: Place Order button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="lg:hidden w-full mt-2 bg-success hover:bg-[#009a14] text-white py-3.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        Place Order — {formatPrice(total)}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Desktop: order summary sidebar */}
              <div className="hidden lg:block lg:col-span-1 order-2">
                <div className="bg-white rounded-lg border border-border-col p-5 lg:sticky lg:top-24">
                  <h2 className="text-base sm:text-lg font-bold text-text-primary mb-4">Order summary</h2>
                  <SummaryContent {...summaryProps} />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-5 bg-success hover:bg-[#009a14] text-white py-3.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
      <Footer />

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleGoHome}
        onContinueShopping={handleContinueShopping}
        onGoHome={handleGoHome}
      />
    </div>
  )
}
