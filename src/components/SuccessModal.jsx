import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

export default function SuccessModal({ isOpen, onClose, onContinueShopping, onGoHome }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-scaleIn">
        {/* Success icon */}
        <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-success/10 flex items-center justify-center animate-bounceIn">
          <CheckCircle size={48} className="text-success" />
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Order placed successfully!
        </h2>
        <p className="text-text-secondary mb-8">
          Thank you for shopping with <span className="font-semibold text-primary">Cartiqo</span>.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onContinueShopping}
            className="flex-1 border border-border-col text-text-primary py-3 rounded-lg text-sm font-semibold hover:bg-bg-light transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={onGoHome}
            className="flex-1 bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
