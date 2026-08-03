import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn, AlertCircle } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { validateEmail } from '../utils/helpers'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const notify = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [rememberMe, setRememberMe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const redirectTo = location.state?.from
  const loginPrompt = redirectTo === '/checkout' ? 'Please login before checkout.' : 'Please login to continue.'

  useEffect(() => {
    if (location.state?.showToast) {
      setShowToast(true)
      const timer = setTimeout(() => setShowToast(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [location.state])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
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
      const data = await login(form.email, form.password)
      notify('Login Successful')
      if (location.state?.from) {
        navigate(location.state.from)
      } else if (data.role === 'seller' || data.role === 'admin') {
        navigate('/seller')
      } else {
        navigate('/')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password'
      setErrors({ email: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {showToast && (
        <div className="fixed top-4 right-4 z-[100] animate-fadeIn">
          <div className="flex items-center gap-3 bg-warning/10 border border-warning/30 text-warning px-4 py-3 rounded-lg shadow-lg">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{loginPrompt}</span>
          </div>
        </div>
      )}

      <AuthLayout title="Sign in" subtitle="Welcome back! Please enter your details.">
      <form onSubmit={handleSubmit} noValidate>
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
          placeholder="Enter your password"
        />

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-border-col text-primary focus:ring-primary accent-primary"
            />
            <span className="text-sm text-text-secondary">Remember me</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LogIn size={18} />
              Sign in
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
    </>
  )
}
