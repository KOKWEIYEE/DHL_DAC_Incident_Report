import React, { useState } from 'react';
import { AdminPage } from './features/admin/presentation/AdminPage';
import { LoginPage } from './features/auth/login';
import { AuthenticatedUser } from './features/auth/authTypes';
import { UserPage } from './features/user/presentation/UserPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);

  function handleLogin(user: AuthenticatedUser) {
    setCurrentUser(user);
  }

  function handleLogout() {
    setCurrentUser(null);
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser.roleName.toLowerCase() === 'admin') {
    return <AdminPage currentUser={currentUser} onLogout={handleLogout} />;
  }

  return <UserPage currentUser={currentUser} onLogout={handleLogout} />;
}
