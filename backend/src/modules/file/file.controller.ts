import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service'

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get()
  async getFiles() {
    return this.fileService.getFiles({ id: 'user1' })
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    return this.fileService.uploadFile(file, { id: 'user1' })
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return this.fileService.deleteFile(id)
  }

  @Get(':id/download')
  async downloadFile(@Param('id') id: string) {
    return this.fileService.downloadFile(id)
  }
}
