import { Database } from '@common/database';
import { lessons } from '@common/types';
import { Injectable } from '@nestjs/common';
import { Insertable, Updateable } from 'kysely';

@Injectable()
export class LessonRepository {
  constructor(private readonly db: Database) {}

  async create_lesson(lesson: Insertable<lessons>) {
    return await this.db
      .insertInto('lessons')
      .values(lesson)
      .clearReturning()
      .executeTakeFirstOrThrow();
  }

  async update_lesson_by_id(id: number, lesson: Updateable<lessons>) {
    return await this.db
      .updateTable('lessons')
      .set(lesson)
      .where('id', '=', id)
      .clearReturning()
      .executeTakeFirstOrThrow();
  }

  async delete_lesson_by_id(id: number) {
    return await this.db
      .deleteFrom('lessons')
      .where('id', '=', id)
      .clearReturning()
      .executeTakeFirstOrThrow();
  }
}
