import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Pencil, Trash2, Star, X, Check } from 'lucide-react'
import StarRating from './StarRating'
import StarRatingInput from './StarRatingInput'
import {
  fetchProductReviews,
  fetchMyReview,
  createReview,
  updateReview,
  deleteReview,
} from '../services/reviewApi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * ReviewsSection — the full reviews experience for a product:
 * rating summary + distribution, a write/edit form (only for users who
 * purchased & received the product), and the newest-first review list.
 */
export default function ReviewsSection({
  productId,
  productName,
  fallbackRating = 0,
  fallbackCount = 0,
  onSummaryChange,
}) {
  const { isLoggedIn, isSeller } = useAuth()
  const showToast = useToast()

  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myInfo, setMyInfo] = useState(null)

  const [editing, setEditing] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const loadSummary = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchProductReviews(productId)
      setSummary(data)
      onSummaryChange?.(data)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load reviews', {
        type: 'error',
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    loadSummary()
    if (isLoggedIn) {
      fetchMyReview(productId)
        .then((data) => {
          setMyInfo(data)
          if (data.review) {
            setRating(data.review.rating)
            setTitle(data.review.title || '')
            setComment(data.review.comment)
          }
        })
        .catch(() => setMyInfo({ eligible: false, review: null }))
    } else {
      setMyInfo(null)
    }
  }, [productId, isLoggedIn, loadSummary])

  const canWrite = isLoggedIn && !isSeller && myInfo?.eligible
  const myReview = myInfo?.review

  const refreshAfterMutation = async () => {
    const [freshSummary, freshMyInfo] = await Promise.all([
      fetchProductReviews(productId),
      fetchMyReview(productId),
    ])
    setSummary(freshSummary)
    setMyInfo(freshMyInfo)
    onSummaryChange?.(freshSummary)
    if (freshMyInfo.review) {
      setRating(freshMyInfo.review.rating)
      setTitle(freshMyInfo.review.title || '')
      setComment(freshMyInfo.review.comment)
    }
  }

  const startEdit = () => {
    if (!myReview) return
    setEditing(true)
    setRating(myReview.rating)
    setTitle(myReview.title || '')
    setComment(myReview.comment)
  }

  const cancelEdit = () => {
    setEditing(false)
    setRating(myReview ? myReview.rating : 0)
    setTitle(myReview ? myReview.title : '')
    setComment(myReview ? myReview.comment : '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating < 1) {
      showToast('Please select a star rating', { type: 'error', duration: 3000 })
      return
    }
    if (comment.trim().length < 10) {
      showToast('Comment must be at least 10 characters', { type: 'error', duration: 3000 })
      return
    }
    setSubmitting(true)
    try {
      if (editing && myReview) {
        await updateReview(myReview._id, { rating, title, comment })
        showToast('Review updated successfully')
      } else {
        await createReview({ productId, rating, title, comment })
        showToast('Review submitted successfully')
      }
      await refreshAfterMutation()
      setEditing(false)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save review', {
        type: 'error',
        duration: 4000,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeletingId(pendingDelete._id)
    try {
      await deleteReview(pendingDelete._id)
      await refreshAfterMutation()
      setPendingDelete(null)
      setEditing(false)
      showToast('Review deleted successfully')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete review', {
        type: 'error',
        duration: 4000,
      })
    } finally {
      setDeletingId(null)
    }
  }

  const avgRating = summary ? summary.averageRating : fallbackRating
  const totalReviews = summary ? summary.totalReviews : fallbackCount

  return (
    <div className="space-y-5">
      {loading && !summary ? (
        <div className="flex flex-col items-center justify-center py-10 text-text-muted">
          <Loader2 size={28} className="animate-spin text-primary mb-2" />
          <p className="text-sm">Loading reviews...</p>
        </div>
      ) : (
        <>
          {/* ── Rating summary ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-4xl font-bold text-text-primary">
                  {totalReviews > 0 ? avgRating.toFixed(1) : '—'}
                </span>
                <div>
                  <StarRating rating={avgRating} maxRating={5} size="md" />
                  <p className="text-xs text-text-muted mt-0.5">
                    {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary?.distribution?.[star] || 0
                const pct =
                  (summary?.totalReviews || 0) > 0
                    ? Math.round((count / summary.totalReviews) * 100)
                    : 0
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-3 text-text-muted">{star}</span>
                    <Star size={12} className="star-filled flex-shrink-0" />
                    <div className="flex-1 h-2 bg-bg-light rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 text-right text-xs text-text-muted">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Write / manage your review ── */}
          {!isLoggedIn ? (
            <div className="bg-bg-light rounded-lg border border-border-col p-5 text-center">
              <Star size={24} className="mx-auto mb-2 text-primary" />
              <p className="text-sm text-text-secondary mb-3">
                Have you bought {productName}? Share your experience.
              </p>
              <Link
                to="/login"
                className="inline-block bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                Login to write a review
              </Link>
            </div>
          ) : !isSeller && !canWrite && !myReview ? (
            <div className="bg-bg-light rounded-lg border border-border-col p-5 text-center">
              <Star size={24} className="mx-auto mb-2 text-text-muted" />
              <p className="text-sm text-text-secondary">
                You can review this product after delivery.
              </p>
              <p className="text-xs text-text-muted mt-1">
                Once your order for this product is delivered, you'll be able to rate and review it here.
              </p>
            </div>
          ) : myReview && !editing ? (
            <div className="border border-border-col rounded-lg p-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-sm font-semibold text-text-primary">Your review</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={startEdit}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:bg-primary-light rounded-lg px-2.5 py-1.5 transition-colors"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setPendingDelete(myReview)}
                    className="inline-flex items-center gap-1.5 text-sm text-danger hover:bg-red-50 rounded-lg px-2.5 py-1.5 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={myReview.rating} maxRating={5} />
                <span className="text-xs text-text-muted">{formatDate(myReview.createdAt)}</span>
              </div>
              {myReview.title && (
                <p className="text-sm font-semibold text-text-primary mt-2">{myReview.title}</p>
              )}
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">{myReview.comment}</p>
            </div>
          ) : (
            (canWrite || myReview) && (
              <form
                onSubmit={handleSubmit}
                className="border border-border-col rounded-lg p-4 bg-bg-light/50"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                  <p className="text-sm font-semibold text-text-primary">
                    {editing ? 'Edit your review' : 'Write a review'}
                  </p>
                  {editing && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-xs text-text-muted hover:text-text-secondary inline-flex items-center gap-1"
                    >
                      <X size={13} /> Cancel
                    </button>
                  )}
                </div>

                <div className="mb-3">
                  <StarRatingInput value={rating} onChange={setRating} size="lg" />
                </div>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Review title (optional)"
                  maxLength={120}
                  className="w-full border border-border-col rounded px-3 py-2 text-sm outline-none focus:border-primary mb-3"
                />

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product (at least 10 characters)..."
                  rows={4}
                  maxLength={1000}
                  className="w-full border border-border-col rounded px-3 py-2 text-sm outline-none focus:border-primary mb-2 resize-y"
                />
                <p className="text-xs text-text-muted mb-3 text-right">
                  {comment.length}/1000
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
                >
                  {submitting && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  <Check size={14} />
                  {editing ? 'Update review' : 'Submit review'}
                </button>
              </form>
            )
          )}

          {/* ── Reviews list ── */}
          <div>
            <h3 className="font-semibold text-text-primary text-sm mb-3">Customer reviews</h3>
            {summary?.reviews?.length === 0 ? (
              <p className="text-sm text-text-muted py-6 text-center border border-dashed border-border-col rounded-lg">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              <ul className="space-y-3">
                {summary?.reviews?.map((r) => (
                  <li key={r._id} className="border border-border-col rounded-lg p-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {(r.user?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {r.user?.name || 'Customer'}
                          </p>
                          <p className="text-xs text-text-muted">{formatDate(r.createdAt)}</p>
                        </div>
                      </div>
                      <StarRating rating={r.rating} maxRating={5} />
                    </div>
                    {r.title && (
                      <p className="text-sm font-semibold text-text-primary mt-3">{r.title}</p>
                    )}
                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">{r.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* ── Delete confirmation ── */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPendingDelete(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-text-primary">Delete review?</h3>
              <button onClick={() => setPendingDelete(null)} className="text-text-muted hover:text-text-secondary">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-text-secondary mb-5">
              Your review will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="flex-1 border border-border-col text-text-primary py-2.5 rounded-lg text-sm font-semibold hover:bg-bg-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletingId === pendingDelete._id}
                className="flex-1 bg-danger text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deletingId === pendingDelete._id && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
