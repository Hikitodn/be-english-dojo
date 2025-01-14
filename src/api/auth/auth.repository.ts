import { Injectable } from '@nestjs/common';
import { Database } from '@common/database';
import { Insertable, Updateable } from 'kysely';
import { access_tokens, refresh_tokens } from '@common/types';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: Database) {}

  async insert_access_token(access_token: Insertable<access_tokens>) {
    return await this.db
      .insertInto('access_tokens')
      .values(access_token)
      .returning('id')
      .executeTakeFirstOrThrow();
  }

  async insert_refresh_token(refresh_token: Insertable<refresh_tokens>) {
    return await this.db
      .insertInto('refresh_tokens')
      .values(refresh_token)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async find_access_token_by_id(id: number) {
    return await this.db
      .selectFrom('access_tokens')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async find_refresh_token_by_access_token_id(id: number) {
    return await this.db
      .selectFrom('refresh_tokens')
      .innerJoin(
        'access_tokens',
        'refresh_tokens.access_token_id',
        'access_tokens.id',
      )
      .where('access_tokens.id', '=', id)
      .selectAll()
      .executeTakeFirst();
  }

  async delete_access_token_by_id(id: number) {
    return await this.db
      .deleteFrom('access_tokens')
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async update_refresh_token(
    id: number,
    refresh_token: Updateable<refresh_tokens>,
  ) {
    return await this.db
      .updateTable('refresh_tokens')
      .set(refresh_token)
      .where('access_token_id', '=', id)
      .executeTakeFirstOrThrow();
  }
}
