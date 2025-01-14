import { Role } from '@common/types';
import { SetMetadata } from '@nestjs/common';

export const ROLE_PERMISSION_KEY = 'role_permission';
export const RolePermission = (...role: Role[]) =>
  SetMetadata(ROLE_PERMISSION_KEY, role);
