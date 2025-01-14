import { IMailConfig } from '@configs/infra.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailConfigService implements IMailConfig {
  constructor(private configService: ConfigService) {}

  public getMailHost(): string {
    return this.configService.getOrThrow('mail.host');
  }

  public getMailPort(): number {
    return +this.configService.getOrThrow('mail.port');
  }

  public getMailUsername(): string {
    return this.configService.getOrThrow('mail.username');
  }

  public getMailPassword(): string {
    return this.configService.getOrThrow('mail.password');
  }

  public getMailFrom(): string {
    return this.configService.getOrThrow('mail.from');
  }

  public getMailURL(): string {
    return this.configService.getOrThrow('mail.url');
  }

  public getMailSecret(): string {
    return this.configService.getOrThrow('mail.secret');
  }

  public getMailExpireTime(): number {
    return +this.configService.getOrThrow('mail.expire_time');
  }
}
