import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AiService } from './ai.service'

class GenerateEmailDto {
  prompt: string
  tone?: 'formal' | 'friendly' | 'concise' | 'detailed' | 'casual'
}

class GenerateReplyDto {
  mailContent: string
  sender?: string
}

class DetectPhishingDto {
  mailContent: string
  sender: string
  subject?: string
}

class ClassifyMailDto {
  mailContent: string
  subject?: string
}

class SummarizeMailDto {
  mailContent: string
  maxLength?: number
}

class SuggestContactsDto {
  query: string
  existingContacts: string[]
}

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

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(private aiService: AiService) {}

  /**
   * AI 智能写信
   */
  @Post('generate-email')
  async generateEmail(@Body() body: GenerateEmailDto): Promise<EmailGenerationResult> {
    return this.aiService.generateEmail(body.prompt, body.tone || 'formal')
  }

  /**
   * AI 智能回复
   */
  @Post('generate-reply')
  async generateReply(@Body() body: GenerateReplyDto): Promise<ReplySuggestionResult> {
    return this.aiService.generateReply(body.mailContent, body.sender)
  }

  /**
   * 钓鱼邮件检测
   */
  @Post('detect-phishing')
  async detectPhishing(@Body() body: DetectPhishingDto): Promise<PhishingDetectionResult> {
    return this.aiService.detectPhishing(body.mailContent, body.sender, body.subject)
  }

  /**
   * 邮件分类
   */
  @Post('classify-mail')
  async classifyMail(@Body() body: ClassifyMailDto): Promise<MailClassificationResult> {
    return this.aiService.classifyMail(body.mailContent, body.subject)
  }

  /**
   * 邮件摘要
   */
  @Post('summarize')
  async summarizeMail(@Body() body: SummarizeMailDto): Promise<string> {
    return this.aiService.summarizeMail(body.mailContent, body.maxLength)
  }

  /**
   * 联系人推荐
   */
  @Post('suggest-contacts')
  async suggestContacts(@Body() body: SuggestContactsDto): Promise<string[]> {
    return this.aiService.suggestContacts(body.query, body.existingContacts)
  }
}
