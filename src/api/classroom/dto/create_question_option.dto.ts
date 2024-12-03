import { IsNotEmpty } from 'class-validator';

export default class CreateQuestionOptionDTO {
  @IsNotEmpty({ message: 'ED-0600' })
  text: string;

  @IsNotEmpty({ message: 'ED-0600' })
  is_correct: boolean;
}
