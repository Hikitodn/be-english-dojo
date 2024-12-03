import { Database } from '@common/database';
import { PaginationOptionsDTO } from '@common/dto/pagination_options.dto';
import { current_datetime } from '@common/helper';
import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';

@Injectable()
export class StudentRepository {
  constructor(private readonly db: Database) {}

  async find_all_student_by_user_id(
    id: number,
    pagination: PaginationOptionsDTO,
  ) {
    return await this.db
      .selectFrom('user_classrooms')
      .innerJoin('users', 'users.id', 'user_classrooms.student_id')
      .select(({ ref }) => [
        'users.id',
        sql<string>`concat(${ref('first_name')}, ' ', ${ref('last_name')}  )`.as(
          'full_name',
        ),
        'users.avatar_url',
        'user_classrooms.absent_count',
      ])
      .where((eb) =>
        eb.or([
          eb('user_classrooms.teacher_id', '=', id),
          eb('user_classrooms.student_id', '=', id),
        ]),
      )
      .groupBy(['users.id', 'user_classrooms.absent_count'])
      .limit(pagination.per_page)
      .offset(pagination.offset)
      .execute();
  }

  async find_absent_students_today_by_user_id(id: number) {
    return await this.db
      .selectFrom('users')
      .innerJoin('user_classrooms', 'user_classrooms.student_id', 'users.id')
      .innerJoin(
        'attendances',
        'attendances.classroom_id',
        'user_classrooms.classroom_id',
      )
      .select(({ ref }) => [
        'users.id',
        sql<string>`concat(${ref('first_name')}, ' ', ${ref('last_name')}  )`.as(
          'full_name',
        ),
        'users.avatar_url',
      ])
      .where((eb) =>
        eb
          .or([
            eb('user_classrooms.teacher_id', '=', id),
            eb('user_classrooms.student_id', '=', id),
          ])
          .and('attendances.status', '=', 'ABSENT')
          .and('attendances.created_at', '>=', current_datetime()),
      )
      .execute();
  }
}
