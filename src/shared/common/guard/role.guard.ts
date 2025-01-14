import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@common/types';
import { UserRepository } from 'src/api/user/user.repository';
import { RolePermission } from '@common/decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private reflector: Reflector,
  ) {}

  match_roles(roles: string[], user_role: string) {
    return roles.some((role) => role === user_role);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Role[]>(
      RolePermission,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();

    const payload = request.user;

    const role = await this.userRepository.find_user_role(payload.sub);

    if (!role || this.match_roles(roles, role.name))
      throw new ForbiddenException();

    return true;
  }
}
