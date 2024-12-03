import { Module } from '@nestjs/common';
import { DatabaseConfigModule } from '@configs/database/database.module';
import { KyselyModule } from './kysely/kysely.module';
import { DatabaseConfigService } from '@configs/database/database.service';
import { KyselyOption } from './kysely/kysely.option';

@Module({
  imports: [
    KyselyModule.forRootAsync({
      imports: [DatabaseConfigModule],
      inject: [DatabaseConfigService],
      useFactory: (
        databaseConfigService: DatabaseConfigService,
      ): KyselyOption => {
        return {
          host: databaseConfigService.getDatabaseHost(),
          port: databaseConfigService.getDatabasePort(),
          database: databaseConfigService.getDatabaseName(),
          user: databaseConfigService.getDatabaseUser(),
          password: databaseConfigService.getDatabasePassword(),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
