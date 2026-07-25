import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, X } from 'lucide-react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, duration = 2500) => {
    setToast(message)
    const timer = setTimeout(() => setToast(null), duration)
    return () => clearTimeout(timer)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-toastIn">
          <div className="flex items-center gap-3 bg-white border border-success/30 shadow-lg rounded-full px-5 py-3">
            <CheckCircle size={20} className="text-success flex-shrink-0" />
            <span className="text-sm font-medium text-text-primary whitespace-nowrap">{toast}</span>
            <button onClick={() => setToast(null)} className="ml-1 text-text-muted hover:text-text-secondary">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
