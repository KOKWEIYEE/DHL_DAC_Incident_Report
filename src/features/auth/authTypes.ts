export interface AuthenticatedUser {
  id: number;
  username: string;
  fullName: string;
  roleId: number;
  roleName: string;
  department?: string;
  avatar?: string;
  createdAt: string;
}
