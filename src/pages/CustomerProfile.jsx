import { useState, useEffect } from 'react'
import { Loader2, Mail, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FormInput from '../components/FormInput'
import AvatarUpload from '../components/AvatarUpload'
import ChangePassword from '../components/ChangePassword'
import { fetchMyProfile, updateMyProfile } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

/**
 * CustomerProfile — the customer's own editable profile: Cloudinary avatar,
 * name, phone, DOB, gender, location and a short bio. Email and role are
 * read-only. Saved fields propagate to the navbar via AuthContext.
 */
export default function CustomerProfile() {
  const { user, updateUser } = useAuth()
  const showToast = useToast()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    location: '',
    about: '',
  })
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    fetchMyProfile()
      .then((data) => {
        if (!mounted) return
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          dob: data.dob || '',
          gender: data.gender || '',
          location: data.location || '',
          about: data.about || '',
        })
        setAvatar(data.avatar || '')
      })
      .catch(() => {
        if (!mounted) return
        showToast('Failed to load profile', { type: 'error', duration: 4000 })
      })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarUploaded = (avatarUrl) => {
    setAvatar(avatarUrl)
    updateUser({ avatar: avatarUrl })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      showToast('Name cannot be empty', { type: 'error', duration: 3000 })
      return
    }
    setSaving(true)
    try {
      const updated = await updateMyProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        dob: form.dob.trim(),
        gender: form.gender.trim(),
        location: form.location.trim(),
        about: form.about.trim(),
      })
      updateUser({ name: updated.name })
      showToast('Profile updated successfully')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', { type: 'error', duration: 4000 })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />
      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-1">My Profile</h1>
        <p className="text-sm text-text-muted mb-6">Manage your personal details and profile photo.</p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Loader2 size={36} className="animate-spin text-primary mb-3" />
            <p className="text-sm">Loading profile...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Avatar card */}
            <div className="bg-white rounded-lg border border-border-col p-5 sm:p-6">
              <h2 className="font-semibold text-text-primary mb-4">Profile photo</h2>
              <AvatarUpload name={form.name || user?.name} avatar={avatar} onUploaded={handleAvatarUploaded} />
            </div>

            {/* Details form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-border-col p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-text-primary">Personal details</h2>
                <span className="text-xs text-text-muted">Email and role are read-only</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <FormInput
                  label="Full name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
                <FormInput
                  label="Phone number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 555 000 1234"
                />
                <FormInput
                  label="Date of birth"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD"
                />
                <div className="mb-4">
                  <label htmlFor="gender" className="block text-sm font-medium text-text-primary mb-1.5">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm border border-border-col rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <FormInput
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
                <div className="mb-4">
                  <label htmlFor="about" className="block text-sm font-medium text-text-primary mb-1.5">
                    About me
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                    rows={3}
                    maxLength={300}
                    placeholder="Tell shoppers a little about yourself (optional)"
                    className="w-full px-4 py-2.5 text-sm border border-border-col rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              {/* Read-only account info */}
              <div className="border-t border-border-col pt-4 mt-1 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-text-secondary">
                  <Mail size={15} className="text-text-muted" />
                  {user?.email}
                </p>
                <p className="flex items-center gap-2 text-text-secondary">
                  <Shield size={15} className="text-text-muted" />
                  Account type: <span className="font-medium text-text-primary">Customer</span>
                </p>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  Save changes
                </button>
              </div>
            </form>

            <ChangePassword />
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
