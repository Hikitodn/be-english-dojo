import {
  Catch,
  UnauthorizedException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorService } from '../error.service';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorService: ErrorService) {}

  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    //const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errors = exception.getResponse();
    //const stackTrace = exception.stack;

    res.status(status).json(this.errorService.custom_message(errors));
  }
}
