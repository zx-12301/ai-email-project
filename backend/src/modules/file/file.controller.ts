import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  Res,
  StreamableFile,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { FileService } from './file.service'

@Controller('file')
@UseGuards(AuthGuard('jwt'))
export class FileController {
  constructor(private fileService: FileService) {}

  @Get()
  async getFiles(@Request() req: any) {
    return this.fileService.getFiles(req.user)
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Request() req: any, @UploadedFile() file: any) {
    return this.fileService.uploadFile(file, req.user)
  }

  @Delete(':id')
  async deleteFile(@Request() req: any, @Param('id') id: string) {
    return this.fileService.deleteFile(req.user.userId, id)
  }

  @Get(':id/download')
  async downloadFile(
    @Request() req: any,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.fileService.downloadFile(req.user.userId, id)

    res.set({
      'Content-Type': result.mimeType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(result.originalName)}"`,
    })

    return new StreamableFile(result.buffer)
  }

  @Get(':id/info')
  async getFileInfo(@Request() req: any, @Param('id') id: string) {
    return this.fileService.getFileInfo(req.user.userId, id)
  }
}
