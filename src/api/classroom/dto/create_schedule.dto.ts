import { IsNotEmpty } from 'class-validator';

export default class CreateScheduleDTO {
  @IsNotEmpty({ message: 'ED-0600' })
  day_of_week: number;

  @IsNotEmpty({ message: 'ED-0600' })
  start_time: string;

  @IsNotEmpty({ message: 'ED-0600' })
  end_time: string;
}
