import { IDatabaseConfig } from '@configs/infra.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService implements IDatabaseConfig {
  constructor(private configService: ConfigService) {}

  public getDatabaseType(): string {
    return this.configService.getOrThrow('database.type');
  }

  public getDatabaseHost(): string {
    return this.configService.getOrThrow('database.host');
  }

  public getDatabasePort(): number {
    return +this.configService.getOrThrow('database.port');
  }

  public getDatabaseUser(): string {
    return this.configService.getOrThrow('database.user');
  }

  public getDatabasePassword(): string {
    return this.configService.getOrThrow('database.password');
  }

  public getDatabaseName(): string {
    return this.configService.getOrThrow('database.name');
  }
}
