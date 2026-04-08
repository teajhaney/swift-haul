export type UserRole   = 'ADMIN' | 'DISPATCHER' | 'DRIVER';
export type MemberStatus = 'ACTIVE' | 'INVITED' | 'DEACTIVATED';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: MemberStatus;
  joinedDate: string;
  /** Short description shown on mobile cards */
  title: string;
  avatarInitials: string;
  /** True for the currently logged-in user */
  isCurrentUser?: boolean;
}
