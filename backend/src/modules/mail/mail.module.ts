import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailController } from './mail.controller'
import { MailService } from './mail.service'
import { MailSenderService } from './mail-sender.service'
import { Mail } from '../../entities/mail.entity'
import { User } from '../../entities/user.entity'
import { AiModule } from '../ai/ai.module'
import { NotificationModule } from '../notification/notification.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Mail, User]),
    AiModule,
    NotificationModule,
  ],
  controllers: [MailController],
  providers: [MailService, MailSenderService],
  exports: [MailService, MailSenderService],
})
export class MailModule {}
