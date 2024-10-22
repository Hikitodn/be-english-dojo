import {
  Catch,
  UnprocessableEntityException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorService } from '../error.service';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorService: ErrorService) {}

  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    //const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errors = exception.getResponse();
    //const stackTrace = exception.stack;

    res.status(status).json(this.errorService.custom_message(errors));
  }
}
