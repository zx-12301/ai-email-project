import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { IsString, IsMobilePhone, Length } from 'class-validator'
import { AuthService } from './auth.service'

export class SendCodeDto {
  @IsString()
  @IsMobilePhone('zh-CN')
  phone: string
}

export class LoginDto {
  @IsString()
  @IsMobilePhone('zh-CN')
  phone: string

  @IsString()
  @Length(6, 6)
  code: string
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
   * 登录（验证码登录）
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.validateUserAndLogin(loginDto.phone, loginDto.code)
  }

  /**
   * 获取当前用户信息
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    return this.authService.getCurrentUser(req.user.sub)
  }

  /**
   * 更新用户资料
   */
  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Request() req, @Body() data: Partial<any>) {
    return this.authService.updateProfile(req.user.sub, data)
  }

  /**
   * 登出
   */
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout() {
    return this.authService.logout()
  }
}
