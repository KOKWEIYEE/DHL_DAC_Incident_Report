import { FormEvent, useEffect, useState } from 'react';
import { AuthenticatedUser } from '../../auth/authTypes';
import {
  createDefaultCreateUserForm,
  createInitialSecuritySettings,
} from '../data/adminData';
import { createAdminUser, deleteAdminUser, fetchAdminUsers, updateAdminUser } from '../data/adminApi';
import { AdminTab, AdminUser, CreateUserForm, SecuritySettings } from '../data/adminTypes';

export function useAdminPage(currentUser?: AuthenticatedUser) {
  const [activeTab, setActiveTab] = useState<AdminTab>('Tickets');
  const [formData, setFormData] = useState<CreateUserForm>(createDefaultCreateUserForm);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(createInitialSecuritySettings);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [securitySaved, setSecuritySaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [userActionMessage, setUserActionMessage] = useState('');

  useEffect(() => {
    void loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoadingUsers(true);

    try {
      const fetchedUsers = await fetchAdminUsers();
      setUsers(fetchedUsers);
    } finally {
      setIsLoadingUsers(false);
    }
  }

  async function requirePasswordConfirmation(actionLabel: string): Promise<boolean> {
    if (!currentUser) {
      setUserActionMessage('Missing current user context. Please sign in again.');
      return false;
    }

    const password = window.prompt(`Enter your password to ${actionLabel}:`);
    if (!password) {
      return false;
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: currentUser.username, password }),
    });

    if (!response.ok) {
      setUserActionMessage('Password verification failed.');
      window.setTimeout(() => {
        setUserActionMessage('');
      }, 2500);
      return false;
    }

    return true;
  }

  function handleTabClick(tab: AdminTab) {
    return () => {
      setActiveTab(tab);
    };
  }

  function handleCreateFieldChange(field: keyof CreateUserForm, value: string) {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreateSuccess(false);

    // Password validation: min 8 chars and at least 1 special char
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (formData.password.length < 8) {
      setCreateError('Password must be at least 8 characters long.');
      return;
    }
    if (!specialCharRegex.test(formData.password)) {
      setCreateError('Password must contain at least one special character (!@#$%^&* etc.).');
      return;
    }

    try {
      await createAdminUser(formData);
      await loadUsers();
      setCreateSuccess(true);
      setFormData(createDefaultCreateUserForm());

      window.setTimeout(() => {
        setCreateSuccess(false);
      }, 2500);
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create user');
    }
  }

  async function handleToggleUserStatus(userId: number) {
    const confirmed = await requirePasswordConfirmation('change this user status');
    if (!confirmed) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user.id !== userId) {
          return user;
        }

        return {
          ...user,
          status: user.status === 'Active' ? 'Locked' : 'Active',
        };
      }),
    );
  }

  async function handleRemoveUser(userId: number) {
    const confirmed = await requirePasswordConfirmation('delete this user');
    if (!confirmed) {
      return;
    }

    await deleteAdminUser(userId);
    await loadUsers();
    setUserActionMessage('User removed from the database.');

    window.setTimeout(() => {
      setUserActionMessage('');
    }, 2500);
  }

  async function handleUpdateUser(userId: number, field: 'roleName' | 'department', value: string) {
    try {
      await updateAdminUser(userId, { [field]: value });
      await loadUsers();
      setUserActionMessage(`User ${field === 'roleName' ? 'role' : 'department'} updated.`);
      window.setTimeout(() => {
        setUserActionMessage('');
      }, 2500);
    } catch (err: any) {
      alert('Failed to update user: ' + err.message);
    }
  }

  async function handleResetPassword(userId: number) {
    const newPassword = window.prompt('Enter new temporary password for this user:');
    if (!newPassword) return;

    // Password validation: min 8 chars and at least 1 special char
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    if (!specialCharRegex.test(newPassword)) {
      alert('Password must contain at least one special character (!@#$%^&* etc.).');
      return;
    }

    const confirmed = await requirePasswordConfirmation('reset this user\'s password');
    if (!confirmed) return;

    try {
      const { resetAdminUserPassword } = await import('../data/adminApi');
      await resetAdminUserPassword(userId, newPassword);
      setUserActionMessage('User password has been reset successfully.');
      window.setTimeout(() => {
        setUserActionMessage('');
      }, 2500);
    } catch (err: any) {
      alert('Failed to reset password: ' + err.message);
    }
  }

  function handleSecurityToggle(field: keyof Pick<SecuritySettings, 'mfaEnabled' | 'ipWhitelistEnabled' | 'auditLoggingEnabled'>) {
    setSecuritySettings((currentSettings) => ({
      ...currentSettings,
      [field]: !currentSettings[field],
    }));
  }

  function handleSecurityFieldChange(field: 'passwordExpiryDays' | 'sessionTimeoutMinutes', value: number) {
    setSecuritySettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));
  }

  function handleSecuritySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSecuritySaved(true);

    window.setTimeout(() => {
      setSecuritySaved(false);
    }, 2500);
  }

  return {
    activeTab,
    createSuccess,
    createError,
    formData,
    departmentFilter,
    handleCreateFieldChange,
    handleCreateUser,
    handleRemoveUser,
    handleSecurityFieldChange,
    handleSecuritySubmit,
    handleSecurityToggle,
    handleTabClick,
    handleToggleUserStatus,
    handleUpdateUser,
    handleResetPassword,
    searchTerm,
    isLoadingUsers,
    userActionMessage,
    securitySaved,
    securitySettings,
    setDepartmentFilter,
    setSearchTerm,
    setActiveTab,
    users,
    reloadUsers: loadUsers,
  };
}
