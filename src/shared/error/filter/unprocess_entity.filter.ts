import {
  Catch,
  UnprocessableEntityException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    //const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errors = exception.getResponse();
    const message: ValidationError[] = instanceToPlain(errors)['message'];
    //const stackTrace = exception.stack;
    const i18n = I18nContext.current(host);

    const field = message
      .map((err: ValidationError) =>
        err.constraints
          ? Object.values(err.constraints).map((value: string) =>
              Object.assign({ field: err.property }, i18n?.t(`error.${value}`)),
            )
          : null,
      )
      .flat();

    res.status(status).json(Object.assign(errors, { message: field }));
  }
}
