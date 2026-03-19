import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

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

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(NotificationGateway.name)
  private userSockets: Map<string, Set<string>> = new Map() // userId -> Set<socketId>

  constructor(private jwtService: JwtService) {}

  /**
   * 客户端连接
   */
  handleConnection(client: Socket) {
    this.logger.log(`客户端连接：${client.id}`)
  }

  /**
   * 客户端断开
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`客户端断开：${client.id}`)
    this.removeSocket(client)
  }

  /**
   * 客户端认证（订阅用户频道）
   */
  @SubscribeMessage('authenticate')
  handleAuthenticate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; token?: string },
  ) {
    const { userId, token } = data

    if (!userId || !token) {
      client.emit('error', { message: '缺少 userId 或 token' })
      return { success: false, message: '缺少 userId 或 token' }
    }

    // 验证 JWT token
    try {
      const payload = this.jwtService.verify(token)
      const tokenUserId = payload.sub

      // 验证 token 中的用户 ID 与请求的 userId 匹配
      if (tokenUserId !== userId) {
        this.logger.warn(`用户 ID 不匹配: token=${tokenUserId}, request=${userId}`)
        client.emit('error', { message: '用户身份验证失败' })
        return { success: false, message: '用户身份验证失败' }
      }
    } catch (error) {
      this.logger.warn(`Token 验证失败: ${error.message}`)
      client.emit('error', { message: 'Token 无效或已过期' })
      return { success: false, message: 'Token 无效或已过期' }
    }

    // 将 socket 加入用户房间
    client.join(`user:${userId}`)

    // 记录用户 socket 映射
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set())
    }
    this.userSockets.get(userId)!.add(client.id)

    this.logger.log(`用户 ${userId} 已认证，socket: ${client.id}`)

    return {
      success: true,
      message: '认证成功',
      userId,
    }
  }

  /**
   * 发送通知给特定用户
   */
  async sendToUser(userId: string, payload: NotificationPayload): Promise<{
    success: boolean
    recipients: number
  }> {
    const socketIds = this.userSockets.get(userId)

    if (!socketIds || socketIds.size === 0) {
      this.logger.debug(`用户 ${userId} 不在线`)
      return { success: false, recipients: 0 }
    }

    // 发送给用户的所有 socket
    this.server.to(`user:${userId}`).emit('notification', payload)

    this.logger.debug(`通知已发送给用户 ${userId}, 收件人数：${socketIds.size}`)

    return {
      success: true,
      recipients: socketIds.size,
    }
  }

  /**
   * 广播通知（所有在线用户）
   */
  async broadcast(payload: NotificationPayload) {
    this.server.emit('notification', payload)
    this.logger.debug(`广播通知：${payload.type}`)
  }

  /**
   * 获取在线用户数
   */
  getOnlineUserCount(): number {
    return this.userSockets.size
  }

  /**
   * 检查用户是否在线
   */
  isUserOnline(userId: string): boolean {
    const sockets = this.userSockets.get(userId)
    return sockets !== undefined && sockets.size > 0
  }

  /**
   * 移除断开的 socket
   */
  private removeSocket(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id)
        if (sockets.size === 0) {
          this.userSockets.delete(userId)
        }
        break
      }
    }
  }
}
