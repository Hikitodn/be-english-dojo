import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaypalConfigService } from './paypal.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PaypalConfigService],
  exports: [PaypalConfigService],
})
export class PaypalConfigModule {}
