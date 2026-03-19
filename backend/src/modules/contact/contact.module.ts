import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContactController } from './contact.controller'
import { ContactService } from './contact.service'
import { User } from '../../entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
