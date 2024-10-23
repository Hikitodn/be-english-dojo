import { Global, Module } from '@nestjs/common';
import { MailConfigService } from './mail.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MailConfigService],
  exports: [MailConfigService],
})
export class MailConfigModule {}
