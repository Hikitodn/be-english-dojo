import {
  Catch,
  BadRequestException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch(BadRequestException)
export class BadRequestExceptionFilter
  implements ExceptionFilter<BadRequestException>
{
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    //const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errors = exception.getResponse();
    const message =
      exception.message === 'Bad Request' ? 'ED-0200' : exception.message;
    //const stackTrace = exception.stack;
    const i18n = I18nContext.current(host);

    res.status(status).json(Object.assign(errors, i18n?.t(`error.${message}`)));
  }
}
