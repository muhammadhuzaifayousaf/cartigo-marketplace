import { useState, useEffect } from 'react'
import { Mail, BadgeCheck, Store, Star, Loader2, Calendar, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchSellerProducts, fetchMyProfile, updateMyProfile } from '../../services/api'
import AvatarUpload from '../../components/AvatarUpload'
import StarRating from '../../components/StarRating'
import ChangePassword from '../../components/ChangePassword'
import { useToast } from '../../context/ToastContext'

/**
 * SellerProfile — seller account details. Only the avatar, phone and
 * description are editable; name, email, role, business category, join date
 * and the store's aggregate rating stay read-only.
 */
export default function SellerProfile() {
  const { user, updateUser } = useAuth()
  const showToast = useToast()

  const [rating, setRating] = useState(null)
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [phone, setPhone] = useState('')
  const [description, setDescription] = useState('')
  const [joinedDate, setJoinedDate] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSellerProducts()
      .then((products) => {
        const totalReviews = products.reduce((sum, p) => sum + (p.totalReviews || 0), 0)
        const weighted = products.reduce(
          (sum, p) => sum + (p.averageRating || 0) * (p.totalReviews || 0),
          0
        )
        setRating({
          totalReviews,
          averageRating:
            totalReviews > 0 ? Math.round((weighted / totalReviews) * 100) / 100 : 0,
        })
      })
      .catch(() => setRating({ totalReviews: 0, averageRating: 0 }))
  }, [])

  useEffect(() => {
    let mounted = true
    fetchMyProfile()
      .then((data) => {
        if (!mounted) return
        setAvatar(data.avatar || '')
        setPhone(data.phone || '')
        setDescription(data.description || '')
        setBusinessCategory(data.businessCategory || '')
        setLocation(data.location || '')
        setJoinedDate(data.createdAt || '')
      })
      .catch(() => {
        if (!mounted) return
        showToast('Failed to load profile', { type: 'error', duration: 4000 })
      })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  const handleAvatarUploaded = (avatarUrl) => {
    setAvatar(avatarUrl)
    updateUser({ avatar: avatarUrl })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await updateMyProfile({
        phone: phone.trim(),
        description: description.trim(),
      })
      updateUser({ name: updated.name, phone: updated.phone, description: updated.description })
      showToast('Profile updated successfully')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', { type: 'error', duration: 4000 })
    } finally {
      setSaving(false)
    }
  }

  const rows = [
    { label: 'Store name', value: user?.name, icon: Store },
    { label: 'Email', value: user?.email, icon: Mail },
    { label: 'Role', value: 'Seller', icon: Store },
    { label: 'Business category', value: businessCategory || 'General', icon: Store },
    { label: 'Location', value: location || '—', icon: MapPin },
    {
      label: 'Joined',
      value: joinedDate
        ? new Date(joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : '—',
      icon: Calendar,
    },
    { label: 'Account status', value: 'Active', icon: BadgeCheck },
  ]

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-sm text-text-muted mt-1">
          Manage your store profile. Only the photo, phone and description are editable.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-text-muted">
          <Loader2 size={30} className="animate-spin text-primary mb-3" />
          <p className="text-sm">Loading profile...</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Read-only account card */}
          <div className="bg-white rounded-lg border border-border-col p-5 sm:p-6">
            <div className="flex items-center gap-4 mb-6">
              <AvatarUpload
                name={user?.name}
                avatar={avatar}
                onUploaded={handleAvatarUploaded}
              />
              <div className="min-w-0">
                <p className="font-semibold text-text-primary">{user?.name}</p>
                <p className="text-sm text-text-muted truncate">{user?.email}</p>
              </div>
            </div>

            <dl className="divide-y divide-border-col">
              {rows.map(({ label, value, icon: Icon }) => (
                <div key={label} className="py-3 flex items-center gap-3">
                  <Icon size={18} className="text-text-muted flex-shrink-0" />
                  <dt className="text-sm text-text-secondary w-40">{label}</dt>
                  <dd className="text-sm font-medium text-text-primary flex-1 min-w-0 truncate">{value}</dd>
                </div>
              ))}
              <div className="py-3 flex items-center gap-3">
                <Star size={18} className="text-text-muted flex-shrink-0" />
                <dt className="text-sm text-text-secondary w-40">Rating</dt>
                <dd className="text-sm font-medium text-text-primary flex-1 flex items-center gap-2 flex-wrap">
                  {rating === null ? (
                    <span className="text-text-muted">Loading…</span>
                  ) : rating.totalReviews > 0 ? (
                    <>
                      <StarRating rating={rating.averageRating} maxRating={5} />
                      <span>
                        {rating.averageRating.toFixed(1)} ({rating.totalReviews}{' '}
                        {rating.totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </>
                  ) : (
                    <span className="text-text-muted">No reviews yet</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Editable fields */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-border-col p-5 sm:p-6">
            <h2 className="font-semibold text-text-primary mb-4">Store contact & description</h2>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-1.5">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 000 1234"
                className="w-full px-4 py-2.5 text-sm border border-border-col rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1.5">
                Store description
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Describe your store, what you sell and why customers should buy from you..."
                className="w-full px-4 py-2.5 text-sm border border-border-col rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
              />
              <p className="text-xs text-text-muted mt-1 text-right">{description.length}/500</p>
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
    </div>
  )
}
