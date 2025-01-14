import { IPaginationMeta } from '@common/intefaces';
import { Expose } from 'class-transformer';

export class PaginationMetaDTO {
  @Expose()
  readonly page: number;

  readonly per_page: number;

  readonly item_count: number;

  readonly page_count: number;

  readonly has_previous_page: boolean;

  readonly has_next_page: boolean;

  constructor({ paginationOptionsDTO, item_count }: IPaginationMeta) {
    this.page = paginationOptionsDTO.page;
    this.per_page = paginationOptionsDTO.per_page;
    this.item_count = item_count;
    this.page_count = Math.ceil(this.item_count / this.per_page);
    this.has_previous_page = this.page > 1;
    this.has_next_page = this.page < this.page_count;
  }
}
