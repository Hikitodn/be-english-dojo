import { Injectable } from '@nestjs/common';
import { LessonRepository } from './lesson.repository';
import { CreateLessonDTO, UpdateLessonDTO } from './dto';

@Injectable()
export class LessonService {
  constructor(private readonly lessonRepository: LessonRepository) {}

  async create(body: CreateLessonDTO) {
    this.lessonRepository.create_lesson({
      topic: body.topic,
      note: body.note,
      classroom_id: body.classroom_id,
    });
  }

  async update(id: number, body: UpdateLessonDTO) {
    this.lessonRepository.update_lesson_by_id(id, {
      topic: body.topic,
      note: body.note,
    });
  }

  async delete(id: number) {
    this.lessonRepository.delete_lesson_by_id(id);
  }
}
