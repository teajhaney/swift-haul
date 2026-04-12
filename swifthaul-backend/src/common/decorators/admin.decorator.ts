import { Role } from '@prisma/client';
import { Roles } from './roles.decorator';

// Restricts a route to ADMIN users only.
// JwtAuthGuard runs globally; this just sets role metadata for RolesGuard.
export const AdminOnly = () => Roles(Role.ADMIN);
