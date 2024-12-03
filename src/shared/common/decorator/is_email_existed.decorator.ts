import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UserRepository } from 'src/api/user/user.repository';

@ValidatorConstraint({ name: 'IsEmailExisted', async: true })
@Injectable()
export class IsEmailExistedConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(email: string) {
    try {
      const user = await this.userRepository.find_user_by_email(email);

      if (user) return false;
    } catch (e) {
      return false;
    }

    return true;
  }
}

export function IsEmailExisted(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsEmailExisted',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistedConstraint,
    });
  };
}
