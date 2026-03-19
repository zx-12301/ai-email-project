import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

export interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export interface SendEmailOptions {
  from: string
  fromName?: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  content: string
  contentHtml?: string
  attachments?: Array<{
    filename: string
    path?: string
    content?: Buffer
  }>
  inReplyTo?: string
}

@Injectable()
export class MailSenderService {
  private transporter: nodemailer.Transporter
  private smtpConfig: SmtpConfig | null = null

  constructor(private configService: ConfigService) {
    this.initializeSmtp()
  }

  /**
   * 初始化 SMTP 配置
   */
  private initializeSmtp() {
    const smtpHost = this.configService.get<string>('SMTP_HOST')
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587)
    const smtpUser = this.configService.get<string>('SMTP_USER')
    const smtpPass = this.configService.get<string>('SMTP_PASS')
    const smtpSecure = this.configService.get<boolean>('SMTP_SECURE', false)

    if (smtpHost && smtpUser && smtpPass) {
      this.smtpConfig = {
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      }

      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    }
  }

  /**
   * 检查 SMTP 是否已配置
   */
  isSmtpConfigured(): boolean {
    return this.smtpConfig !== null && this.transporter !== null
  }

  /**
   * 验证 SMTP 连接
   */
  async verifySmtpConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false
    }

    try {
      await this.transporter.verify()
      return true
    } catch (error) {
      console.error('SMTP 连接验证失败:', error)
      return false
    }
  }

  /**
   * 发送邮件（通过 SMTP）
   */
  async sendEmail(options: SendEmailOptions): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    if (!this.transporter) {
      return {
        success: false,
        error: 'SMTP 未配置，请在 .env 文件中配置 SMTP_HOST, SMTP_USER, SMTP_PASS',
      }
    }

    try {
      // QQ 邮箱要求发件人必须与 SMTP 登录账号一致
      const fromAddress = this.smtpConfig?.auth?.user || options.from;
      
      const mailOptions: nodemailer.SendMailOptions = {
        from: options.fromName 
          ? `"${options.fromName}" <${fromAddress}>` 
          : fromAddress,
        to: options.to.join(', '),
        cc: options.cc?.join(', '),
        bcc: options.bcc?.join(', '),
        subject: options.subject,
        text: options.content,
        html: options.contentHtml || options.content.replace(/\n/g, '<br>'),
      }

      if (options.attachments) {
        mailOptions.attachments = options.attachments
      }

      if (options.inReplyTo) {
        mailOptions.inReplyTo = options.inReplyTo
      }

      const info = await this.transporter.sendMail(mailOptions)

      return {
        success: true,
        messageId: info.messageId,
      }
    } catch (error) {
      console.error('邮件发送失败:', error)
      return {
        success: false,
        error: error.message || '邮件发送失败',
      }
    }
  }

  /**
   * 批量发送邮件
   */
  async sendBatchEmails(
    emails: SendEmailOptions[],
    concurrency: number = 5
  ): Promise<Array<{
    success: boolean
    messageId?: string
    error?: string
    to: string[]
  }>> {
    const results: Array<{
      success: boolean
      messageId?: string
      error?: string
      to: string[]
    }> = []

    // 限制并发数量
    for (let i = 0; i < emails.length; i += concurrency) {
      const batch = emails.slice(i, i + concurrency)
      const batchResults = await Promise.all(
        batch.map(async (email) => {
          const result = await this.sendEmail(email)
          return {
            ...result,
            to: email.to,
          }
        })
      )
      results.push(...batchResults)
    }

    return results
  }

  /**
   * 更新 SMTP 配置（运行时）
   */
  updateSmtpConfig(config: Partial<SmtpConfig>) {
    const currentConfig = this.smtpConfig || {
      host: '',
      port: 587,
      secure: false,
      auth: { user: '', pass: '' },
    }

    const newConfig: SmtpConfig = {
      ...currentConfig,
      ...config,
      auth: {
        ...currentConfig.auth,
        ...(config.auth || {}),
      },
    }

    this.smtpConfig = newConfig

    this.transporter = nodemailer.createTransport({
      host: newConfig.host,
      port: newConfig.port,
      secure: newConfig.secure,
      auth: newConfig.auth,
    })
  }
}
