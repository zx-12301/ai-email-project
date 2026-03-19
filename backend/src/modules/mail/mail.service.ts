import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like, ILike, Between, Raw, In } from 'typeorm'
import { Mail } from '../../entities/mail.entity'
import { User } from '../../entities/user.entity'
import { AiService } from '../ai/ai.service'
import { MailSenderService } from './mail-sender.service'
import { NotificationService } from '../notification/notification.service'

export type MailFolder = 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam'

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(Mail)
    private mailRepository: Repository<Mail>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private aiService: AiService,
    private mailSenderService: MailSenderService,
    private notificationService: NotificationService,
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
   * 获取未读邮件数量
   */
  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.mailRepository.count({
      where: {
        userId,
        folder: 'inbox',
        isRead: false,
        isDeleted: false,
      },
    })
    return { count }
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
   * 获取垃圾邮件
   */
  async getSpam(userId: string, page: number = 1, limit: number = 20) {
    const query = this.mailRepository.createQueryBuilder('mail')
      .where('mail.userId = :userId', { userId })
      .andWhere('mail.folder = :folder', { folder: 'spam' })
      .andWhere('mail.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('mail.createdAt', 'DESC')
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
    sendViaSmtp?: boolean
  }): Promise<Mail> {
    // 获取当前用户信息，使用用户的邮箱作为发件人
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const actualFrom = user?.email || data.from
    const actualFromName = user?.name || data.fromName

    const mailData: Partial<Mail> = {
      userId,
      folder: data.isDraft ? 'drafts' : 'sent',
      from: actualFrom,
      fromName: actualFromName,
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
    const savedMail = await this.mailRepository.save(mail)

    // 如果不是草稿，为每个收件人创建收件箱邮件
    if (!data.isDraft) {
      console.log('📧 开始为收件人创建收件箱邮件，收件人列表:', data.to)
      // 为每个收件人创建邮件
      for (const toEmail of data.to) {
        console.log('🔍 查找收件人:', toEmail)
        // 尝试通过邮箱查找用户
        let recipientUser = await this.userRepository.findOne({ where: { email: toEmail } })

        // 如果没找到，尝试通过手机号查找
        if (!recipientUser) {
          console.log('  通过邮箱未找到，尝试通过手机号查找...')
          recipientUser = await this.userRepository.findOne({ where: { phone: toEmail } })
        }

        // 如果还是没找到，尝试从邮箱中提取手机号（处理 xxx@example.com 格式）
        if (!recipientUser && toEmail.includes('@')) {
          const phoneFromEmail = toEmail.split('@')[0]
          console.log('  尝试从邮箱中提取手机号:', phoneFromEmail)
          // 检查是否为纯数字（手机号）
          if (/^\d+$/.test(phoneFromEmail)) {
            recipientUser = await this.userRepository.findOne({ where: { phone: phoneFromEmail } })
            if (recipientUser) {
              console.log('  ✅ 通过提取的手机号找到用户')
            }
          }
        }

        // 如果是系统用户，创建收件箱邮件
        if (recipientUser) {
          console.log('  ✅ 找到系统用户:', recipientUser.id, recipientUser.email, recipientUser.phone)
          const recipientMailData: Partial<Mail> = {
            userId: recipientUser.id,
            folder: 'inbox',
            from: actualFrom,
            fromName: actualFromName,
            to: [toEmail],
            cc: data.cc || [],
            subject: data.subject,
            content: data.content,
            contentHtml: data.contentHtml,
            attachments: data.attachments || [],
            inReplyTo: data.inReplyTo,
            isRead: false,
            isStarred: false,
            sentAt: new Date(),
            status: 'delivered',
          }

          const recipientMail = this.mailRepository.create(recipientMailData)
          await this.mailRepository.save(recipientMail)
          console.log('  ✅ 已创建收件箱邮件，ID:', recipientMail.id)
        } else {
          console.log('  ⚠️ 未找到系统用户，跳过创建收件箱邮件')
        }
      }
    }

    // 如果通过 SMTP 实际发送
    if (data.sendViaSmtp && !data.isDraft) {
      const smtpResult = await this.mailSenderService.sendEmail({
        from: actualFrom,
        fromName: actualFromName,
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        subject: data.subject,
        content: data.content,
        contentHtml: data.contentHtml,
        inReplyTo: data.inReplyTo,
      })

      if (!smtpResult.success) {
        // SMTP 发送失败，更新邮件状态
        savedMail.status = 'failed'
        await this.mailRepository.save(savedMail)
        throw new BadRequestException(`SMTP 发送失败：${smtpResult.error}`)
      }

      // 发送成功通知
      await this.notificationService.notifyMailSent(userId, savedMail.id, savedMail.subject)
    }

    return savedMail
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
      { id: In(ids), userId },
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
      { id: In(ids), userId },
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
   * 搜索邮件（支持全文搜索 + 高级过滤）
   */
  async search(
    userId: string,
    query: string,
    page: number = 1,
    limit: number = 20,
    filters?: {
      folder?: MailFolder
      isRead?: boolean
      isStarred?: boolean
      hasAttachments?: boolean
      from?: string
      to?: string
      subject?: string
      dateFrom?: string
      dateTo?: string
    }
  ) {
    const queryBuilder = this.mailRepository.createQueryBuilder('mail')
      .where('mail.userId = :userId', { userId })
      .andWhere('mail.isDeleted = :isDeleted', { isDeleted: false })

    // 全文搜索（多字段匹配）
    if (query) {
      queryBuilder.andWhere(
        '(mail.subject LIKE :query OR mail.content LIKE :query OR mail.from LIKE :query OR mail.to LIKE :query)',
        { query: `%${query}%` }
      )
    }

    // 高级过滤
    if (filters?.folder) {
      queryBuilder.andWhere('mail.folder = :folder', { folder: filters.folder })
    }
    if (filters?.isRead !== undefined) {
      queryBuilder.andWhere('mail.isRead = :isRead', { isRead: filters.isRead })
    }
    if (filters?.isStarred !== undefined) {
      queryBuilder.andWhere('mail.isStarred = :isStarred', { isStarred: filters.isStarred })
    }
    if (filters?.hasAttachments !== undefined) {
      if (filters.hasAttachments) {
        queryBuilder.andWhere('mail.attachments IS NOT NULL AND LENGTH(mail.attachments) > 0')
      } else {
        queryBuilder.andWhere('(mail.attachments IS NULL OR LENGTH(mail.attachments) = 0)')
      }
    }
    if (filters?.from) {
      queryBuilder.andWhere('mail.from LIKE :from', { from: `%${filters.from}%` })
    }
    if (filters?.to) {
      queryBuilder.andWhere('mail.to LIKE :to', { to: `%${filters.to}%` })
    }
    if (filters?.subject) {
      queryBuilder.andWhere('mail.subject LIKE :subject', { subject: `%${filters.subject}%` })
    }
    if (filters?.dateFrom) {
      queryBuilder.andWhere('mail.createdAt >= :dateFrom', { dateFrom: new Date(filters.dateFrom) })
    }
    if (filters?.dateTo) {
      queryBuilder.andWhere('mail.createdAt <= :dateTo', { dateTo: new Date(filters.dateTo) })
    }

    queryBuilder
      .orderBy('mail.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [mails, total] = await queryBuilder.getManyAndCount()

    return {
      data: mails,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
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
      from: originalMail.to[0],
      fromName: 'User',
      to: [originalMail.from],
      subject: `Re: ${originalMail.subject}`,
      content: replyContent,
      inReplyTo: originalMail.id,
      isDraft: false,
    })
  }

  /**
   * 生成测试数据
   */
  async generateTestData(userId: string) {
    const testEmails = [
      {
        from: 'star@sunshine.com',
        fromName: '星耀科技',
        subject: '协同办公软件推荐',
        content: '尊敬的客户：\n\n您好！感谢您对我们产品的关注。我们很高兴向您推荐最新的协同办公软件解决方案。\n\n此致\n敬礼\n\n星耀科技团队',
        isRead: false,
        isStarred: true,
      },
      {
        from: '95555@cmbchina.com',
        fromName: '招商银行',
        subject: '信用卡账单通知',
        content: '尊敬的客户：\n\n您尾号 8888 的信用卡本期账单已出。\n\n账单金额：¥10,000.00\n请按时还款。\n\n招商银行',
        isRead: false,
        isStarred: false,
      },
      {
        from: 'zhangsan@example.com',
        fromName: '张三',
        subject: '项目进度汇报 - 请查阅',
        content: '李总：\n\n现将本周项目进展情况汇报如下：\n\n一、已完成工作\n1. 前端页面开发完成 80%\n2. 后端接口开发完成 90%\n\n汇报人：张三',
        isRead: true,
        isStarred: true,
      },
      {
        from: 'lisi@example.com',
        fromName: '李四',
        subject: '会议邀请 - 下周产品评审会',
        content: '各位同事：\n\n定于下周三下午 2 点召开产品评审会。\n\n会议地点：第一会议室\n\n请准时参加。\n\n李四',
        isRead: false,
        isStarred: false,
      },
      {
        from: 'wangwu@example.com',
        fromName: '王五',
        subject: '关于系统架构调整的说明',
        content: '各位技术同事：\n\n为了提升系统性能，我们计划对现有系统架构进行调整。\n\n详细方案请查看附件。\n\n王五',
        isRead: true,
        isStarred: false,
      },
      // 垃圾邮件测试数据
      {
        from: 'winner@spam.com',
        fromName: '幸运抽奖中心',
        subject: '恭喜您获得 100 万元大奖！请立即领取',
        content: '尊敬的幸运用户：\n\n恭喜您在本次国际抽奖活动中获得特等奖 100 万元！\n请点击链接领取：http://spam.com/claim\n\n抽奖中心',
        folder: 'spam',
        isRead: false,
        isStarred: false,
      },
      {
        from: 'bank@fake-bank.com',
        fromName: '银行安全中心',
        subject: '您的银行账户已被冻结，请立即验证',
        content: '尊敬的客户：\n\n您的银行账户存在异常，请立即点击链接验证：http://fake-bank.com/verify\n\n银行安全中心',
        folder: 'spam',
        isRead: false,
        isStarred: false,
      },
      {
        from: 'promo@marketing.com',
        fromName: '促销活动中心',
        subject: '【限时促销】全场 1 折起！错过再等一年',
        content: '亲爱的顾客：\n\n本店举行限时促销活动，全场商品 1 折起！\n立即购买：http://marketing.com/sale\n\n促销中心',
        folder: 'spam',
        isRead: true,
        isStarred: false,
      },
    ];

    let mailCount = 0;
    for (const emailData of testEmails) {
      const mail = this.mailRepository.create({
        userId,
        folder: 'inbox',
        to: ['user@example.com'],
        status: 'delivered',
        isTest: true,
        ...emailData,
      });
      await this.mailRepository.save(mail);
      mailCount++;
    }

    // 生成草稿测试数据
    const testDrafts = [
      {
        to: ['client@company.com'],
        from: 'user@example.com',
        fromName: '用户',
        subject: '关于合作事宜的沟通',
        content: '尊敬的客户：\n\n您好！关于上次会议讨论的合作事宜，我们整理了一份详细的方案...\n\n期待您的回复。\n\n此致\n敬礼',
      },
      {
        to: ['team@company.com'],
        from: 'user@example.com',
        fromName: '用户',
        subject: '2024 年度工作总结',
        content: '尊敬的领导：\n\n现将本部门 2024 年度工作情况总结如下：\n\n一、主要工作完成情况\n二、存在的问题和不足\n三、2025 年工作计划\n\n汇报人：XXX',
      },
      {
        to: ['hr@company.com'],
        from: 'user@example.com',
        fromName: '用户',
        subject: '请假申请',
        content: '尊敬的领导：\n\n您好！因个人原因，我拟于 X 月 X 日至 X 月 X 日请假，共计 X 天。\n\n恳请批准。\n\n申请人：XXX',
      },
    ];

    let draftCount = 0;
    for (const draftData of testDrafts) {
      const draft = this.mailRepository.create({
        userId,
        folder: 'drafts',
        ...draftData,
        status: 'draft',
      });
      await this.mailRepository.save(draft);
      draftCount++;
    }

    return {
      success: true,
      message: `已生成 ${mailCount} 封测试邮件和 ${draftCount} 封草稿`,
    };
  }
}
