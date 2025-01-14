import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationGuard } from '@common/guard/auth.guard';
import { ResponseInterceptor } from '@common/interceptor/response.interceptor';
import { ClassroomModule } from './classroom/classroom.module';
import { StudentModule } from './student/student.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MulterModule } from '@nestjs/platform-express';
import { LessonModule } from './lesson/lesson.module';
import { MailModule } from './mail/mail.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';
//import { RolesGuard } from '@common/guard/role.guard';

@Module({
  imports: [
    AuthModule,
    ClassroomModule,
    StudentModule,
    DashboardModule,
    LessonModule,
    MailModule,
    PaymentModule,
    UserModule,
    MulterModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    //{
    //  provide: APP_GUARD,
    //  useClass: RolesGuard,
    //},
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class ApiModule {}
