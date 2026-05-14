export interface ProfileUpdateForm {
  avatar: string | null;
}

export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type UserSettingsTab = 'Profile' | 'Security';
