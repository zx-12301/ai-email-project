import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // 启用 CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
  
  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  
  // 全局前缀
  app.setGlobalPrefix('api')
  
  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`🚀 Backend running on http://localhost:${port}`)
}
bootstrap()
