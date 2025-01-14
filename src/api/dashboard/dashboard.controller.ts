import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '@common/decorator/current_user.decorator';
import { DashboardDTO } from './dto/dashboard.dto';
import { JwtPayload } from '@common/intefaces';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async dashboard(@CurrentUser() payload: JwtPayload): Promise<DashboardDTO> {
    return await this.dashboardService.dashboard(payload);
  }
}
