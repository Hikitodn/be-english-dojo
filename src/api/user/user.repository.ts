import { Injectable } from '@nestjs/common';
import { Database } from '@common/database';
import { Insertable } from 'kysely';
import { profiles, user_roles, users } from '@common/types';

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
      .returning(['id', 'email'])
      .executeTakeFirstOrThrow();
  }

  async insert_profile(profile: Insertable<profiles>) {
    return await this.db
      .insertInto('profiles')
      .values(profile)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async insert_user_role(user_role: Insertable<user_roles>) {
    return await this.db
      .insertInto('user_roles')
      .values(user_role)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async find_user_role(id: number) {
    return await this.db
      .selectFrom('user_roles')
      .innerJoin('roles', 'roles.id', 'user_roles.role_id')
      .innerJoin('users', 'users.id', 'user_roles.user_id')
      .select('roles.name')
      .where('users.id', '=', id)
      .executeTakeFirst();
  }

  async find_user_profile_by_user_id(id: number) {
    return await this.db
      .selectFrom('users')
      .innerJoin('profiles', 'users.id', 'profiles.user_id')
      .selectAll()
      .where('users.id', '=', id)
      .executeTakeFirst();
  }
}
