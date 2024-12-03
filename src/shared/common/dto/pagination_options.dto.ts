import { PaginationOrder } from '@common/enums';
import { Type, Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationOptionsDTO {
  @IsEnum(PaginationOrder)
  @Transform(({ value }) => value.toLowerCase())
  @IsOptional()
  readonly order: PaginationOrder = PaginationOrder.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly per_page: number = 10;

  get offset(): number {
    return (this.page - 1) * this.per_page;
  }
}
