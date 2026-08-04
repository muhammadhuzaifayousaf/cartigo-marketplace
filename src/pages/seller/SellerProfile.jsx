import { useState, useEffect } from 'react'
import { Mail, User, BadgeCheck, Store, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchSellerProducts } from '../../services/api'
import StarRating from '../../components/StarRating'

/**
 * SellerProfile — read-only profile card with the seller's overall
 * store rating (aggregated across their products' reviews).
 */
export default function SellerProfile() {
  const { user } = useAuth()
  const [rating, setRating] = useState(null)

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

  const rows = [
    { label: 'Full name', value: user?.name, icon: User },
    { label: 'Email', value: user?.email, icon: Mail },
    { label: 'Role', value: 'Seller', icon: Store },
    { label: 'Account status', value: 'Active', icon: BadgeCheck },
  ]

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-sm text-text-muted mt-1">Your seller account details.</p>
      </div>

      <div className="bg-white rounded-lg border border-border-col p-5 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
            {(user?.name || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-text-primary">{user?.name}</p>
            <p className="text-sm text-text-muted">{user?.email}</p>
          </div>
        </div>

        <dl className="divide-y divide-border-col">
          {rows.map(({ label, value, icon: Icon }) => (
            <div key={label} className="py-3 flex items-center gap-3">
              <Icon size={18} className="text-text-muted" />
              <dt className="text-sm text-text-secondary w-36">{label}</dt>
              <dd className="text-sm font-medium text-text-primary flex-1">{value}</dd>
            </div>
          ))}
          <div className="py-3 flex items-center gap-3">
            <Star size={18} className="text-text-muted" />
            <dt className="text-sm text-text-secondary w-36">Rating</dt>
            <dd className="text-sm font-medium text-text-primary flex-1 flex items-center gap-2">
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
    </div>
  )
}
