import { Injectable } from '@nestjs/common'

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
  private contacts: Contact[] = [
    { id: '1', name: '张三', email: 'zhangsan@example.com', phone: '13800138000', tags: ['工作'] },
    { id: '2', name: '李四', email: 'lisi@example.com', phone: '13900139000', tags: ['朋友'] },
  ]

  async getContacts(user: any) {
    return this.contacts
  }

  async getContactById(id: string) {
    return this.contacts.find((c) => c.id === id)
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
    this.contacts.push(contact)
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
