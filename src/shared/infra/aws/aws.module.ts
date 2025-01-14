import { Global, Module } from '@nestjs/common';
import { UploadFileServiceS3 } from './aws.service';

@Global()
@Module({
  providers: [UploadFileServiceS3],
  exports: [UploadFileServiceS3],
})
export class AwsModule {}
