import { IAwsConfig } from '@configs/infra.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsConfigService implements IAwsConfig {
  constructor(private readonly configService: ConfigService) {}

  public getAwsAccessKeyId(): string {
    return this.configService.getOrThrow('aws.access_key_id');
  }

  public getAwsAcesssSecretKey(): string {
    return this.configService.getOrThrow('aws.secret_access_key');
  }

  public getAwsBucketName(): string {
    return this.configService.getOrThrow('aws.bucket_name');
  }

  public getAwsRegion(): string {
    return this.configService.getOrThrow('aws.region');
  }
}
