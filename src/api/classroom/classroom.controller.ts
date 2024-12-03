import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { PaginationDTO } from '@common/dto/pagination.dto';
import { PaginationOptionsDTO } from '@common/dto/pagination_options.dto';
import { CurrentUser } from '@common/decorator/current_user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateOrderDTO } from '../payment/dto/create_order.dto';
import {
  AttendanceDTO,
  ClassroomDetailDTO,
  ClassroomDTO,
  CreateClassroomDTO,
  QuestionBankDTO,
  UpdateClassroomDTO,
} from './dto';
import { JwtPayload } from '@common/intefaces';
import { Role } from '@common/types';
import { RolePermission } from '@common/decorator/role.decorator';
import BulkStudentDTO from './dto/bulk_student.dto';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async find_all(
    @Query('date') date: Date | undefined,
    @Query() query: PaginationOptionsDTO,
    @CurrentUser() payload: JwtPayload,
  ): Promise<PaginationDTO<ClassroomDTO>> {
    return await this.classroomService.find_all(date, query, payload);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async find_one(@Param('id') id: number): Promise<ClassroomDetailDTO> {
    return await this.classroomService.find_one(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create-order')
  async create_order(
    @Body() body: CreateOrderDTO,
    @CurrentUser() payload: JwtPayload,
  ) {
    return await this.classroomService.create_tuition(body, payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':order_id/capture')
  async capture_order(@Param('order_id') order_id: string) {
    return await this.classroomService.capture_order(order_id);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':order_id/cancel')
  async cancel_order(@Param('order_id') order_id: string) {
    return await this.classroomService.cancel_order(order_id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('files-convert')
  @UseInterceptors(FilesInterceptor('files'))
  async files_convert(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.classroomService.files_convert(files);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('question-bank')
  async question_bank(@Body() body: QuestionBankDTO[]) {
    return await this.classroomService.question_bank(body);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @CurrentUser() payload: JwtPayload,
    @Body() body: CreateClassroomDTO,
  ): Promise<void> {
    return await this.classroomService.create(payload, body);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateClassroomDTO,
  ): Promise<void> {
    return await this.classroomService.update(id, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @RolePermission(Role.TEACHER)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.classroomService.delete(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('check-attendance')
  async check_attendance(@Body() attendance: AttendanceDTO[]): Promise<void> {
    return await this.classroomService.check_attendance(attendance);
  }

  @HttpCode(HttpStatus.OK)
  @Post('add-student')
  async add_student(
    @CurrentUser() payload: JwtPayload,
    @Body('email') email: string,
  ): Promise<void> {
    return await this.classroomService.add_student(payload, email);
  }

  @HttpCode(HttpStatus.OK)
  @Get('order/tuition')
  async getAllOrder(
    @Query() query: PaginationOptionsDTO,
    @CurrentUser() payload: JwtPayload,
  ) {
    return await this.classroomService.get_all_order(query, payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':classroom_id/add-student')
  async add_student_to_classroom(
    @CurrentUser() payload: JwtPayload,
    @Param('classroom_id') classroom_id: number,
    @Body() bulk_student: BulkStudentDTO[],
  ) {
    return await this.classroomService.add_student_to_classroom(
      payload,
      classroom_id,
      bulk_student,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('test/:id')
  async start_test(@Param('id') id: number) {
    return await this.classroomService.get_test(id);
  }
}
