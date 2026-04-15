import type { Role } from '@prisma/client';

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  avatarUrl: string | null;
  isActive: boolean;
  inviteAccepted: boolean;
  createdAt: Date;
}

export interface PaginatedUsers {
  data: UserListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
