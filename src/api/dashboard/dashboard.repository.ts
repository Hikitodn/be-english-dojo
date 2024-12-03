import { Database } from '@common/database';
import { get_day } from '@common/helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardRepository {
  constructor(private readonly db: Database) {}

  async dashboard(id: number) {
    return await this.db
      .selectFrom('user_classrooms')
      .innerJoin('schedules', (join) =>
        join
          .onRef('schedules.classroom_id', '=', 'user_classrooms.classroom_id')
          .on('schedules.day_of_week', '=', get_day()),
      )
      .select(({ fn }) => [
        fn
          .count<number>('user_classrooms.student_id')
          .distinct()
          .as('student_count'),
        fn
          .count<number>('user_classrooms.teacher_id')
          .distinct()
          .as('teacher_count'),
        fn
          .count<number>('user_classrooms.classroom_id')
          .distinct()
          .as('classroom_count'),
        fn
          .count<number>('user_classrooms.classroom_id')
          .as('today_classroom_count'),
      ])
      .where((eb) =>
        eb.or([
          eb('user_classrooms.student_id', '=', id),
          eb('user_classrooms.teacher_id', '=', id),
        ]),
      )
      .executeTakeFirst();
  }
}
