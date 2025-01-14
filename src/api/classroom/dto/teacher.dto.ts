import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class TeacherDTO {
  @Expose()
  id: number;

  @Expose()
  full_name: string;
}
