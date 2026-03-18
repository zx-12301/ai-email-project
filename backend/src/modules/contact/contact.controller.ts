import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common'
import { ContactService } from './contact.service'

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  async getContacts() {
    return this.contactService.getContacts({ id: 'user1' })
  }

  @Get(':id')
  async getContact(@Param('id') id: string) {
    return this.contactService.getContactById(id)
  }

  @Post()
  async createContact(@Body() data: any) {
    return this.contactService.createContact(data)
  }

  @Put(':id')
  async updateContact(@Param('id') id: string, @Body() data: any) {
    return this.contactService.updateContact(id, data)
  }

  @Delete(':id')
  async deleteContact(@Param('id') id: string) {
    return this.contactService.deleteContact(id)
  }
}
