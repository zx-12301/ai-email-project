import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ToastType = 'success' | 'info' | 'warning' | 'error'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
  showConfirm: (options: ConfirmOptions) => Promise<boolean>
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

interface ConfirmState {
  options: ConfirmOptions
  resolve: (value: boolean) => void
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, message }])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setConfirm({ options, resolve })
    })
  }, [])

  const handleConfirm = (result: boolean) => {
    if (confirm) {
      confirm.resolve(result)
      setConfirm(null)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return '✓'
      case 'error': return '✕'
      case 'warning': return '⚠'
      case 'info': return 'ℹ'
    }
  }

  const getToastBg = (type: ToastType) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-500'
      case 'error': return 'bg-red-50 border-red-500'
      case 'warning': return 'bg-yellow-50 border-yellow-500'
      case 'info': return 'bg-blue-50 border-blue-500'
    }
  }

  const getToastText = (type: ToastType) => {
    switch (type) {
      case 'success': return 'text-green-800'
      case 'error': return 'text-red-800'
      case 'warning': return 'text-yellow-800'
      case 'info': return 'text-blue-800'
    }
  }

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-md
              border-l-4 animate-slide-in-right
              ${getToastBg(toast.type)}
            `}
          >
            <span className={`text-lg font-bold ${getToastText(toast.type)}`}>
              {getToastIcon(toast.type)}
            </span>
            <p className={`flex-1 text-sm ${getToastText(toast.type)}`}>
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => handleConfirm(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {confirm.options.title || '确认操作'}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirm.options.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleConfirm(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {confirm.options.cancelText || '取消'}
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className={`px-4 py-2 text-sm text-white rounded-lg transition-colors ${
                  confirm.options.type === 'danger'
                    ? 'bg-red-500 hover:bg-red-600'
                    : confirm.options.type === 'warning'
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {confirm.options.confirmText || '确认'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}