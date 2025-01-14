import { format_day_of_week } from '@common/helper';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export default class ScheduleDTO {
  @Transform(({ value }) => format_day_of_week(value))
  @Expose()
  day_of_week: string;

  @Expose()
  start_time: string;

  @Expose()
  end_time: string;
}
