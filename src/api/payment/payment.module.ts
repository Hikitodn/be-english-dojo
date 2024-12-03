import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CodService } from './cod/cod.service';
import { PaypalService } from './paypal/paypal.service';

@Module({
  imports: [HttpModule],
  providers: [CodService, PaypalService],
  exports: [CodService, PaypalService],
})
export class PaymentModule {}
