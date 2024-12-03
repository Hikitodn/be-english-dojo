import { Expose, Exclude } from 'class-transformer';

@Exclude()
export default class AuthDTO {
  @Expose()
  access_token: string;

  @Expose()
  access_token_expire_time: number;

  @Expose()
  refresh_token: string;

  @Expose()
  refresh_token_expire_time: number;

  @Expose()
  token_type: string;
}
