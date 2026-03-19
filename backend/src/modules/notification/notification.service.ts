import { Injectable } from '@nestjs/common'
import { NotificationGateway } from './notification.gateway'

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

@Injectable()
export class NotificationService {
  constructor(private gateway: NotificationGateway) {}

  /**
   * 发送新邮件通知
   */
  async notifyNewMail(userId: string, mailData: {
    id: string
    subject: string
    from: string
    fromName: string
  }) {
    const payload: NotificationPayload = {
      type: 'new_mail',
      userId,
      data: {
        mailId: mailData.id,
        subject: mailData.subject,
        from: mailData.from,
        message: `新邮件：${mailData.fromName} - ${mailData.subject}`,
      },
    }

    return this.gateway.sendToUser(userId, payload)
  }

  /**
   * 发送已读通知
   */
  async notifyMailRead(userId: string, mailId: string) {
    const payload: NotificationPayload = {
      type: 'mail_read',
      userId,
      data: {
        mailId,
        message: '邮件已标记为已读',
      },
    }

    return this.gateway.sendToUser(userId, payload)
  }

  /**
   * 发送发送成功通知
   */
  async notifyMailSent(userId: string, mailId: string, subject: string) {
    const payload: NotificationPayload = {
      type: 'mail_sent',
      userId,
      data: {
        mailId,
        subject,
        message: `邮件已发送：${subject}`,
      },
    }

    return this.gateway.sendToUser(userId, payload)
  }

  /**
   * 发送系统通知
   */
  async notifySystem(userId: string, message: string, data?: any) {
    const payload: NotificationPayload = {
      type: 'system',
      userId,
      data: {
        message,
        ...data,
      },
    }

    return this.gateway.sendToUser(userId, payload)
  }

  /**
   * 广播通知（所有在线用户）
   */
  async broadcast(payload: NotificationPayload) {
    return this.gateway.broadcast(payload)
  }

  /**
   * 获取在线用户数
   */
  getOnlineUserCount(): number {
    return this.gateway.getOnlineUserCount()
  }

  /**
   * 检查用户是否在线
   */
  isUserOnline(userId: string): boolean {
    return this.gateway.isUserOnline(userId)
  }
}
