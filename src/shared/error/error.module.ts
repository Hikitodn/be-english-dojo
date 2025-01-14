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
import { ValidationError } from 'class-validator';
import { UnprocessableEntityExceptionFilter } from './filter/unprocess_entity.filter';
import { AllExceptionFilter } from './filter/all.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
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
      useClass: UnprocessableEntityExceptionFilter,
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
