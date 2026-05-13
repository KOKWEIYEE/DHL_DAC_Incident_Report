export type AdminTab = 'Create User' | 'Manage User' | 'Security';

export interface CreateUserForm {
  fullName: string;
  username: string;
  password: string;
  department: string;
  roleName: string;
}

export interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  department: string;
  roleName: string;
  createdAt: string;
  status: 'Active' | 'Locked';
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  ipWhitelistEnabled: boolean;
  auditLoggingEnabled: boolean;
  passwordExpiryDays: number;
  sessionTimeoutMinutes: number;
}
