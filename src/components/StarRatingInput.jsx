import { useState } from 'react'

// StarRatingInput — interactive 1–5 star picker with hover preview and
// keyboard support. Averages are rendered separately (see StarRating).
export default function StarRatingInput({ value = 0, onChange, size = 'md', disabled = false }) {
  const [hover, setHover] = useState(0)
  const active = hover || value
  const sizeClass =
    size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl'

  return (
    <div
      className={`inline-flex items-center gap-1 ${disabled ? 'opacity-50' : ''}`}
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHover(0)}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1
        const selected = active >= star
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onFocus={() => setHover(star)}
            onBlur={() => setHover(0)}
            className={`${sizeClass} ${
              selected ? 'star-filled' : 'star-empty'
            } transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} focus:outline-none focus:ring-2 focus:ring-primary rounded`}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}
