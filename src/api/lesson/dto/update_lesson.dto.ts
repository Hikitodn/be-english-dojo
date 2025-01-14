import { PartialType } from '@nestjs/mapped-types';
import CreateLessonDTO from './create_lesson.dto';

export default class UpdateLessonDTO extends PartialType(CreateLessonDTO) {}
