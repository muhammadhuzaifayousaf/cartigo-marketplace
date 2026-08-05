const VARIANT_STYLES = {
  solid: 'bg-primary text-white',
  soft: 'bg-primary/10 text-primary',
  light: 'bg-primary-light text-primary',
}

/**
 * Avatar — round profile picture with an initial-letter fallback.
 * Renders the uploaded image when present, otherwise the name's initials.
 *
 * @param {Object}   props
 * @param {string}   props.name     Display name (for initials/alt)
 * @param {string}   props.avatar   Cloudinary URL (empty = initials)
 * @param {number}   props.size     Diameter in pixels
 * @param {string}   props.variant  "solid" | "soft" | "light"
 * @param {string}   props.className Extra classes
 */
export default function Avatar({ name = '', avatar = '', size = 40, variant = 'solid', className = '' }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name || 'Avatar'}
        className={`rounded-full object-cover bg-bg-light flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
        onError={(e) => { e.target.style.display = 'none' }}
      />
    )
  }

  const initials =
    (name || '?')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w.charAt(0))
      .join('')
      .toUpperCase() || '?'

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 ${VARIANT_STYLES[variant] || VARIANT_STYLES.solid} ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      aria-label={name ? `${name}'s avatar` : 'Avatar'}
    >
      {initials}
    </div>
  )
}
