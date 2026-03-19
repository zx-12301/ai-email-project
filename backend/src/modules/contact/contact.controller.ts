import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ContactService } from './contact.service'

@Controller('contact')
@UseGuards(AuthGuard('jwt'))
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  async getContacts(@Request() req: any) {
    return this.contactService.getContacts(req.user)
  }

  @Get(':id')
  async getContact(@Request() req: any, @Param('id') id: string) {
    return this.contactService.getContactById(req.user.userId, id)
  }

  @Post()
  async createContact(@Request() req: any, @Body() data: any) {
    return this.contactService.createContact(req.user.userId, data)
  }

  @Put(':id')
  async updateContact(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.contactService.updateContact(req.user.userId, id, data)
  }

  @Delete(':id')
  async deleteContact(@Request() req: any, @Param('id') id: string) {
    return this.contactService.deleteContact(req.user.userId, id)
  }
}
