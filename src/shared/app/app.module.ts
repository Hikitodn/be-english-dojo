import { Module } from '@nestjs/common';
import { ApiModule } from 'src/api/api.module';
import { DatabaseModule } from './database/database.module';
import { EnvironmentModule } from './environment/environment.module';

@Module({
  imports: [EnvironmentModule, DatabaseModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
