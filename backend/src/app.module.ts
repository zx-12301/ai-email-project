import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { MailModule } from './modules/mail/mail.module'
import { AiModule } from './modules/ai/ai.module'
import { ContactModule } from './modules/contact/contact.module'
import { FileModule } from './modules/file/file.module'
import { User, Mail, Contact } from './entities'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // 数据库配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DB_DATABASE', 'data/ai_email.db'),
        entities: [User, Mail, Contact],
        synchronize: true, // 开发环境自动同步表结构
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    
    // 业务模块
    AuthModule,
    MailModule,
    AiModule,
    ContactModule,
    FileModule,
  ],
})
export class AppModule {}
