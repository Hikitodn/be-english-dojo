import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { StudentDTO } from 'src/api/student/dto/student.dto';
import TeacherDTO from './teacher.dto';
import ScheduleDTO from './schedule.dto';
import { LessonDTO } from 'src/api/lesson/dto';

@Exclude()
export default class ClassroomDetailDTO {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  background_url: string;

  @Expose()
  capacity: number;

  @Expose()
  tuition_fee: number;

  @Transform(({ value }) => +value)
  @Expose()
  student_count: number;

  @Type(() => TeacherDTO)
  @Expose()
  teachers: Array<TeacherDTO>;

  @Type(() => ScheduleDTO)
  @Expose()
  schedules: Array<ScheduleDTO>;

  @Type(() => LessonDTO)
  @Expose()
  lessons: Array<LessonDTO>;

  @Type(() => StudentDTO)
  @Expose()
  students: Array<StudentDTO>;
}
