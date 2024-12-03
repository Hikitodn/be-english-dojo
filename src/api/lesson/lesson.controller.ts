import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDTO, UpdateLessonDTO } from './dto';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() body: CreateLessonDTO) {
    return await this.lessonService.create(body);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: number, body: UpdateLessonDTO) {
    return await this.lessonService.update(id, body);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.lessonService.delete(id);
  }
}
