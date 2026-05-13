import { AdminUser, CreateUserForm, SecuritySettings } from './adminTypes';

export function createDefaultCreateUserForm(): CreateUserForm {
  return {
    name: '',
    email: '',
    password: '',
    role: 'Agent',
    department: 'Customer Service',
  };
}

export function createInitialAdminUsers(): AdminUser[] {
  return [
    {
      id: 1,
      name: 'Ava Johnson',
      email: 'ava.johnson@dhl.com',
      role: 'Admin',
      department: 'Operations',
      status: 'Active',
      lastLogin: 'Today, 08:15',
    },
    {
      id: 2,
      name: 'Marcus Lee',
      email: 'marcus.lee@dhl.com',
      role: 'Manager',
      department: 'Support',
      status: 'Active',
      lastLogin: 'Yesterday, 17:42',
    },
    {
      id: 3,
      name: 'Priya Shah',
      email: 'priya.shah@dhl.com',
      role: 'Agent',
      department: 'Customer Service',
      status: 'Locked',
      lastLogin: '3 days ago',
    },
  ];
}

export function createInitialSecuritySettings(): SecuritySettings {
  return {
    mfaEnabled: true,
    ipWhitelistEnabled: false,
    auditLoggingEnabled: true,
    passwordExpiryDays: 90,
    sessionTimeoutMinutes: 30,
  };
}
