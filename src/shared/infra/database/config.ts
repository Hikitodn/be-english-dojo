import { DatabaseConfigService } from '@configs/database/database.service';
import { KyselyOption } from './kysely/kysely.option';

export function config(
  databaseConfigService: DatabaseConfigService,
): KyselyOption {
  return {
    host: databaseConfigService.getDatabaseHost(),
    port: databaseConfigService.getDatabasePort(),
    database: databaseConfigService.getDatabaseName(),
    user: databaseConfigService.getDatabaseUser(),
    password: databaseConfigService.getDatabasePassword(),
  };
}
