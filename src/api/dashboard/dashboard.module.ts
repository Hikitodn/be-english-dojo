import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DashboardRepository } from './dashboard.repository';
import { ClassroomModule } from '../classroom/classroom.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [ClassroomModule, StudentModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
