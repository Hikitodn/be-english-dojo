import { EnvironmentConfigModule } from '@configs/environment.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';
import { LangModule } from './lang/lang.module';
import { JwtModule } from '@nestjs/jwt';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    EnvironmentConfigModule,
    DatabaseModule,
    RedisModule,
    MailModule,
    LangModule,
    AwsModule,
    JwtModule.register({
      global: true,
    }),
  ],
})
export class InfraModule {}
