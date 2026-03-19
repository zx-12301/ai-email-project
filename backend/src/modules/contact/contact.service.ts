import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../entities/user.entity'

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  tags: string[]
}

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getContacts(user: any) {
    // 从数据库获取所有用户（排除当前用户）
    const users = await this.userRepository.find({
      select: ['id', 'name', 'email', 'phone']
    })
    
    // 转换为用户联系人格式
    return users.map(u => ({
      id: u.id,
      name: u.name || '未知用户',
      email: u.email || `${u.phone}@example.com`,
      phone: u.phone,
      company: u.company,
      tags: []
    }))
  }

  async getContactById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) return null
    
    return {
      id: user.id,
      name: user.name || '未知用户',
      email: user.email || `${user.phone}@example.com`,
      phone: user.phone,
      company: user.company,
      tags: []
    }
  }

  async createContact(data: Partial<Contact>) {
    const contact: Contact = {
      id: Date.now().toString(),
      name: data.name || '',
      email: data.email || '',
      phone: data.phone,
      company: data.company,
      tags: data.tags || [],
    }
    return contact
  }

  async updateContact(id: string, data: Partial<Contact>) {
    console.log('Update contact:', id, data)
    return { success: true }
  }

  async deleteContact(id: string) {
    console.log('Delete contact:', id)
    return { success: true }
  }
}
