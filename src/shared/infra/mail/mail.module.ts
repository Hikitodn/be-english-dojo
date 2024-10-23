import { MailConfigService } from '@configs/mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [MailConfigService],
      useFactory: async (mailConfigService: MailConfigService) => ({
        transport: {
          host: mailConfigService.getMailHost(),
          port: mailConfigService.getMailPort(),
          secure: false,
          auth: {
            user: mailConfigService.getMailUsername(),
            pass: mailConfigService.getMailPassword(),
          },
        },
        defaults: {
          from: `"No Reply" <${mailConfigService.getMailFrom()}>`,
        },
        template: {
          dir: join(__dirname, '../../../templates/'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
  ],
})
export class MailModule {}
