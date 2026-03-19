import { useState, useEffect } from 'react'
import { NotificationService, NotificationPayload } from '../services/NotificationService'

interface Toast {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
}

export default function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    // 注册通知回调
    const unsubscribe = NotificationService.onNotification((payload: NotificationPayload) => {
      const toast: Toast = {
        id: `${payload.type}-${Date.now()}`,
        type: getToastType(payload.type),
        title: getToastTitle(payload),
        message: payload.data.message || '',
        timestamp: new Date(),
      }

      setToasts((prev) => [...prev.slice(-4), toast]) // 最多显示 5 个

      // 3 秒后自动移除
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 5000)
    })

    return unsubscribe
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-start gap-3 p-4 rounded-lg shadow-lg min-w-[300px] max-w-md
            transform transition-all duration-300 animate-slide-in-right
            ${getToastBg(toast.type)}
          `}
        >
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className={`font-semibold text-sm ${getToastTextColor(toast.type)}`}>
                {toast.title}
              </h4>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className={`text-sm mt-1 ${getToastTextColor(toast.type)}`}>
              {toast.message}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {toast.timestamp.toLocaleTimeString('zh-CN')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function getToastType(notificationType: string): 'success' | 'info' | 'warning' | 'error' {
  switch (notificationType) {
    case 'mail_sent':
      return 'success'
    case 'new_mail':
      return 'info'
    case 'mail_read':
      return 'info'
    case 'system':
      return 'warning'
    default:
      return 'info'
  }
}

function getToastTitle(payload: NotificationPayload): string {
  switch (payload.type) {
    case 'new_mail':
      return '📬 新邮件'
    case 'mail_sent':
      return '✅ 发送成功'
    case 'mail_read':
      return '📖 已读'
    case 'system':
      return '⚠️ 系统通知'
    default:
      return '通知'
  }
}

function getToastBg(type: string): string {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-l-4 border-green-500'
    case 'info':
      return 'bg-blue-50 border-l-4 border-blue-500'
    case 'warning':
      return 'bg-yellow-50 border-l-4 border-yellow-500'
    case 'error':
      return 'bg-red-50 border-l-4 border-red-500'
    default:
      return 'bg-gray-50 border-l-4 border-gray-500'
  }
}

function getToastTextColor(type: string): string {
  switch (type) {
    case 'success':
      return 'text-green-800'
    case 'info':
      return 'text-blue-800'
    case 'warning':
      return 'text-yellow-800'
    case 'error':
      return 'text-red-800'
    default:
      return 'text-gray-800'
  }
}
