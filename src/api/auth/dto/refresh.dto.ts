import { Expose, Exclude } from 'class-transformer';

@Exclude()
export default class RefreshDTO {
  @Expose()
  access_token: string;

  @Expose()
  access_token_expire_time: string;

  @Expose()
  token_type: string;
}
