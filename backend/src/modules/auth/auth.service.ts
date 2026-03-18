import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../entities/user.entity'
import * as bcrypt from 'bcrypt'
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
   * 验证码登录/注册
   */
  async loginWithCode(phone: string, code: string): Promise<{
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
      throw new UnauthorizedException('用户不存在，请先注册')
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
   * 用户注册（密码方式）
   */
  async register(data: {
    phone: string
    password: string
    email?: string
    name?: string
  }): Promise<{
    access_token: string
    user: {
      id: string
      phone: string
      email: string | null
      name: string | null
      avatar: string | null
    }
  }> {
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(data.phone)) {
      throw new BadRequestException('手机号格式不正确')
    }

    // 验证密码强度
    if (data.password.length < 6) {
      throw new BadRequestException('密码长度至少 6 位')
    }

    // 检查手机号是否已注册
    const existingUser = await this.userRepository.findOne({ where: { phone: data.phone } })
    if (existingUser) {
      throw new ConflictException('该手机号已注册')
    }

    // 检查邮箱是否已注册
    if (data.email) {
      const existingEmail = await this.userRepository.findOne({ where: { email: data.email } })
      if (existingEmail) {
        throw new ConflictException('该邮箱已注册')
      }
    }

    // 加密密码
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(data.password, saltRounds)

    // 创建用户
    const user = this.userRepository.create({
      phone: data.phone,
      password: hashedPassword,
      email: data.email || null,
      name: data.name || null,
      emailVerified: !!data.email,
    })

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
   * 密码登录
   */
  async loginWithPassword(phone: string, password: string): Promise<{
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

    if (!user.password) {
      throw new UnauthorizedException('请使用验证码登录')
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误')
    }

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
   * 修改密码
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{ success: boolean }> {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    if (!user.password) {
      throw new BadRequestException('请使用验证码登录后再设置密码')
    }

    // 验证旧密码
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('原密码错误')
    }

    // 验证新密码强度
    if (newPassword.length < 6) {
      throw new BadRequestException('新密码长度至少 6 位')
    }

    // 加密新密码
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // 更新密码
    user.password = hashedPassword
    await this.userRepository.save(user)

    return { success: true }
  }

  /**
   * 重置密码（通过验证码）
   */
  async resetPassword(phone: string, code: string, newPassword: string): Promise<{ success: boolean }> {
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
      throw new UnauthorizedException('验证码已过期')
    }

    // 验证新密码强度
    if (newPassword.length < 6) {
      throw new BadRequestException('密码长度至少 6 位')
    }

    // 加密新密码
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // 更新密码和清除验证码
    user.password = hashedPassword
    user.verificationCode = null
    user.codeExpiresAt = null
    await this.userRepository.save(user)

    return { success: true }
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
   * 更新用户资料
   */
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update(userId, data)
    return this.userRepository.findOne({ where: { id: userId } })
  }

  /**
   * 登出
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: '登出成功',
    }
  }
}
