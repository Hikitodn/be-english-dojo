import { Module } from '@nestjs/common';
import { DatabaseConfigModule } from '@configs/database/database.module';
import { KyselyModule } from './kysely/kysely.module';
import { DatabaseConfigService } from '@configs/database/database.service';
import { config } from './config';

@Module({
  imports: [
    KyselyModule.forRootAsync({
      imports: [DatabaseConfigModule],
      inject: [DatabaseConfigService],
      useFactory: config,
    }),
  ],
})
export class DatabaseModule {}
