import { AuthenticatedUser } from './authTypes';

interface LoginResponse {
  user: AuthenticatedUser;
}

export async function loginUser(username: string, password: string): Promise<AuthenticatedUser> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const payload = (await response.json()) as LoginResponse | { message?: string };

  if (!response.ok) {
    throw new Error('message' in payload && payload.message ? payload.message : 'Unable to sign in.');
  }

  return (payload as LoginResponse).user;
}
