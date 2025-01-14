import { AttendanceStatus } from '@common/types';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

export default class AttendanceDTO {
  @IsNotEmpty({ message: 'ED-0600' })
  classroom_id: number;

  @IsNotEmpty({ message: 'ED-0600' })
  student_id: number;

  @IsNotEmpty({ message: 'ED-0600' })
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(AttendanceStatus, { message: 'ED-0606' })
  status: AttendanceStatus;
}
