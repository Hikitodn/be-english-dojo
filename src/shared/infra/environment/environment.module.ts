import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigModule } from './database/database.module';
import { AppConfigModule } from './app/app.module';
import { JwtConfigModule } from './jwt/jwt.module';
import { RedisConfigModule } from './redis/redis.module';
import { MailConfigModule } from './mail/mail.module';
import { LangConfigModule } from './lang/lang.module';
import {
  AppConfig,
  AwsConfig,
  DatabaseConfig,
  GroqConfig,
  JwtConfig,
  LangConfig,
  MailConfig,
  PaypalConfig,
  RedisConfig,
} from 'src/shared/config';
import { GroqConfigModule } from './groq/groq.module';
import { PaypalConfigModule } from './paypal/paypal.module';
import { AwsConfigModule } from './aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        AppConfig,
        DatabaseConfig,
        JwtConfig,
        RedisConfig,
        MailConfig,
        LangConfig,
        GroqConfig,
        PaypalConfig,
        AwsConfig,
      ],
      envFilePath: ['.env'],
    }),
    AppConfigModule,
    DatabaseConfigModule,
    JwtConfigModule,
    RedisConfigModule,
    MailConfigModule,
    LangConfigModule,
    GroqConfigModule,
    PaypalConfigModule,
    AwsConfigModule,
  ],
})
export class EnvironmentConfigModule {}
