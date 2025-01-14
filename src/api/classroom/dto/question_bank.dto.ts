import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import CreateQuestionOptionDTO from './create_question_option.dto';

export default class QuestionBankDTO {
  @IsNotEmpty({ message: 'ED-0600' })
  question: string;

  @Type(() => CreateQuestionOptionDTO)
  @IsNotEmpty({ message: 'ED-0600' })
  answers: Array<CreateQuestionOptionDTO>;
}
