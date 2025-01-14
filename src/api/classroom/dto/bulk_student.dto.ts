import { StudentStatus } from '@common/types';
import { IsEnum, IsNotEmpty } from 'class-validator';

export default class BulkStudentDTO {
  @IsNotEmpty({ message: 'ED-0600' })
  id: number;

  @IsNotEmpty({ message: 'ED-0600' })
  @IsEnum(StudentStatus, { message: 'ED-0606' })
  status: StudentStatus;
}
