import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';
import { UserModule } from '../user/user.module';
import { MailConsumer } from './queue/mail.consumer';

@Module({
  imports: [
    JwtModule,
    UserModule,
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  controllers: [MailController],
  providers: [MailService, MailConsumer],
  exports: [MailService, BullModule],
})
export class MailModule {}
