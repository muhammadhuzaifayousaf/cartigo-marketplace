import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext()

const TOAST_STYLES = {
  success: { icon: CheckCircle, border: 'border-success/30', iconColor: 'text-success' },
  error: { icon: AlertCircle, border: 'border-danger/30', iconColor: 'text-danger' },
  info: { icon: Info, border: 'border-primary/30', iconColor: 'text-primary' },
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((message, { type = 'success', duration = 2500 } = {}) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, type })
    timerRef.current = setTimeout(() => {
      setToast(null)
      timerRef.current = null
    }, duration)
  }, [])

  const { icon: Icon, border, iconColor } = toast
    ? TOAST_STYLES[toast.type]
    : TOAST_STYLES.success

  return (
    <ToastContext.Provider value={showToast}>
      <div aria-live="polite" aria-atomic="true">
        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-toastIn">
            <div className={`flex items-center gap-3 bg-white border ${border} shadow-lg rounded-full px-5 py-3`}>
              <Icon size={20} className={`flex-shrink-0 ${iconColor}`} />
              <span className="text-sm font-medium text-text-primary whitespace-nowrap">{toast.message}</span>
              <button onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); setToast(null) }} className="ml-1 text-text-muted hover:text-text-secondary">
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
