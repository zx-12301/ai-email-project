import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator'
import { MailService } from './mail.service'

class SendMailDto {
  @IsArray()
  @IsString({ each: true })
  to: string[]

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  cc?: string[]

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  bcc?: string[]

  @IsString()
  subject: string

  @IsString()
  content: string

  @IsString()
  @IsOptional()
  contentHtml?: string

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  attachments?: string[]

  @IsBoolean()
  @IsOptional()
  isDraft?: boolean
}

class SearchMailDto {
  q: string
  page?: number
  limit?: number
}

@Controller('mail')
@UseGuards(AuthGuard('jwt'))
export class MailController {
  constructor(private mailService: MailService) {}

  /**
   * 获取收件箱
   */
  @Get('inbox')
  async getInbox(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('isRead') isRead?: boolean,
    @Query('isStarred') isStarred?: boolean,
  ) {
    return this.mailService.getInbox(req.user.userId, page, limit, { isRead, isStarred })
  }

  /**
   * 获取已发送
   */
  @Get('sent')
  async getSent(@Request() req, @Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.mailService.getSent(req.user.userId, page, limit)
  }

  /**
   * 获取草稿箱
   */
  @Get('drafts')
  async getDrafts(@Request() req, @Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.mailService.getDrafts(req.user.userId, page, limit)
  }

  /**
   * 获取垃圾箱
   */
  @Get('trash')
  async getTrash(@Request() req, @Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.mailService.getTrash(req.user.userId, page, limit)
  }

  /**
   * 获取邮件详情
   */
  @Get(':id')
  async getMailById(@Request() req, @Param('id') id: string) {
    return this.mailService.getMailById(req.user.userId, id)
  }

  /**
   * 发送邮件
   */
  @Post()
  async sendMail(@Request() req, @Body() body: SendMailDto) {
    return this.mailService.sendMail(req.user.userId, {
      from: req.user.phone,
      fromName: 'User',
      ...body,
    })
  }

  /**
   * 保存草稿
   */
  @Post('draft')
  async saveDraft(@Request() req, @Body() body: SendMailDto) {
    return this.mailService.sendMail(req.user.userId, {
      from: req.user.phone,
      fromName: 'User',
      ...body,
      isDraft: true,
    })
  }

  /**
   * 更新草稿
   */
  @Patch(':id')
  async updateMail(@Request() req, @Param('id') id: string, @Body() data: Partial<SendMailDto>) {
    return this.mailService.updateMail(req.user.userId, id, data)
  }

  /**
   * 删除邮件（移动到垃圾箱）
   */
  @Delete(':id')
  async moveToTrash(@Request() req, @Param('id') id: string) {
    return this.mailService.moveToTrash(req.user.userId, id)
  }

  /**
   * 恢复邮件
   */
  @Post(':id/restore')
  async restoreMail(@Request() req, @Param('id') id: string) {
    return this.mailService.restoreMail(req.user.userId, id)
  }

  /**
   * 永久删除
   */
  @Delete(':id/permanent')
  async permanentlyDelete(@Request() req, @Param('id') id: string) {
    return this.mailService.permanentlyDelete(req.user.userId, id)
  }

  /**
   * 清空垃圾箱
   */
  @Delete('trash/all')
  async emptyTrash(@Request() req) {
    return this.mailService.emptyTrash(req.user.userId)
  }

  /**
   * 标记已读/未读
   */
  @Patch(':id/read')
  async markAsRead(@Request() req, @Param('id') id: string, @Body() body: { isRead: boolean }) {
    return this.mailService.markAsRead(req.user.userId, id, body.isRead)
  }

  /**
   * 切换星标
   */
  @Patch(':id/star')
  async toggleStar(@Request() req, @Param('id') id: string) {
    return this.mailService.toggleStar(req.user.userId, id)
  }

  /**
   * 归档邮件
   */
  @Post(':id/archive')
  async archive(@Request() req, @Param('id') id: string) {
    return this.mailService.archive(req.user.userId, id)
  }

  /**
   * 搜索邮件
   */
  @Get('search')
  async search(@Request() req, @Query() query: SearchMailDto) {
    return this.mailService.search(req.user.userId, query.q, query.page, query.limit)
  }

  /**
   * 生成测试数据
   */
  @Post('generate-test-data')
  async generateTestData(@Request() req) {
    return this.mailService.generateTestData(req.user.userId)
  }

  /**
   * AI 智能写信并发送
   */
  @Post('send-with-ai')
  async sendWithAI(@Request() req, @Body() body: {
    to: string[]
    subject: string
    prompt: string
    tone?: string
  }) {
    return this.mailService.sendWithAI(req.user.userId, {
      from: req.user.phone,
      fromName: 'User',
      ...body,
    })
  }

  /**
   * AI 智能回复
   */
  @Post(':id/reply-with-ai')
  async replyWithAI(@Request() req, @Param('id') id: string, @Body() body: { suggestionIndex: number }) {
    return this.mailService.replyWithAI(req.user.userId, id, body.suggestionIndex)
  }
}
