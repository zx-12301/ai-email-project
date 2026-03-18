import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

interface EmailGenerationResult {
  content: string
  alternatives: string[]
}

interface ReplySuggestionResult {
  suggestions: string[]
}

interface PhishingDetectionResult {
  isPhishing: boolean
  riskLevel: 'low' | 'medium' | 'high'
  score: number
  reasons: string[]
}

interface MailClassificationResult {
  category: string
  confidence: number
}

@Injectable()
export class AiService {
  private readonly apiKey: string
  private readonly apiUrl: string
  private readonly model: string

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('AI_API_KEY', '')
    this.apiUrl = this.configService.get('AI_API_URL', 'https://dashscope.aliyuncs.com/api/v1')
    this.model = this.configService.get('AI_MODEL', 'qwen-plus')
  }

  /**
   * 调用百炼 API
   */
  private async callAI(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.apiKey || this.apiKey === 'sk-your-api-key-here') {
      console.warn('⚠️ AI API Key 未配置，返回模拟数据')
      return this.getMockResponse(prompt)
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/services/aigc/text-generation/generation`,
        {
          model: this.model,
          input: {
            messages: [
              ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
              { role: 'user', content: prompt },
            ],
          },
          parameters: {
            temperature: 0.7,
            max_tokens: 2000,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      )

      return response.data.output?.text || response.data.output?.choices?.[0]?.message?.content || ''
    } catch (error) {
      console.error('AI API 调用失败:', error.message)
      throw new BadRequestException('AI 服务暂时不可用')
    }
  }

  /**
   * 模拟响应（当 API Key 未配置时）
   */
  private getMockResponse(prompt: string): string {
    if (prompt.includes('写邮件') || prompt.includes('generate email')) {
      return '尊敬的先生/女士：\n\n您好！这是一封由 AI 助手生成的邮件草稿。\n\n感谢您的关注，期待您的回复。\n\n此致\n敬礼'
    }
    if (prompt.includes('回复') || prompt.includes('reply')) {
      return '好的，我会尽快处理此事。感谢您的来信！'
    }
    if (prompt.includes('钓鱼') || prompt.includes('phishing')) {
      return JSON.stringify({ isPhishing: false, riskLevel: 'low', score: 0.1 })
    }
    return 'AI 助手已就绪，请配置 API Key 以启用真实 AI 功能。'
  }

  /**
   * AI 智能写信
   */
  async generateEmail(prompt: string, tone: string = 'formal'): Promise<EmailGenerationResult> {
    const toneMap: Record<string, string> = {
      formal: '正式、专业',
      friendly: '友好、亲切',
      concise: '简洁、直接',
      detailed: '详细、全面',
      casual: '轻松、随意',
    }

    const systemPrompt = `你是一位专业的邮件写作助手。请用${toneMap[tone] || '正式'}的语气帮助用户撰写邮件。
要求：
1. 格式规范，包含称呼、正文、结尾敬语
2. 语言得体，符合商务邮件标准
3. 内容清晰，逻辑连贯`

    const userPrompt = `请帮我写一封邮件，要求：${prompt}`

    const content = await this.callAI(userPrompt, systemPrompt)

    // 生成备选版本
    const alternativePrompt = `请用不同的语气重新写这封邮件，提供 2 个版本：${prompt}`
    const alternativesRaw = await this.callAI(alternativePrompt, systemPrompt)

    return {
      content,
      alternatives: [alternativesRaw],
    }
  }

  /**
   * AI 智能回复
   */
  async generateReply(mailContent: string, sender?: string): Promise<ReplySuggestionResult> {
    const systemPrompt = `你是一位专业的邮件回复助手。根据来信内容，生成 3 条不同风格的回复建议。
要求：
1. 第一条：正式、专业
2. 第二条：友好、亲切
3. 第三条：简洁、直接`

    const userPrompt = `请为以下邮件生成 3 条回复建议：\n\n${mailContent}`

    const response = await this.callAI(userPrompt, systemPrompt)

    // 解析响应，提取 3 条建议
    const suggestions = response
      .split(/\n\d*[\.、)]\s*/g)
      .filter((s) => s.trim().length > 5)
      .slice(0, 3)

    return {
      suggestions: suggestions.length >= 3 ? suggestions : [response],
    }
  }

  /**
   * 钓鱼邮件检测
   */
  async detectPhishing(mailContent: string, sender: string, subject?: string): Promise<PhishingDetectionResult> {
    const systemPrompt = `你是一位网络安全专家，专门检测钓鱼邮件。分析以下邮件内容，判断是否为钓鱼邮件。
请从以下维度分析：
1. 发件人地址是否可疑
2. 是否有紧急/威胁性语言
3. 是否要求提供敏感信息
4. 是否有可疑链接
5. 语法和拼写是否异常

返回 JSON 格式：{"isPhishing": boolean, "riskLevel": "low|medium|high", "score": 0-1, "reasons": []}`

    const userPrompt = `分析以下邮件是否为钓鱼邮件：\n发件人：${sender}\n主题：${subject || '无'}\n内容：${mailContent}`

    try {
      const response = await this.callAI(userPrompt, systemPrompt)
      // 尝试解析 JSON
      const jsonMatch = response.match(/\{[^}]+\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.error('钓鱼检测解析失败:', e)
    }

    // 默认安全
    return {
      isPhishing: false,
      riskLevel: 'low',
      score: 0.1,
      reasons: ['未检测到明显风险'],
    }
  }

  /**
   * 邮件分类
   */
  async classifyMail(mailContent: string, subject?: string): Promise<MailClassificationResult> {
    const systemPrompt = `你是一位邮件分类助手。将邮件分类到以下类别之一：
- work: 工作相关
- personal: 个人邮件
- promotion: 广告促销
- social: 社交通知
- subscription: 订阅内容

返回 JSON 格式：{"category": "类别", "confidence": 0-1}`

    const userPrompt = `分类以下邮件：\n主题：${subject || '无'}\n内容：${mailContent}`

    try {
      const response = await this.callAI(userPrompt, systemPrompt)
      const jsonMatch = response.match(/\{[^}]+\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.error('邮件分类解析失败:', e)
    }

    return {
      category: 'work',
      confidence: 0.5,
    }
  }

  /**
   * 邮件摘要
   */
  async summarizeMail(mailContent: string, maxLength: number = 200): Promise<string> {
    const systemPrompt = `你是一位邮件摘要助手。用简洁的语言总结邮件内容，不超过${maxLength}字。`

    const userPrompt = `请总结以下邮件：\n\n${mailContent}`

    return await this.callAI(userPrompt, systemPrompt)
  }

  /**
   * 联系人智能推荐
   */
  async suggestContacts(query: string, existingContacts: string[]): Promise<string[]> {
    const systemPrompt = `根据用户输入，从联系人列表中推荐最相关的联系人。返回联系人邮箱列表。`

    const userPrompt = `用户输入：${query}\n现有联系人：${existingContacts.join(', ')}\n请推荐最相关的 3 个联系人。`

    const response = await this.callAI(userPrompt, systemPrompt)

    // 提取邮箱
    const emails = response.match(/[\w.-]+@[\w.-]+\.\w+/g) || []
    return emails.slice(0, 3)
  }
}
