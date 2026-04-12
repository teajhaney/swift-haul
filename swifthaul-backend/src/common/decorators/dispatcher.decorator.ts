import { Role } from '@prisma/client';
import { Roles } from './roles.decorator';

// Restricts a route to DISPATCHER users only.
export const DispatcherOnly = () => Roles(Role.DISPATCHER);
