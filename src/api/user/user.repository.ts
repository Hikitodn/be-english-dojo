import { Injectable } from '@nestjs/common';
import { Database } from '@common/database';

@Injectable()
export class UserRepository {
  constructor(private readonly db: Database) {}

  async find_user_by_email(email: string) {
    return await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirstOrThrow();
  }
}
