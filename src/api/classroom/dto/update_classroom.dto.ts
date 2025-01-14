import { PartialType } from '@nestjs/mapped-types';
import CreateClassroomDTO from './create_classroom.dto';

export default class UpdateClassroomDTO extends PartialType(
  CreateClassroomDTO,
) {}
