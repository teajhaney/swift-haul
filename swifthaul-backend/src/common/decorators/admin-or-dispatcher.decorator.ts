import { Role } from '@prisma/client';
import { Roles } from './roles.decorator';

// Restricts a route to ADMIN or DISPATCHER users.
// Used for order management, driver listing, and assignment endpoints.
export const AdminOrDispatcher = () => Roles(Role.ADMIN, Role.DISPATCHER);
