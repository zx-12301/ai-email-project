import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { File } from '../../entities/file.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([File])
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
