import { SetMetadata } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';
// import { UserRole } from '../users/entities/user.entity';

export enum UserRole {
  Manufacturer = 'Manufacturer',
  Owner = 'Owner',
  Company = 'Company',
  Individual = 'Individual',
  Admin = 'Admin',
}

registerEnumType(UserRole, { name: 'UserRole' });

export type AllowedRoles = keyof typeof UserRole | 'Login' | 'Any';

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
