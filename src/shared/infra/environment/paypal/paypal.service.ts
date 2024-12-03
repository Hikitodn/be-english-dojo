import { IPaypalConfig } from '@configs/infra.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalConfigService implements IPaypalConfig {
  constructor(private configService: ConfigService) {}

  public getPaypalClientId(): string {
    return this.configService.getOrThrow('paypal.client_id');
  }

  public getPaypalSecretKey(): string {
    return this.configService.getOrThrow('paypal.secret_key');
  }

  public getPaypalURL(): string {
    return this.configService.getOrThrow('paypal.url');
  }
}
