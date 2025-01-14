import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsConfigService } from './aws.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AwsConfigService],
  exports: [AwsConfigService],
})
export class AwsConfigModule {}
