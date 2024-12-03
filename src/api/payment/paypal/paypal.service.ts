import { PaypalConfigService } from '@configs/paypal/paypal.service';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class PaypalService {
  constructor(
    private readonly paypalConfigService: PaypalConfigService,
    private readonly httpService: HttpService,
  ) {}

  async create_order(order_id: number, amount: number) {
    try {
      const { access_token } = await this.generate_access_token();
      const url = `${this.paypalConfigService.getPaypalURL()}/v2/checkout/orders`;
      const payload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            invoice_id: order_id,
            amount: {
              currency_code: 'USD',
              value: amount,
            },
          },
        ],
      };

      return await lastValueFrom(
        this.httpService
          .post(url, JSON.stringify(payload), {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((res) => res.data)),
      );
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async capture_order(payment_id: string) {
    try {
      const { access_token } = await this.generate_access_token();
      const url = `${this.paypalConfigService.getPaypalURL()}/v2/checkout/orders/${payment_id}/capture`;

      return await lastValueFrom(
        this.httpService
          .post(url, null, {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((res) => res.data)),
      );
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async generate_access_token() {
    try {
      const url = `${this.paypalConfigService.getPaypalURL()}/v1/oauth2/token`;
      const auth = Buffer.from(
        `${this.paypalConfigService.getPaypalClientId()}:${this.paypalConfigService.getPaypalSecretKey()}`,
      ).toString('base64');
      const searchParams = new URLSearchParams();
      searchParams.append('grant_type', 'client_credentials');

      const result = await lastValueFrom(
        this.httpService
          .post(url, searchParams, {
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .pipe(map((res) => res.data)),
      );

      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
