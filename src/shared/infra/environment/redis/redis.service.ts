import { IRedisConfig } from '@configs/infra.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService implements IRedisConfig {
  constructor(private configService: ConfigService) {}

  public getRedisHost(): string {
    return this.configService.getOrThrow<string>('redis.host');
  }

  public getRedisPort(): number {
    return this.configService.getOrThrow<number>('redis.port');
  }
}
