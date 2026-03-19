import { Module, Global } from '@nestjs/common'
import { NotificationGateway } from './notification.gateway'
import { NotificationService } from './notification.service'

@Global()
@Module({
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
