import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { CheckCircle, X } from 'lucide-react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((message, duration = 2500) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(message)
    timerRef.current = setTimeout(() => {
      setToast(null)
      timerRef.current = null
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      <div aria-live="polite" aria-atomic="true">
        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-toastIn">
            <div className="flex items-center gap-3 bg-white border border-success/30 shadow-lg rounded-full px-5 py-3">
              <CheckCircle size={20} className="text-success flex-shrink-0" />
              <span className="text-sm font-medium text-text-primary whitespace-nowrap">{toast}</span>
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
