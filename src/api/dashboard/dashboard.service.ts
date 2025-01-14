import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
import { plainToInstance } from 'class-transformer';
import { DashboardDTO } from './dto/dashboard.dto';
import { ClassroomRepository } from '../classroom/classroom.repository';
import { StudentRepository } from '../student/student.repository';
import { get_day } from '@common/helper';
import { StudentDTO } from '../student/dto/student.dto';
import { ClassroomDTO } from '../classroom/dto';
import { JwtPayload } from '@common/intefaces';

@Injectable()
export class DashboardService {
  constructor(
    private readonly dashboardRepository: DashboardRepository,
    private readonly classroomRepository: ClassroomRepository,
    private readonly studentRepository: StudentRepository,
  ) {}

  async dashboard(payload: JwtPayload): Promise<DashboardDTO> {
    if (!payload.sub) throw new UnauthorizedException();

    const dashboard = await this.dashboardRepository.dashboard(+payload.sub);

    const classrooms =
      await this.classroomRepository.find_all_classrooms_today_by_user_id(
        +payload.sub,
        get_day(),
      );

    const students =
      await this.studentRepository.find_absent_students_today_by_user_id(
        +payload.sub,
      );

    return plainToInstance(DashboardDTO, {
      ...dashboard,
      today_classrooms: classrooms.map((value) =>
        plainToInstance(ClassroomDTO, value),
      ),
      absent_students: students.map((value) =>
        plainToInstance(StudentDTO, value),
      ),
    });
  }
}
