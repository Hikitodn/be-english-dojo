import { ROLE } from '@common/enums';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  avatar_url: string;

  @Expose()
  role: ROLE;
}
