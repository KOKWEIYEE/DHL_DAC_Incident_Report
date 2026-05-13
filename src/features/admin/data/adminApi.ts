import { AdminUser, CreateUserForm } from './adminTypes';

interface ApiUserRecord {
  id: number;
  username: string;
  fullName: string;
  department: string;
  roleName: string;
  createdAt: string;
}

interface UsersResponse {
  users: ApiUserRecord[];
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const response = await fetch('/api/users');
  const payload = (await response.json()) as UsersResponse | { message?: string };

  if (!response.ok) {
    throw new Error('message' in payload && payload.message ? payload.message : 'Unable to load users.');
  }

  return (payload as UsersResponse).users.map((user) => ({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    department: user.department ?? 'Unassigned',
    roleName: user.roleName,
    createdAt: new Date(user.createdAt).toLocaleString(),
    status: 'Active',
  }));
}

export async function createAdminUser(formData: CreateUserForm): Promise<void> {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      department: formData.department,
      roleName: formData.roleName,
    }),
  });

  const payload = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? 'Unable to create user.');
  }
}

export async function deleteAdminUser(userId: number): Promise<void> {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'DELETE',
  });

  const payload = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? 'Unable to delete user.');
  }
}
