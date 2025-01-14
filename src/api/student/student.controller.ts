import { Controller, Get, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CurrentUser } from '@common/decorator/current_user.decorator';
import { PaginationOptionsDTO } from '@common/dto/pagination_options.dto';
import { JwtPayload } from '@common/intefaces';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async find_all(
    @CurrentUser() payload: JwtPayload,
    @Query() query: PaginationOptionsDTO,
  ) {
    return await this.studentService.find_all(payload, query);
  }
}
