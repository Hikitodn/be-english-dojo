import {
  Catch,
  UnauthorizedException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    //const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errors = exception.getResponse();
    const message =
      exception.message === 'Unauthorized' ? 'ED-0500' : exception.message;
    //const stackTrace = exception.stack;
    const i18n = I18nContext.current(host);

    res.status(status).json(Object.assign(errors, i18n?.t(`error.${message}`)));
  }
}
