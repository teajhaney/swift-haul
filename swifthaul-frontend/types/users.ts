import { UserRole } from './settings';

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  inviteAccepted: boolean;
  createdAt: string;
}

export interface PaginatedUsers {
  data: UserListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ListUsersQuery {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
}

export interface UpdateUserStatusPayload {
  isActive: boolean;
}
