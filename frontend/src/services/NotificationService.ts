import { io, Socket } from 'socket.io-client'

export interface NotificationPayload {
  type: 'new_mail' | 'mail_read' | 'mail_sent' | 'system'
  userId: string
  data: {
    mailId?: string
    subject?: string
    from?: string
    message?: string
    [key: string]: any
  }
}

export type NotificationCallback = (payload: NotificationPayload) => void

class NotificationServiceClass {
  private socket: Socket | null = null
  private callbacks: NotificationCallback[] = []
  private userId: string | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  /**
   * 连接到 WebSocket 服务器
   */
  connect(userId: string, token: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.socket?.connected) {
        console.log('[Notification] 已连接')
        resolve(true)
        return
      }

      this.userId = userId

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      const wsUrl = backendUrl.replace('http', 'ws')

      console.log('[Notification] 连接到:', `${wsUrl}/notifications`)

      this.socket = io(`${wsUrl}/notifications`, {
        transports: ['websocket', 'polling'],
        auth: { token },
      })

      this.socket.on('connect', () => {
        console.log('[Notification] 连接成功')
        this.reconnectAttempts = 0

        // 认证
        this.socket?.emit('authenticate', { userId, token })
      })

      this.socket.on('authenticated', (data: any) => {
        console.log('[Notification] 认证成功:', data)
        resolve(true)
      })

      this.socket.on('notification', (payload: NotificationPayload) => {
        console.log('[Notification] 收到通知:', payload)
        this.callbacks.forEach((cb) => cb(payload))
      })

      this.socket.on('error', (error: any) => {
        console.error('[Notification] 错误:', error)
        resolve(false)
      })

      this.socket.on('disconnect', (reason: string) => {
        console.log('[Notification] 断开连接:', reason)
        
        // 尝试重连
        if (reason === 'io server disconnect' && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++
          console.log(`[Notification] 尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
          setTimeout(() => this.connect(userId, token), 3000)
        }
      })

      // 连接超时
      setTimeout(() => {
        if (!this.socket?.connected) {
          console.warn('[Notification] 连接超时')
          resolve(false)
        }
      }, 10000)
    })
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.userId = null
      console.log('[Notification] 已断开连接')
    }
  }

  /**
   * 注册通知回调
   */
  onNotification(callback: NotificationCallback) {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  /**
   * 获取用户 ID
   */
  getUserId(): string | null {
    return this.userId
  }
}

// 导出单例
export const NotificationService = new NotificationServiceClass()
