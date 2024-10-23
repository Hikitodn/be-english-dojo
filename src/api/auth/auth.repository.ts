import { Injectable } from '@nestjs/common';
import { Database } from '@common/database';
import { Insertable } from 'kysely';
import { access_tokens, refresh_tokens } from '@common/types';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: Database) {}

  async insert_access_token(access_token: Insertable<access_tokens>) {
    return await this.db
      .insertInto('access_tokens')
      .values(access_token)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async insert_refresh_token(refresh_token: Insertable<refresh_tokens>) {
    return await this.db
      .insertInto('refresh_tokens')
      .values(refresh_token)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
