import { Injectable } from '@nestjs/common';
import { UploadFileServiceAbstract } from './aws.abstract';
import { AwsConfigService } from '@configs/aws/aws.service';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class UploadFileServiceS3 implements UploadFileServiceAbstract {
  private s3_client: S3Client;
  constructor(private readonly awsConfigService: AwsConfigService) {
    this.s3_client = new S3Client({
      region: this.awsConfigService.getAwsRegion(),
      credentials: {
        accessKeyId: this.awsConfigService.getAwsAccessKeyId(),
        secretAccessKey: this.awsConfigService.getAwsAcesssSecretKey(),
      },
    });
  }

  async uploadFileToPublicBucket(
    path: string,
    { file, file_name }: { file: Express.Multer.File; file_name: string },
  ) {
    const bucket_name = this.awsConfigService.getAwsBucketName();
    const key = `${path}/${Date.now().toString()}-${file_name}`;

    try {
      await this.s3_client.send(
        new PutObjectCommand({
          Bucket: bucket_name,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
          ContentLength: file.size, // calculate length of buffer
        }),
      );
    } catch (error) {
      console.log(error);
    }

    return {
      key: key,
      url: `https://${bucket_name}.s3.amazonaws.com/${key}`,
    };
  }
}
