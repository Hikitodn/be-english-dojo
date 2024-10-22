import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class TokenDTO {
  @Expose()
  access_token: string;

  @Expose()
  access_token_expire_time: string;

  @Expose()
  refresh_token: string;

  @Expose()
  refresh_token_expire_time: string;

  @Expose()
  token_type: string;
}
