import { PasswordChangeForm } from './userSettingsTypes';

const API_BASE_URL = '/api';

export async function updateProfileApi(userId: number, avatar: string | null): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }
}

export async function changePasswordApi(userId: number, data: PasswordChangeForm): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to change password');
  }
}
