import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class StudentDTO {
  @Expose()
  id: number;

  @Expose()
  full_name: string;

  @Expose()
  avatar_url: string;

  @Expose()
  absent_count: number;
}
