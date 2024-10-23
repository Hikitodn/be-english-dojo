import { EnvironmentConfigModule } from '@configs/environment.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [EnvironmentConfigModule, DatabaseModule, RedisModule, MailModule],
})
export class InfraModule {}
