import { PaymentMethod } from '@common/types';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDTO {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  method: PaymentMethod;

  @IsOptional()
  note?: string;

  @IsNotEmpty()
  classroom_id: number;
}
