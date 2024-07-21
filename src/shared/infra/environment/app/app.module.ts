import { Module } from '@nestjs/common';
import { AppConfigService } from './app.service';

@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
