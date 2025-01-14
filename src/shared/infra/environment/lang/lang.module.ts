import { Global, Module } from '@nestjs/common';
import { LangConfigService } from './lang.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [LangConfigService],
  exports: [LangConfigService],
})
export class LangConfigModule {}
