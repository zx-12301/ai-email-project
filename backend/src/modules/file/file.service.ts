import { Injectable } from '@nestjs/common'

export interface FileAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  mailId?: string
  createdAt: string
}

@Injectable()
export class FileService {
  private files: FileAttachment[] = []

  async getFiles(user: any) {
    return this.files
  }

  async uploadFile(file: any, user: any) {
    console.log('Upload file:', file?.originalname)
    const fileData: FileAttachment = {
      id: Date.now().toString(),
      name: file?.originalname || 'unknown',
      size: file?.size || 0,
      type: file?.mimetype || 'application/octet-stream',
      url: '/files/' + file?.originalname,
      createdAt: new Date().toISOString(),
    }
    this.files.push(fileData)
    return fileData
  }

  async deleteFile(id: string) {
    console.log('Delete file:', id)
    return { success: true }
  }

  async downloadFile(id: string) {
    console.log('Download file:', id)
    return { url: '/download/' + id }
  }
}
