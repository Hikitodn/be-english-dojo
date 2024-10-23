import { Gender } from '@common/types';
import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date_of_birth: Date;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
