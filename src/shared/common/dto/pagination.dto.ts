import { IsArray } from 'class-validator';
import { PaginationMetaDTO } from './pagination_meta.dto';

export class PaginationDTO<T> {
  @IsArray()
  readonly items: T[];

  readonly meta: PaginationMetaDTO;

  constructor(items: T[], meta: PaginationMetaDTO) {
    this.items = items;
    this.meta = meta;
  }
}
