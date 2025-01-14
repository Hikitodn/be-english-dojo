//import { IsEmailExisted } from '@common/decorator/is_email_existed.decorator';
import { Gender } from '@common/types';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export default class RegisterDTO {
  @IsNotEmpty({ message: 'ED-0600' })
  @IsEmail({}, { message: 'ED-0601' })
  //@IsEmailExisted({ message: 'ED-0603' })
  email: string;

  @IsNotEmpty({ message: 'ED-0600' })
  @IsString({ message: 'ED-0604' })
  @IsStrongPassword({ minSymbols: 0 }, { message: 'ED-0602' })
  password: string;

  @IsNotEmpty({ message: 'ED-0600' })
  @IsString({ message: 'ED-0604' })
  first_name: string;

  @IsNotEmpty({ message: 'ED-0600' })
  @IsString({ message: 'ED-0604' })
  last_name: string;

  @IsNotEmpty({ message: 'ED-0600' })
  @IsString({ message: 'ED-0604' })
  phone_number: string;

  @IsNotEmpty({ message: 'ED-0600' })
  @IsDate({ message: 'ED-0605' })
  @Transform(({ value }) => new Date(value))
  date_of_birth: Date;

  @IsNotEmpty({ message: 'ED-0600' })
  @IsEnum(Gender, { message: 'ED-0606' })
  gender: Gender;
}
