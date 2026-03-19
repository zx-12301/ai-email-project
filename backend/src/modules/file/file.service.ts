import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { File } from '../../entities/file.entity'
import * as fs from 'fs'
import * as path from 'path'

// 文件存储根目录
const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

// 允许的文件类型
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
  'application/zip',
  'application/x-rar-compressed',
]

// 最大文件大小 (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) {
    // 确保上传目录存在
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true })
    }
  }

  async getFiles(user: any) {
    const files = await this.fileRepository.find({
      where: { userId: user.userId },
      order: { createdAt: 'DESC' }
    })

    return files.map(f => ({
      id: f.id,
      name: f.originalName,
      size: Number(f.size),
      type: f.mimeType,
      url: `/api/file/${f.id}/download`,
      mailId: f.mailId,
      createdAt: f.createdAt
    }))
  }

  async uploadFile(file: any, user: any) {
    if (!file) {
      throw new BadRequestException('没有上传文件')
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(`文件大小超过限制 (最大 ${MAX_FILE_SIZE / 1024 / 1024}MB)`)
    }

    // 验证文件类型
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`不支持的文件类型: ${file.mimetype}`)
    }

    // 生成存储文件名
    const ext = path.extname(file.originalname)
    const storedName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`
    const filePath = path.join(UPLOAD_DIR, storedName)

    // 保存文件到磁盘
    fs.writeFileSync(filePath, file.buffer)

    // 保存文件记录到数据库
    const fileRecord = this.fileRepository.create({
      userId: user.userId,
      originalName: file.originalname,
      storedName,
      mimeType: file.mimetype,
      size: file.size,
      path: filePath
    })

    const savedFile = await this.fileRepository.save(fileRecord)

    return {
      id: savedFile.id,
      name: savedFile.originalName,
      size: Number(savedFile.size),
      type: savedFile.mimeType,
      url: `/api/file/${savedFile.id}/download`,
      createdAt: savedFile.createdAt
    }
  }

  async deleteFile(userId: string, id: string) {
    const fileRecord = await this.fileRepository.findOne({
      where: { id, userId }
    })

    if (!fileRecord) {
      throw new NotFoundException('文件不存在')
    }

    // 删除磁盘文件
    if (fs.existsSync(fileRecord.path)) {
      fs.unlinkSync(fileRecord.path)
    }

    // 删除数据库记录
    await this.fileRepository.remove(fileRecord)

    return { success: true, message: '文件已删除' }
  }

  async downloadFile(userId: string, id: string) {
    const fileRecord = await this.fileRepository.findOne({
      where: { id, userId }
    })

    if (!fileRecord) {
      throw new NotFoundException('文件不存在')
    }

    // 检查文件是否存在
    if (!fs.existsSync(fileRecord.path)) {
      throw new NotFoundException('文件不存在')
    }

    // 读取文件内容
    const fileBuffer = fs.readFileSync(fileRecord.path)

    return {
      buffer: fileBuffer,
      originalName: fileRecord.originalName,
      mimeType: fileRecord.mimeType
    }
  }

  async getFileInfo(userId: string, id: string) {
    const fileRecord = await this.fileRepository.findOne({
      where: { id, userId }
    })

    if (!fileRecord) {
      throw new NotFoundException('文件不存在')
    }

    return {
      id: fileRecord.id,
      name: fileRecord.originalName,
      size: Number(fileRecord.size),
      type: fileRecord.mimeType,
      url: `/api/file/${fileRecord.id}/download`,
      mailId: fileRecord.mailId,
      createdAt: fileRecord.createdAt
    }
  }
}
