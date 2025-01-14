import { Database } from '@common/database';
import { PaginationOptionsDTO } from '@common/dto/pagination_options.dto';
import {
  attendances,
  classrooms,
  payments,
  PaymentStatus,
  question_options,
  questions,
  schedules,
  tuition_histories,
  user_classrooms,
} from '@common/types';
import { Injectable } from '@nestjs/common';
import { Insertable, sql, Updateable } from 'kysely';
import { jsonArrayFrom } from 'kysely/helpers/postgres';

@Injectable()
export class ClassroomRepository {
  constructor(private readonly db: Database) {}

  async find_user_classroom_name_by_user_id(id: number) {
    return await this.db
      .selectFrom('user_classrooms')
      .innerJoin('classrooms', 'user_classrooms.classroom_id', 'classrooms.id')
      .select('classrooms.name')
      .where((eb) =>
        eb.or([
          eb('user_classrooms.teacher_id', '=', id),
          eb('user_classrooms.student_id', '=', id),
        ]),
      )
      .execute();
  }

  async find_all_classrooms_today_by_user_id(
    id: number,
    day_of_week?: number,
    pagination?: PaginationOptionsDTO,
  ) {
    let query = this.db
      .selectFrom('classrooms')
      .innerJoin(
        'user_classrooms',
        'classrooms.id',
        'user_classrooms.classroom_id',
      )
      .innerJoin('users', 'users.id', 'user_classrooms.teacher_id')
      .leftJoin('schedules', 'classrooms.id', 'schedules.classroom_id')
      .select((eb) => [
        'classrooms.id',
        'classrooms.name',
        eb
          .selectFrom('users')
          .whereRef('users.id', '=', 'user_classrooms.teacher_id')
          .select(({ ref }) => [
            sql<string>`concat(${ref('first_name')}, ' ', ${ref('last_name')}  )`.as(
              'full_name',
            ),
          ])
          .as('teacher_name'),
      ])
      .groupBy([
        'classrooms.id',
        'user_classrooms.teacher_id',
        'user_classrooms.student_id',
      ])
      .where((eb) =>
        eb.or([
          eb('user_classrooms.student_id', '=', id),
          eb('user_classrooms.teacher_id', '=', id),
        ]),
      );

    if (pagination) {
      query = query
        .limit(pagination.per_page)
        .offset(pagination.offset)
        .orderBy('classrooms.name', pagination.order);
    }

    if (day_of_week) {
      query = query.where('schedules.day_of_week', '=', day_of_week);
    }

    return await query.execute();
  }

  async find_one_classroom_by_id(id: number) {
    return await this.db
      .selectFrom('classrooms')
      .innerJoin(
        'user_classrooms',
        'user_classrooms.classroom_id',
        'classrooms.id',
      )
      .select(({ eb, fn }) => [
        'classrooms.id',
        'classrooms.code',
        'classrooms.name',
        'classrooms.background_url',
        'classrooms.capacity',
        'classrooms.tuition_fee',
        fn.count<number>('user_classrooms.student_id').as('student_count'),
        jsonArrayFrom(
          eb
            .selectFrom('users')
            .whereRef('users.id', '=', 'user_classrooms.teacher_id')
            .select(({ ref }) => [
              'users.id',
              sql<string>`concat(${ref('first_name')}, ' ', ${ref('last_name')}  )`.as(
                'full_name',
              ),
            ]),
        ).as('teachers'),
        jsonArrayFrom(
          eb
            .selectFrom('schedules')
            .whereRef('schedules.classroom_id', '=', 'classrooms.id')
            .select([
              'schedules.day_of_week',
              'schedules.start_time',
              'schedules.end_time',
            ])
            .orderBy('schedules.id'),
        ).as('schedules'),
        jsonArrayFrom(
          eb
            .selectFrom('lessons')
            .innerJoin(
              'lesson_resources',
              'lesson_resources.lesson_id',
              'lessons.id',
            )
            .whereRef('lessons.classroom_id', '=', 'classrooms.id')
            .select((eb) => [
              'lessons.topic',
              'lessons.note',
              jsonArrayFrom(
                eb
                  .selectFrom('lesson_resources')
                  .whereRef('lessons.id', '=', 'lesson_resources.lesson_id')
                  .select([
                    'lesson_resources.name',
                    'lesson_resources.type',
                    'lesson_resources.url',
                  ]),
              ).as('files'),
            ]),
        ).as('lessons'),
        jsonArrayFrom(
          eb
            .selectFrom('users')
            .whereRef('users.id', '=', 'user_classrooms.student_id')
            .select(({ ref }) => [
              'users.id',
              'user_classrooms.absent_count',
              sql<string>`concat(${ref('first_name')}, ' ', ${ref('last_name')}  )`.as(
                'full_name',
              ),
              'users.avatar_url',
            ]),
        ).as('students'),
      ])
      .groupBy(['classrooms.id', 'user_classrooms.id'])
      .where('classrooms.id', '=', id)
      .executeTakeFirst();
  }

  async insert_question(question: Insertable<questions>) {
    return await this.db
      .insertInto('questions')
      .values(question)
      .returning('id')
      .executeTakeFirstOrThrow();
  }

  async insert_question_option(question_option: Insertable<question_options>) {
    return await this.db
      .insertInto('question_options')
      .values(question_option)
      .returning('id')
      .executeTakeFirstOrThrow();
  }

  async insert_tuition_history(
    tuition_histories: Insertable<tuition_histories>,
  ) {
    return await this.db.transaction().execute(async (trx) => {
      return trx
        .insertInto('tuition_histories')
        .values(tuition_histories)
        .returning('id')
        .executeTakeFirstOrThrow();
    });
  }

  async insert_payment(payment: Insertable<payments>) {
    return await this.db
      .insertInto('payments')
      .values(payment)
      .clearReturning()
      .executeTakeFirstOrThrow();
  }

  async find_tuition_history_by_order_id(order_id: string) {
    return await this.db
      .selectFrom('tuition_histories')
      .innerJoin(
        'payments',
        'tuition_histories.id',
        'payments.tuition_history_id',
      )
      .select(['tuition_histories.id', 'tuition_histories.method'])
      .where('payments.order_id', '=', order_id)
      .executeTakeFirst();
  }

  async update_tuition_status(tuition_id: number, status: PaymentStatus) {
    return await this.db
      .updateTable('tuition_histories')
      .set({ status: status })
      .where('tuition_histories.id', '=', tuition_id)
      .executeTakeFirstOrThrow();
  }

  async update_payment_transaction(order_id: string, transaction: object) {
    return await this.db
      .updateTable('payments')
      .set({ transaction: transaction })
      .where('order_id', '=', order_id)
      .executeTakeFirstOrThrow();
  }

  async insert_classroom(classroom: Insertable<classrooms>) {
    return await this.db
      .insertInto('classrooms')
      .values(classroom)
      .returning('id')
      .executeTakeFirstOrThrow();
  }

  async update_classroom_by_id(id: number, classroom: Updateable<classrooms>) {
    return await this.db
      .updateTable('classrooms')
      .set(classroom)
      .where('id', '=', id)
      .clearReturning()
      .executeTakeFirstOrThrow();
  }

  async delete_classroom_by_id(id: number) {
    return await this.db
      .deleteFrom('classrooms')
      .where('id', '=', id)
      .clearReturning()
      .executeTakeFirstOrThrow();
  }

  async insert_schedule(schedule: Insertable<schedules>) {
    return await this.db
      .insertInto('schedules')
      .values(schedule)
      .clearReturning()
      .executeTakeFirstOrThrow();
  }

  async insert_user_classroom(user_classroom: Insertable<user_classrooms>) {
    return await this.db
      .insertInto('user_classrooms')
      .values(user_classroom)
      .clearReturning()
      .executeTakeFirstOrThrow();
  }

  async check_attendance(attendance: Insertable<attendances>) {
    return await this.db
      .insertInto('attendances')
      .values(attendance)
      .clearReturning()
      .executeTakeFirstOrThrow();
  }

  async increase_absent_count(id: number) {
    return await this.db
      .updateTable('user_classrooms')
      .set((eb) => ({
        absent_count: eb('absent_count', '+', 1),
      }))
      .where('student_id', '=', id)
      .clearReturning()
      .executeTakeFirstOrThrow();
  }

  async get_all_order_by_user_id(
    id: number,
    pagination?: PaginationOptionsDTO,
  ) {
    let query = this.db
      .selectFrom('tuition_histories')
      .innerJoin(
        'classrooms',
        'classrooms.id',
        'tuition_histories.classroom_id',
      )
      .innerJoin(
        'user_classrooms',
        'user_classrooms.classroom_id',
        'tuition_histories.classroom_id',
      )
      .select((eb) => [
        'tuition_histories.id',
        'tuition_histories.amount',
        'tuition_histories.method',
        'tuition_histories.paid_date',
        'classrooms.name as classroom_name',
        eb
          .selectFrom('users')
          .whereRef('users.id', '=', 'user_classrooms.student_id')
          .select(({ ref }) => [
            sql<string>`concat(${ref('first_name')}, ' ', ${ref('last_name')}  )`.as(
              'full_name',
            ),
          ])
          .as('student_name'),
      ])
      .where((eb) =>
        eb.or([
          eb('user_classrooms.student_id', '=', id),
          eb('user_classrooms.teacher_id', '=', id),
        ]),
      );

    if (pagination) {
      query = query
        .limit(pagination.per_page)
        .offset(pagination.offset)
        .orderBy('tuition_histories.created_at', pagination.order);
    }

    return await query.execute();
  }

  async update_user_classroom(user_classroom: Updateable<user_classrooms>) {
    return await this.db
      .updateTable('user_classrooms')
      .set(user_classroom)
      .clearReturning()
      .execute();
  }

  async is_student_in_teacher_list(student_id: number, teacher_id: number) {
    const student = await this.db
      .selectFrom('user_classrooms')
      .select('id')
      .where((eb) =>
        eb('user_classrooms.student_id', '=', student_id).and(
          'user_classrooms.teacher_id',
          '=',
          teacher_id,
        ),
      )
      .executeTakeFirst();

    if (student) return true;

    return false;
  }

  async is_student_in_classroom(
    student_id: number,
    teacher_id: number,
    classroom_id: number,
  ) {
    const classroom = await this.db
      .selectFrom('user_classrooms')
      .select('id')
      .where((eb) =>
        eb('user_classrooms.student_id', '=', student_id)
          .and('user_classrooms.teacher_id', '=', teacher_id)
          .and('user_classrooms.classroom_id', '=', classroom_id),
      )
      .executeTakeFirst();

    if (classroom) return true;

    return false;
  }

  async get_test(id: number) {
    return await this.db
      .selectFrom('tests')
      .innerJoin('test_questions', 'test_questions.test_id', 'tests.id')
      .innerJoin('questions', 'questions.id', 'test_questions.question_id')
      .where('tests.id', '=', id)
      .select((eb) => [
        'tests.id',
        'tests.name',
        'tests.description',
        jsonArrayFrom(
          eb
            .selectFrom('questions')
            .whereRef('test_questions.question_id', '=', 'questions.id'),
        ).as('exams'),
      ])
      .execute();
  }
}
