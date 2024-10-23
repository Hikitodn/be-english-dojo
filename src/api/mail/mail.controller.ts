import { Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  verify(@Query('token') token: string): Promise<void> {
    return this.mailService.verify(token);
  }
}
