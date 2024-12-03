import { IsNotEmpty, IsOptional } from 'class-validator';

export default class CreateLessonDTO {
  @IsNotEmpty({ message: 'ED-0600' })
  topic: string;

  @IsOptional()
  note?: string;

  @IsNotEmpty({ message: 'ED-0600' })
  classroom_id: number;
}
