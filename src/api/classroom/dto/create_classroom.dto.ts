import { IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import CreateScheduleDTO from './create_schedule.dto';

export default class CreateClassroomDTO {
  @IsNotEmpty({ message: 'ED-0600' })
  name: string;

  @IsNotEmpty({ message: 'ED-0600' })
  capacity: number;

  @IsNotEmpty({ message: 'ED-0600' })
  tuition_fee: string;

  @IsNotEmpty({ message: 'ED-0600' })
  start_date: Date;

  @IsNotEmpty({ message: 'ED-0600' })
  end_date: Date;

  @Type(() => CreateScheduleDTO)
  @IsOptional()
  schedules?: Array<CreateScheduleDTO>;
}
