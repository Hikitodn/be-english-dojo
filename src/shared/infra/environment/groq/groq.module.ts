import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GroqConfigService } from './groq.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [GroqConfigService],
  exports: [GroqConfigService],
})
export class GroqConfigModule {}
