import { IsNotEmpty } from 'class-validator';

export default class LoginDTO {
  @IsNotEmpty({ message: 'ED-0600' })
  email: string;

  @IsNotEmpty({ message: 'ED-0600' })
  password: string;
}
