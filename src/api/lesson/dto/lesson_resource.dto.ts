import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class LessonResourceDTO {
  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  url: string;
}
