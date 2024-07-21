import { IDatabaseConfig } from '@configs/infra.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService implements IDatabaseConfig {
  constructor(private configService: ConfigService) {}

  public getDatabaseType(): string {
    return this.configService.getOrThrow<string>('database.type');
  }

  public getDatabaseHost(): string {
    return this.configService.getOrThrow<string>('database.host');
  }

  public getDatabasePort(): number {
    return this.configService.getOrThrow<number>('database.port');
  }

  public getDatabaseUser(): string {
    return this.configService.getOrThrow<string>('database.user');
  }

  public getDatabasePassword(): string {
    return this.configService.getOrThrow<string>('database.password');
  }

  public getDatabaseName(): string {
    return this.configService.getOrThrow<string>('database.name');
  }
}
