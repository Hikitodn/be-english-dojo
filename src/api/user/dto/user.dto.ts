import { Gender } from '@common/types';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDTO {
  @Expose()
  email: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  avatar_url: string;

  @Expose()
  phone_number: string;

  @Expose()
  date_of_birth: string;

  @Expose()
  gender: Gender;

  @Expose()
  address: string;

  @Expose()
  social_links: Array<string>;

  @Expose()
  classrooms: Array<string>;
}
