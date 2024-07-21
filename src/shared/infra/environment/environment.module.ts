import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/shared/config/app.config';
import databaseConfig from 'src/shared/config/database.config';
import { DatabaseConfigModule } from './database/database.module';
import { AppConfigModule } from './app/app.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
      envFilePath: ['.env', `.env.${ENV}`],
      isGlobal: true,
    }),
    AppConfigModule,
    DatabaseConfigModule,
  ],
})
export class EnvironmentConfigModule {}
