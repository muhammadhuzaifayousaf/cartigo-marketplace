import { useEffect, useRef, useState } from 'react'
import { ZoomIn } from 'lucide-react'

const FALLBACK_SRC = 'https://placehold.co/800x800/f7f7f7/999?text=Product'

/**
 * ImageMagnifier — hover-to-magnify product image like real ecommerce
 * galleries.
 *
 * Instead of scaling a second <img> over the top (which leaves empty
 * letterbox strips for non-filling images), it measures the exact
 * rendered rectangle of the base image (object-contain, any aspect ratio)
 * and paints a background-image zoom layer over that same rectangle. The
 * background is sized at `zoom`× and positioned by percentage so the
 * exact pixel under the cursor stays under the cursor — every part of the
 * image (including the bottom edge) is always reachable.
 *
 * @param {Object}   props
 * @param {string}   props.src       image URL (full resolution preferred)
 * @param {string}   props.alt       alt text
 * @param {number}   props.zoom      magnification factor (default 2)
 * @param {Function} [props.onOpen]  optional click handler (opens a viewer)
 * @param {boolean}  [props.showBadge] show the zoom icon badge (default true)
 * @param {string}   props.className extra classes for the wrapper
 */
export default function ImageMagnifier({
  src,
  alt = '',
  zoom = 2,
  onOpen,
  showBadge = true,
  className = '',
}) {
  const [effectiveSrc, setEffectiveSrc] = useState(src)
  const [active, setActive] = useState(false)
  const [view, setView] = useState({ ox: 0, oy: 0, w: 0, h: 0, x: 50, y: 50 })
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  )
  const frameRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    setEffectiveSrc(src)
    setView((prev) => ({ ...prev, w: 0, h: 0 }))
  }, [src])

  const handleMove = (e) => {
    const rect = frameRef.current.getBoundingClientRect()
    const natural = imgRef.current
      ? { w: imgRef.current.naturalWidth || rect.width, h: imgRef.current.naturalHeight || rect.height }
      : { w: rect.width, h: rect.height }

    // Contained size of the base image inside the frame.
    const scale = Math.min(rect.width / natural.w, rect.height / natural.h)
    const w = natural.w * scale
    const h = natural.h * scale
    const ox = (rect.width - w) / 2
    const oy = (rect.height - h) / 2

    // Cursor position clamped to the image content rect.
    const u = Math.min(w, Math.max(0, e.clientX - rect.left - ox))
    const v = Math.min(h, Math.max(0, e.clientY - rect.top - oy))

    setView({
      ox,
      oy,
      w,
      h,
      x: (u / w) * 100,
      y: (v / h) * 100,
    })
  }

  return (
    <div
      ref={frameRef}
      className={`relative overflow-hidden ${isTouch ? '' : 'cursor-zoom-in'} ${className}`}
      onMouseEnter={isTouch ? undefined : () => setActive(true)}
      onMouseMove={isTouch ? undefined : handleMove}
      onMouseLeave={isTouch ? undefined : () => setActive(false)}
      onClick={isTouch ? undefined : onOpen}
      onKeyDown={isTouch ? undefined : (onOpen ? (e) => e.key === 'Enter' && onOpen() : undefined)}
      role={onOpen && !isTouch ? 'button' : undefined}
      tabIndex={onOpen && !isTouch ? 0 : undefined}
      aria-label={onOpen && !isTouch ? `Zoom in on ${alt}` : undefined}
    >
      <img
        ref={imgRef}
        src={effectiveSrc}
        alt={alt}
        className="w-full h-full object-contain"
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth) setView((prev) => ({ ...prev, w: 0, h: 0 }))
        }}
        onError={() => setEffectiveSrc(FALLBACK_SRC)}
      />

      {active && view.w > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            left: view.ox,
            top: view.oy,
            width: view.w,
            height: view.h,
            backgroundImage: `url(${effectiveSrc})`,
            backgroundSize: `${view.w * zoom}px ${view.h * zoom}px`,
            backgroundPosition: `${view.x}% ${view.y}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      {showBadge && !isTouch && (
        <span className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/45 text-white flex items-center justify-center pointer-events-none opacity-90">
          <ZoomIn size={16} />
        </span>
      )}
    </div>
  )
}
