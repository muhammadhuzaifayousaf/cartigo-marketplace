import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loader2, AlertCircle, RefreshCw, MapPin, Calendar, MessageSquare, Store, Shield, Package, Pencil } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Avatar from '../components/Avatar'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'
import { fetchPublicProfile, fetchSellerPublicProducts } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { PRODUCT_CATEGORIES } from '../data/categories'

const formatJoined = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/**
 * PublicProfile — a public, read-only profile card for both customers
 * (reached from reviews and orders) and sellers (reached from the product
 * supplier card). The route is public — no login required.
 */
export default function PublicProfile() {
  const { id } = useParams()
  const { user, isLoggedIn, isSeller } = useAuth()
  const [profile, setProfile] = useState(null)
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setProfile(await fetchPublicProfile(id))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  // Seller/admin profiles also list their approved products.
  useEffect(() => {
    if (!profile || (profile.role !== 'seller' && profile.role !== 'admin')) {
      setProducts([])
      return
    }
    let mounted = true
    setProductsLoading(true)
    fetchSellerPublicProducts(id)
      .then((data) => mounted && setProducts(data))
      .catch(() => mounted && setProducts([]))
      .finally(() => mounted && setProductsLoading(false))
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, profile?.role])

  const isOwn = isLoggedIn && user?._id === id

  const visibleProducts = categoryFilter
    ? products.filter((p) => p.category === categoryFilter)
    : products

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar />
      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Loader2 size={36} className="animate-spin text-primary mb-3" />
            <p className="text-sm">Loading profile...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-white rounded-lg border border-border-col p-12 text-center">
            <AlertCircle size={36} className="mx-auto mb-3 text-danger" />
            <p className="text-lg font-medium text-text-primary mb-1">Unable to load profile</p>
            <p className="text-sm text-text-muted mb-4">{error}</p>
            <button onClick={load} className="btn-primary inline-flex items-center gap-2">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {profile && !loading && (
          <>
            <div className="bg-white rounded-lg border border-border-col p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex-shrink-0">
                  <Avatar name={profile.name} avatar={profile.avatar} size={96} />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-text-primary leading-tight truncate">
                    {profile.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm">
                    <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                      {profile.role === 'seller' || profile.role === 'admin' ? (
                        <>
                          <Store size={14} /> Seller
                          <Shield size={13} className="text-success" />
                        </>
                      ) : (
                        <>
                          <MessageSquare size={14} /> Customer
                        </>
                      )}
                    </span>
                    {profile.location && (
                      <span className="inline-flex items-center gap-1 text-text-secondary">
                        <MapPin size={13} className="text-text-muted" />
                        {profile.location}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-text-muted">
                      <Calendar size={13} />
                      Joined {formatJoined(profile.joinedDate)}
                    </span>
                  </div>
                </div>
              </div>
              {isOwn && (
                <Link
                  to={isSeller ? '/seller/profile' : '/profile'}
                  className="inline-flex items-center gap-1.5 text-primary border border-primary hover:bg-primary-light text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                >
                  <Pencil size={13} /> Edit profile
                </Link>
              )}
            </div>

              {/* Stats row */}
              {profile.role === 'seller' || profile.role === 'admin' ? (
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="border border-border-col rounded-lg p-3.5 text-center">
                    <StarRating rating={profile.rating?.averageRating || 0} maxRating={5} />
                    <p className="text-xs text-text-muted mt-1.5">
                      {profile.rating?.averageRating
                        ? `${profile.rating.averageRating.toFixed(1)} · ${profile.rating.totalReviews} review${profile.rating.totalReviews === 1 ? '' : 's'}`
                        : 'No reviews yet'}
                    </p>
                  </div>
                  <div className="border border-border-col rounded-lg p-3.5 text-center">
                    <Package size={18} className="mx-auto text-primary" />
                    <p className="font-bold text-text-primary mt-1">
                      {profile.productCount ?? 0} <span className="font-medium text-text-muted text-xs">products</span>
                    </p>
                  </div>
                  <div className="border border-border-col rounded-lg p-3.5 text-center">
                    <Store size={18} className="mx-auto text-primary" />
                    <p className="font-bold text-text-primary mt-1 text-sm leading-tight">
                      {profile.businessCategory || 'General'}
                    </p>
                    <p className="text-xs text-text-muted mt-1">Category</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-6 max-w-sm">
                  <div className="border border-border-col rounded-lg p-3.5 text-center">
                    <MessageSquare size={18} className="mx-auto text-primary" />
                    <p className="font-bold text-text-primary mt-1">
                      {profile.reviewCount ?? 0} <span className="font-medium text-text-muted text-xs">reviews</span>
                    </p>
                  </div>
                  {profile.gender && (
                    <div className="border border-border-col rounded-lg p-3.5 text-center">
                      <p className="font-bold text-text-primary mt-1 text-sm leading-tight">{profile.gender}</p>
                      <p className="text-xs text-text-muted mt-1">Gender</p>
                    </div>
                  )}
                </div>
              )}

              {/* Bio/description */}
              {(profile.description || profile.about) && (
                <div className="mt-6">
                  <h2 className="font-semibold text-text-primary mb-2">
                    {profile.role === 'seller' || profile.role === 'admin' ? 'About the store' : 'About'}
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {profile.description || profile.about}
                  </p>
                </div>
              )}
            </div>

            {/* Seller's approved products */}
            {(profile.role === 'seller' || profile.role === 'admin') && (
              <div className="bg-white rounded-lg border border-border-col p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h2 className="font-semibold text-text-primary">Products by {profile.name}</h2>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-border-col rounded-lg bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-primary"
                  >
                    <option value="">All Categories</option>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {productsLoading ? (
                  <div className="flex items-center justify-center py-12 text-text-muted">
                    <Loader2 size={30} className="animate-spin text-primary" />
                  </div>
                ) : visibleProducts.length === 0 ? (
                  <p className="text-sm text-text-muted py-6 text-center">
                    {categoryFilter
                      ? `No products in "${categoryFilter}" yet.`
                      : 'No products available yet.'}
                  </p>
                ) : (
                  <>
                    {categoryFilter && (
                      <p className="text-xs text-text-muted mb-3">
                        {visibleProducts.length} product{visibleProducts.length !== 1 && 's'} in {categoryFilter}
                      </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {visibleProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
