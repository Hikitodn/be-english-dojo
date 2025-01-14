import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class ClassroomDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  background_url: string;

  @Expose()
  teacher_name: string;
}
