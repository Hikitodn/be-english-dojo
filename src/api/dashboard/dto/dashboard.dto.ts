import { Exclude, Expose, Type } from 'class-transformer';
import { ClassroomDTO } from 'src/api/classroom/dto';
import { StudentDTO } from 'src/api/student/dto/student.dto';

@Exclude()
export class DashboardDTO {
  @Expose()
  student_count: number;

  @Expose()
  teacher_count: number;

  @Expose()
  classroom_count: number;

  @Expose()
  today_classroom_count: number;

  @Type(() => ClassroomDTO)
  @Expose()
  today_classrooms: Array<ClassroomDTO>;

  @Type(() => StudentDTO)
  @Expose()
  absent_students: Array<StudentDTO>;
}
