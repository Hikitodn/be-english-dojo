import { IAppConfig } from '@configs/infra.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService implements IAppConfig {
  constructor(private configService: ConfigService) {}

  public getAppURL(): string {
    return this.configService.getOrThrow('app.url');
  }

  public getAppName(): string {
    return this.configService.getOrThrow('app.name');
  }

  public getAppPort(): number {
    return +this.configService.getOrThrow('app.port');
  }
}
