import { ConfigurableModuleBuilder } from '@nestjs/common';
import { KyselyOption } from './kysely.option';

export const {
  ConfigurableModuleClass: ConfigurableDatabaseModule,
  MODULE_OPTIONS_TOKEN: DATABASE_CONNECTION,
} = new ConfigurableModuleBuilder<KyselyOption>()
  .setClassMethodName('forRoot')
  .build();
