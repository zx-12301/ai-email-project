import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Patch, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { IsString, IsMobilePhone, Length, IsEmail, IsOptional, MinLength } from 'class-validator'
import { AuthService } from './auth.service'

// 发送验证码 DTO
export class SendCodeDto {
  @IsString()
  @IsMobilePhone('zh-CN')
  phone: string
}

// 验证码登录 DTO
export class LoginWithCodeDto {
  @IsString()
  @IsMobilePhone('zh-CN')
  phone: string

  @IsString()
  @Length(6, 6)
  code: string
}

// 注册 DTO
export class RegisterDto {
  @IsString()
  @IsMobilePhone('zh-CN')
  phone: string

  @IsString()
  @MinLength(6)
  password: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  name?: string
}

// 密码登录 DTO
export class LoginWithPasswordDto {
  @IsString()
  @IsMobilePhone('zh-CN')
  phone: string

  @IsString()
  password: string
}

// 修改密码 DTO
export class ChangePasswordDto {
  @IsString()
  oldPassword: string

  @IsString()
  @MinLength(6)
  newPassword: string
}

// 重置密码 DTO
export class ResetPasswordDto {
  @IsString()
  @IsMobilePhone('zh-CN')
  phone: string

  @IsString()
  @Length(6, 6)
  code: string

  @IsString()
  @MinLength(6)
  newPassword: string
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 发送验证码
   */
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.authService.sendVerificationCode(sendCodeDto.phone)
  }

  /**
   * 演示用户登录
   */
  @Post('login/demo')
  @HttpCode(HttpStatus.OK)
  async loginAsDemo() {
    return this.authService.loginAsDemo()
  }

  /**
   * 验证码登录/注册
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginWithCode(@Body() loginDto: LoginWithCodeDto) {
    return this.authService.loginWithCode(loginDto.phone, loginDto.code)
  }

  /**
   * 用户注册（密码方式）
   */
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  /**
   * 密码登录
   */
  @Post('login/password')
  @HttpCode(HttpStatus.OK)
  async loginWithPassword(@Body() loginDto: LoginWithPasswordDto) {
    return this.authService.loginWithPassword(loginDto.phone, loginDto.password)
  }

  /**
   * 获取当前用户信息
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    return this.authService.getCurrentUser(req.user.userId)
  }

  /**
   * 更新用户资料
   */
  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Request() req, @Body() data: Partial<any>) {
    return this.authService.updateProfile(req.user.userId, data)
  }

  /**
   * 修改密码
   */
  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(
      req.user.userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    )
  }

  /**
   * 重置密码（通过验证码）
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.phone,
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
    )
  }

  /**
   * 登出
   */
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout() {
    return this.authService.logout()
  }

  /**
   * 获取系统内所有用户
   */
  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getAllUsers(@Request() req, @Query('excludeCurrent') excludeCurrent?: string) {
    const exclude = excludeCurrent === 'true'
    return this.authService.getAllUsers(exclude ? req.user.userId : undefined)
  }
}
