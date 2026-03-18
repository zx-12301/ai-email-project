import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailController } from './mail.controller'
import { MailService } from './mail.service'
import { Mail } from '../../entities/mail.entity'
import { AiModule } from '../ai/ai.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Mail]),
    AiModule,
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
