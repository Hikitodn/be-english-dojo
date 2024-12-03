import { Exclude, Expose, Type } from 'class-transformer';
import LessonResourceDTO from './lesson_resource.dto';

@Exclude()
export default class LessonDTO {
  @Expose()
  topic: string;

  @Expose()
  note: string;

  @Type(() => LessonResourceDTO)
  @Expose()
  files: Array<LessonResourceDTO>;
}
