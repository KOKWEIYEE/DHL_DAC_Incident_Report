import React, { useState } from 'react';
import { AdminPage } from './features/admin/presentation/AdminPage';
import { LoginPage } from './features/auth/login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function handleLogin() {
    setIsAuthenticated(true);
  }

  function handleLogout() {
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <AdminPage onLogout={handleLogout} />;
}
