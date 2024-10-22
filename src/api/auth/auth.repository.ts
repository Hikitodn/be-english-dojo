import { Injectable } from '@nestjs/common';
import { Database } from '@common/database';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: Database) {}

  async insert_access_token(user_id: number, expired_at: Date) {
    return await this.db
      .insertInto('access_tokens')
      .values({
        user_id: user_id,
        expired_at: expired_at,
      })
      .returning(['id'])
      .executeTakeFirstOrThrow();
  }

  async insert_refresh_token(
    user_id: number,
    access_token_id: number,
    expired_at: Date,
  ) {
    return await this.db
      .insertInto('refresh_tokens')
      .values({
        user_id: user_id,
        access_token_id: access_token_id,
        expired_at: expired_at,
      })
      .executeTakeFirstOrThrow();
  }
}
