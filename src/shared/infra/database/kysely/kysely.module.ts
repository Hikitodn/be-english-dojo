import { Global, Module } from '@nestjs/common';
import { ConfigurableDatabaseModule } from './kysely.module-definition';
import { KyselyProvider } from './kysely.provider';
import { Database } from '@common/database';

@Global()
@Module({
  exports: [Database],
  providers: [...KyselyProvider],
})
export class KyselyModule extends ConfigurableDatabaseModule {}
