import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/shared/config/app.config';
import databaseConfig from 'src/shared/config/database.config';
import { DatabaseConfigModule } from './database/database.module';
import { AppConfigModule } from './app/app.module';
import { JwtConfigModule } from './jwt/jwt.module';
import jwtConfig from 'src/shared/config/jwt.config';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, jwtConfig],
      envFilePath: ['.env', `.env.${ENV}`],
      isGlobal: true,
    }),
    AppConfigModule,
    DatabaseConfigModule,
    JwtConfigModule,
  ],
})
export class EnvironmentConfigModule {}
