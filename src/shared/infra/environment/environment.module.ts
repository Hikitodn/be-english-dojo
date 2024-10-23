import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/shared/config/app.config';
import databaseConfig from 'src/shared/config/database.config';
import { DatabaseConfigModule } from './database/database.module';
import { AppConfigModule } from './app/app.module';
import { JwtConfigModule } from './jwt/jwt.module';
import jwtConfig from 'src/shared/config/jwt.config';
import { RedisConfigModule } from './redis/redis.module';
import redisConfig from 'src/shared/config/redis.config';
import mailConfig from 'src/shared/config/mail.config';
import { MailConfigModule } from './mail/mail.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, jwtConfig, redisConfig, mailConfig],
      envFilePath: ['.env', `.env.${ENV}`],
    }),
    AppConfigModule,
    DatabaseConfigModule,
    JwtConfigModule,
    RedisConfigModule,
    MailConfigModule,
  ],
})
export class EnvironmentConfigModule {}
