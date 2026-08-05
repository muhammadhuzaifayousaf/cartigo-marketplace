import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, ShoppingBag, Store } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { validateEmail } from '../utils/helpers'
import { BUSINESS_CATEGORIES } from '../data/categories'

const ACCOUNT_TYPES = [
  { value: 'user', label: 'Customer', description: 'Browse, buy and track orders', icon: ShoppingBag },
  { value: 'seller', label: 'Seller', description: 'Sell products and manage orders', icon: Store },
]

export default function SignupPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const showToast = useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    businessCategory: '',
  })
  const [role, setRole] = useState('user')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) {
      newErrors.name = 'Full name is required'
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (role === 'seller') {
      if (!form.location.trim()) {
        newErrors.location = 'Location is required'
      }
      if (!form.businessCategory) {
        newErrors.businessCategory = 'Please choose a business category'
      }
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
    try {
      await register(
        form.name,
        form.email,
        form.password,
        role,
        role === 'seller'
          ? { location: form.location.trim(), businessCategory: form.businessCategory }
          : {}
      )
      showToast('Registration Successful')
      navigate('/login')
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      setErrors({ email: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create an account" subtitle="Enter your details below.">
      <form onSubmit={handleSubmit} noValidate>
        {/* Account type selector */}
        <div className="mb-5">
          <span className="block text-sm font-medium text-text-primary mb-1.5">Account type</span>
          <div className="grid grid-cols-2 gap-2">
            {ACCOUNT_TYPES.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setRole(value)
                  if (value === 'user') {
                    setErrors((prev) => {
                      const { location, businessCategory, ...rest } = prev
                      return rest
                    })
                  }
                }}
                aria-pressed={role === value}
                className={`border rounded-lg p-3 text-left transition-all duration-200 ${
                  role === value
                    ? 'border-primary bg-primary-light/50 ring-2 ring-primary/20'
                    : 'border-border-col hover:border-primary/50'
                }`}
              >
                <Icon size={18} className={role === value ? 'text-primary' : 'text-text-muted'} />
                <p className={`text-sm font-semibold mt-1 ${role === value ? 'text-primary' : 'text-text-primary'}`}>
                  {label}
                </p>
                <p className="text-xs text-text-muted leading-snug mt-0.5">{description}</p>
              </button>
            ))}
          </div>
        </div>

        <FormInput
          label="Full Name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
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
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Min 8 characters"
        />

        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
        />

        {role === 'seller' && (
          <>
            <FormInput
              label="Location"
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="City or country"
            />

            <div className="mb-4">
              <label htmlFor="businessCategory" className="block text-sm font-medium text-text-primary mb-1.5">
                Business Category
              </label>
              <select
                id="businessCategory"
                name="businessCategory"
                value={form.businessCategory}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-all duration-200 bg-white ${
                  errors.businessCategory
                    ? 'border-danger focus:ring-2 focus:ring-danger/30'
                    : 'border-border-col focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
              >
                <option value="">Select a category</option>
                {BUSINESS_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.businessCategory && (
                <p className="mt-1 text-xs text-danger animate-fadeIn">{errors.businessCategory}</p>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <UserPlus size={18} />
              Create Account
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
