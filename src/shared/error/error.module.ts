import {
  Module,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { BadRequestExceptionFilter } from './filter/bad_request.filter';
import { ForbiddenExceptionFilter } from './filter/forbidden.filter';
import { NotFoundExceptionFilter } from './filter/not_found.filter';
import { UnauthorizedExceptionFilter } from './filter/unauthorized.filter';
import { InternalServerExceptionFilter } from './filter/internal_server_error.filter';
import { ValidationError } from 'class-validator';
import { ErrorService } from './error.service';

@Module({
  providers: [
    ErrorService,
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ForbiddenExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: InternalServerExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory: (errors: ValidationError[]) =>
          new UnprocessableEntityException(errors),
      }),
    },
  ],
})
export class ErrorModule {}
