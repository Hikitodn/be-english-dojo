import { Provider } from '@nestjs/common';
import { DATABASE_CONNECTION } from './kysely.module-definition';
import { KyselyOption } from './kysely.option';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from '@common/database';

export const KyselyProvider: Provider[] = [
  {
    provide: Database,
    inject: [DATABASE_CONNECTION],
    useFactory: (databaseOptions: KyselyOption) => {
      const dialect = new PostgresDialect({
        pool: new Pool({
          host: databaseOptions.host,
          port: databaseOptions.port,
          user: databaseOptions.user,
          password: databaseOptions.password,
          database: databaseOptions.database,
        }),
      });

      return new Database({
        dialect,
        log: ['query', 'error'],
      });
    },
  },
];
