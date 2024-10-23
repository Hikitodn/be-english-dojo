import { Injectable } from '@nestjs/common';
import { Database } from '@common/database';
import { Insertable } from 'kysely';
import { profiles, users } from '@common/types';

@Injectable()
export class UserRepository {
  constructor(private readonly db: Database) {}

  async update_user_mail_verify(id: number) {
    return await this.db
      .updateTable('users')
      .set({
        is_verified: true,
      })
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async find_user_by_id(id: number) {
    return await this.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async find_user_by_email(email: string) {
    return await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }

  async insert_user(user: Insertable<users>) {
    return await this.db
      .insertInto('users')
      .values(user)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async insert_profile(profile: Insertable<profiles>) {
    return await this.db
      .insertInto('profiles')
      .values(profile)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
