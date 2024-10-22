import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorService {
  custom_message(err: string | object, options = null) {
    return Object.assign(err, options);
  }
}
