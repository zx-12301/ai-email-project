import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../entities/user.entity'
import * as crypto from 'crypto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 发送验证码
   */
  async sendVerificationCode(phone: string): Promise<{ success: boolean; message: string }> {
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      throw new BadRequestException('手机号格式不正确')
    }

    // 生成 6 位验证码
    const code = Math.random().toString().slice(-6)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 分钟有效期

    // 查找或创建用户
    let user = await this.userRepository.findOne({ where: { phone } })
    if (!user) {
      user = this.userRepository.create({ phone })
    }

    // 更新验证码
    user.verificationCode = code
    user.codeExpiresAt = expiresAt
    await this.userRepository.save(user)

    // TODO: 实际项目中这里应该调用短信服务发送验证码
    console.log(`📱 验证码 [${phone}]: ${code} (有效期 5 分钟)`)

    return {
      success: true,
      message: '验证码已发送（开发环境请查看控制台）',
    }
  }

  /**
   * 验证用户并登录
   */
  async validateUserAndLogin(phone: string, code: string): Promise<{
    access_token: string
    user: {
      id: string
      phone: string
      email: string | null
      name: string | null
      avatar: string | null
    }
  }> {
    const user = await this.userRepository.findOne({ where: { phone } })

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    // 验证验证码
    if (user.verificationCode !== code) {
      throw new UnauthorizedException('验证码错误')
    }

    // 检查验证码是否过期
    if (user.codeExpiresAt && new Date() > user.codeExpiresAt) {
      throw new UnauthorizedException('验证码已过期，请重新发送')
    }

    // 清除验证码
    user.verificationCode = null
    user.codeExpiresAt = null
    user.emailVerified = true
    await this.userRepository.save(user)

    // 生成 JWT token
    const payload = { sub: user.id, phone: user.phone }
    const access_token = this.jwtService.sign(payload)

    return {
      access_token,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    }
  }

  /**
   * 验证 JWT token
   */
  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token)
      return await this.userRepository.findOne({ where: { id: payload.sub } })
    } catch {
      return null
    }
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'phone', 'email', 'name', 'avatar', 'signature', 'emailVerified', 'createdAt'],
    })
  }

  /**
   * 更新用户信息
   */
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update(userId, data)
    return this.userRepository.findOne({ where: { id: userId } })
  }

  /**
   * 登出（客户端清除 token 即可）
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: '登出成功',
    }
  }
}
