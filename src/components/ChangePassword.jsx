import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import FormInput from './FormInput'
import { changePassword } from '../services/api'
import { useToast } from '../context/ToastContext'

const INITIAL_FORM = { currentPassword: '', newPassword: '', confirmPassword: '' }

/**
 * ChangePassword — a reusable card (same design system as the profile forms)
 * shown on customer and seller profiles. Three password fields with show/hide
 * toggles, inline validation with red borders, and a loading state. On success
 * the form is cleared and a success toast is shown; backend errors (e.g. wrong
 * current password) surface through the existing error toast.
 */
export default function ChangePassword() {
  const showToast = useToast()
  const [form, setForm] = useState(INITIAL_FORM)
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
    if (!form.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    if (!form.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    } else if (form.newPassword === form.currentPassword) {
      newErrors.newPassword = 'New password cannot be the same as current password'
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (form.confirmPassword !== form.newPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await changePassword(form.currentPassword, form.newPassword, form.confirmPassword)
      showToast('Password changed successfully.')
      setForm(INITIAL_FORM)
      setErrors({})
    } catch (err) {
      showToast(err.response?.data?.message || 'Network error. Please try again.', {
        type: 'error',
        duration: 4000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-lg border border-border-col p-5 sm:p-6"
    >
      <h2 className="font-semibold text-text-primary mb-4">Change password</h2>

      <FormInput
        label="Current password"
        type="password"
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
        error={errors.currentPassword}
        placeholder="Enter your current password"
      />
      <FormInput
        label="New password"
        type="password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        error={errors.newPassword}
        placeholder="Enter your new password"
      />
      <FormInput
        label="Confirm new password"
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder="Re-enter your new password"
      />

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          Update password
        </button>
      </div>
    </form>
  )
}
