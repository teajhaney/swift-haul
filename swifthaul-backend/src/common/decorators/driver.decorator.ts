import { Role } from '@prisma/client';
import { Roles } from './roles.decorator';

// Restricts a route to DRIVER users only.
export const DriverOnly = () => Roles(Role.DRIVER);
