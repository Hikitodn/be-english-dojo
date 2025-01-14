import { Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from '@common/decorator/public.decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verify')
  verify(@Query('token') token: string): Promise<void> {
    return this.mailService.verify(token);
  }
}
