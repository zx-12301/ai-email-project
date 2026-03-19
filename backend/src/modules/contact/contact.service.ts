import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity'

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ) {}

  async getContacts(user: any) {
    const contacts = await this.contactRepository.find({
      where: { userId: user.userId },
      order: { createdAt: 'DESC' }
    })
    return contacts
  }

  async getContactById(userId: string, id: string) {
    const contact = await this.contactRepository.findOne({
      where: { id, userId }
    })
    if (!contact) {
      throw new NotFoundException('联系人不存在')
    }
    return contact
  }

  async createContact(userId: string, data: Partial<Contact>) {
    const contact = this.contactRepository.create({
      userId,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone,
      company: data.company,
      position: data.position,
      tags: data.tags || [],
      avatar: data.avatar,
      notes: data.notes,
      type: data.type || 'personal'
    })
    return await this.contactRepository.save(contact)
  }

  async updateContact(userId: string, id: string, data: Partial<Contact>) {
    const contact = await this.getContactById(userId, id)

    // 更新字段
    if (data.name !== undefined) contact.name = data.name
    if (data.email !== undefined) contact.email = data.email
    if (data.phone !== undefined) contact.phone = data.phone
    if (data.company !== undefined) contact.company = data.company
    if (data.position !== undefined) contact.position = data.position
    if (data.tags !== undefined) contact.tags = data.tags
    if (data.avatar !== undefined) contact.avatar = data.avatar
    if (data.notes !== undefined) contact.notes = data.notes
    if (data.type !== undefined) contact.type = data.type

    return await this.contactRepository.save(contact)
  }

  async deleteContact(userId: string, id: string) {
    const contact = await this.getContactById(userId, id)
    await this.contactRepository.remove(contact)
    return { success: true, message: '联系人已删除' }
  }
}
