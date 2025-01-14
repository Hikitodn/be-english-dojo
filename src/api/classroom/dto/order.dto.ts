import { format_month } from '@common/helper';
import { PaymentMethod } from '@common/types';
import { Expose, Exclude, Transform } from 'class-transformer';

@Exclude()
export default class OrderDTO {
  @Expose()
  id: number;

  @Expose()
  amount: string;

  @Expose()
  method: PaymentMethod;

  @Expose()
  @Transform(({ value }) => format_month(value))
  paid_date: string;

  @Expose()
  classroom_name: string;

  @Expose()
  student_name: string;
}
