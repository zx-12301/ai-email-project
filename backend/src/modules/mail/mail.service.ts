import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like, ILike, Between } from 'typeorm'
import { Mail } from '../../entities/mail.entity'
import { AiService } from '../ai/ai.service'

export type MailFolder = 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam'

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(Mail)
    private mailRepository: Repository<Mail>,
    private aiService: AiService,
  ) {}

  /**
   * 获取收件箱
   */
  async getInbox(userId: string, page: number = 1, limit: number = 20, filters?: {
    isRead?: boolean
    isStarred?: boolean
    label?: string
  }) {
    const query = this.mailRepository.createQueryBuilder('mail')
      .where('mail.userId = :userId', { userId })
      .andWhere('mail.folder = :folder', { folder: 'inbox' })
      .andWhere('mail.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('mail.createdAt', 'DESC')

    if (filters?.isRead !== undefined) {
      query.andWhere('mail.isRead = :isRead', { isRead: filters.isRead })
    }
    if (filters?.isStarred) {
      query.andWhere('mail.isStarred = :isStarred', { isStarred: true })
    }
    if (filters?.label) {
      query.andWhere('mail.label = :label', { label: filters.label })
    }

    query.skip((page - 1) * limit).take(limit)

    const [mails, total] = await query.getManyAndCount()

    return {
      data: mails,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * 获取已发送
   */
  async getSent(userId: string, page: number = 1, limit: number = 20) {
    const query = this.mailRepository.createQueryBuilder('mail')
      .where('mail.userId = :userId', { userId })
      .andWhere('mail.folder = :folder', { folder: 'sent' })
      .orderBy('mail.sentAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [mails, total] = await query.getManyAndCount()

    return {
      data: mails,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * 获取草稿箱
   */
  async getDrafts(userId: string, page: number = 1, limit: number = 20) {
    const query = this.mailRepository.createQueryBuilder('mail')
      .where('mail.userId = :userId', { userId })
      .andWhere('mail.folder = :folder', { folder: 'drafts' })
      .orderBy('mail.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [mails, total] = await query.getManyAndCount()

    return {
      data: mails,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * 获取垃圾箱
   */
  async getTrash(userId: string, page: number = 1, limit: number = 20) {
    const query = this.mailRepository.createQueryBuilder('mail')
      .where('mail.userId = :userId', { userId })
      .andWhere('mail.folder = :folder', { folder: 'trash' })
      .orderBy('mail.deletedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [mails, total] = await query.getManyAndCount()

    return {
      data: mails,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * 获取邮件详情
   */
  async getMailById(userId: string, id: string): Promise<Mail> {
    const mail = await this.mailRepository.findOne({
      where: { id, userId },
      relations: ['user'],
    })

    if (!mail) {
      throw new NotFoundException('邮件不存在')
    }

    // 标记为已读
    if (!mail.isRead && mail.folder === 'inbox') {
      mail.isRead = true
      await this.mailRepository.save(mail)
    }

    return mail
  }

  /**
   * 创建/发送邮件
   */
  async sendMail(userId: string, data: {
    from: string
    fromName: string
    to: string[]
    cc?: string[]
    bcc?: string[]
    subject: string
    content: string
    contentHtml?: string
    attachments?: string[]
    inReplyTo?: string
    isDraft?: boolean
  }): Promise<Mail> {
    const mailData: Partial<Mail> = {
      userId,
      folder: data.isDraft ? 'drafts' : 'sent',
      from: data.from,
      fromName: data.fromName,
      to: data.to,
      cc: data.cc || [],
      bcc: data.bcc || [],
      subject: data.subject,
      content: data.content,
      contentHtml: data.contentHtml,
      attachments: data.attachments || [],
      inReplyTo: data.inReplyTo,
      isRead: true,
      sentAt: data.isDraft ? null : new Date(),
      status: data.isDraft ? 'draft' : 'sent',
    }

    const mail = this.mailRepository.create(mailData)
    return await this.mailRepository.save(mail)
  }

  /**
   * 更新邮件（保存草稿）
   */
  async updateMail(userId: string, id: string, data: Partial<Mail>): Promise<Mail> {
    const mail = await this.getMailById(userId, id)
    Object.assign(mail, data)
    return await this.mailRepository.save(mail)
  }

  /**
   * 删除邮件（移动到垃圾箱）
   */
  async moveToTrash(userId: string, id: string): Promise<Mail> {
    const mail = await this.getMailById(userId, id)
    mail.folder = 'trash'
    mail.isDeleted = true
    mail.deletedAt = new Date()
    return await this.mailRepository.save(mail)
  }

  /**
   * 批量删除
   */
  async batchMoveToTrash(userId: string, ids: string[]): Promise<number> {
    const result = await this.mailRepository.update(
      { id: ids[0], userId },
      {
        folder: 'trash',
        isDeleted: true,
        deletedAt: new Date(),
      },
    )
    return result.affected || 0
  }

  /**
   * 恢复邮件
   */
  async restoreMail(userId: string, id: string): Promise<Mail> {
    const mail = await this.getMailById(userId, id)
    mail.folder = 'inbox'
    mail.isDeleted = false
    mail.deletedAt = null
    return await this.mailRepository.save(mail)
  }

  /**
   * 永久删除
   */
  async permanentlyDelete(userId: string, id: string): Promise<void> {
    const mail = await this.getMailById(userId, id)
    await this.mailRepository.remove(mail)
  }

  /**
   * 清空垃圾箱
   */
  async emptyTrash(userId: string): Promise<number> {
    const result = await this.mailRepository.delete({
      userId,
      folder: 'trash',
    })
    return result.affected || 0
  }

  /**
   * 标记已读/未读
   */
  async markAsRead(userId: string, id: string, isRead: boolean): Promise<Mail> {
    const mail = await this.getMailById(userId, id)
    mail.isRead = isRead
    return await this.mailRepository.save(mail)
  }

  /**
   * 批量标记已读
   */
  async batchMarkAsRead(userId: string, ids: string[], isRead: boolean): Promise<number> {
    const result = await this.mailRepository.update(
      { id: ids[0], userId },
      { isRead },
    )
    return result.affected || 0
  }

  /**
   * 切换星标
   */
  async toggleStar(userId: string, id: string): Promise<Mail> {
    const mail = await this.getMailById(userId, id)
    mail.isStarred = !mail.isStarred
    return await this.mailRepository.save(mail)
  }

  /**
   * 归档邮件
   */
  async archive(userId: string, id: string): Promise<Mail> {
    const mail = await this.getMailById(userId, id)
    mail.folder = 'inbox'
    mail.label = 'important'
    return await this.mailRepository.save(mail)
  }

  /**
   * 搜索邮件
   */
  async search(userId: string, query: string, page: number = 1, limit: number = 20) {
    const mails = await this.mailRepository.find({
      where: [
        { userId, subject: Like(`%${query}%`) },
        { userId, content: Like(`%${query}%`) },
        { userId, from: Like(`%${query}%`) },
        { userId, to: Like(`%${query}%`) },
      ],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await this.mailRepository.count({
      where: [
        { userId, subject: Like(`%${query}%`) },
        { userId, content: Like(`%${query}%`) },
        { userId, from: Like(`%${query}%`) },
        { userId, to: Like(`%${query}%`) },
      ],
    })

    return {
      data: mails,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * AI 智能写信并发送
   */
  async sendWithAI(userId: string, data: {
    from: string
    fromName: string
    to: string[]
    subject: string
    prompt: string
    tone?: string
  }): Promise<Mail> {
    // 调用 AI 生成邮件内容
    const aiResult = await this.aiService.generateEmail(data.prompt, data.tone)

    // 发送邮件
    return this.sendMail(userId, {
      from: data.from,
      fromName: data.fromName,
      to: data.to,
      subject: data.subject,
      content: aiResult.content,
      isDraft: false,
    })
  }

  /**
   * AI 智能回复
   */
  async replyWithAI(userId: string, originalMailId: string, suggestionIndex: number): Promise<Mail> {
    const originalMail = await this.getMailById(userId, originalMailId)

    // 调用 AI 生成回复
    const aiResult = await this.aiService.generateReply(originalMail.content, originalMail.from)

    const replyContent = aiResult.suggestions[suggestionIndex] || aiResult.suggestions[0]

    // 发送回复
    return this.sendMail(userId, {
      from: originalMail.to[0], // 假设第一个收件人是当前用户
      fromName: 'User',
      to: [originalMail.from],
      subject: `Re: ${originalMail.subject}`,
      content: replyContent,
      inReplyTo: originalMail.id,
      isDraft: false,
    })
  }
}
