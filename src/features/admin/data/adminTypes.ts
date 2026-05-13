export type AdminTab = 'Create User' | 'Manage User' | 'Security';

export interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Locked';
  lastLogin: string;
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  ipWhitelistEnabled: boolean;
  auditLoggingEnabled: boolean;
  passwordExpiryDays: number;
  sessionTimeoutMinutes: number;
}
