import * as jwt from 'jsonwebtoken';
import { PaginationOptionsDTO } from './dto/pagination_options.dto';

export interface JwtPayload extends jwt.JwtPayload {}

export interface IPaginationMeta {
  paginationOptionsDTO: PaginationOptionsDTO;
  item_count: number;
}
