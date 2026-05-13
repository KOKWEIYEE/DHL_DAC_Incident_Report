import { AdminUser, CreateUserForm, SecuritySettings } from './adminTypes';

export function createDefaultCreateUserForm(): CreateUserForm {
  return {
    fullName: '',
    username: '',
    password: '',
    roleName: 'user',
  };
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
