import { IJwtConfig } from '@configs/infra.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService implements IJwtConfig {
  constructor(private configService: ConfigService) {}

  public getAccessTokenSecret(): string {
    return this.configService.getOrThrow('jwt.access_token_secret');
  }

  public getAccessTokenExpireTime(): number {
    return +this.configService.getOrThrow('jwt.access_token_expire_time');
  }

  public getRefreshTokenSecret(): string {
    return this.configService.getOrThrow('jwt.refresh_token_secret');
  }

  public getRefreshTokenExpireTime(): number {
    return +this.configService.getOrThrow('jwt.refresh_token_expire_time');
  }
}
