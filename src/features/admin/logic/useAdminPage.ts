import { FormEvent, useEffect, useState } from 'react';
import { AuthenticatedUser } from '../../auth/authTypes';
import {
  createDefaultCreateUserForm,
  createInitialSecuritySettings,
} from '../data/adminData';
import { createAdminUser, deleteAdminUser, fetchAdminUsers } from '../data/adminApi';
import { AdminTab, AdminUser, CreateUserForm, SecuritySettings } from '../data/adminTypes';

export function useAdminPage(currentUser?: AuthenticatedUser) {
  const [activeTab, setActiveTab] = useState<AdminTab>('Tickets');
  const [formData, setFormData] = useState<CreateUserForm>(createDefaultCreateUserForm);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(createInitialSecuritySettings);
  const [createSuccess, setCreateSuccess] = useState(false);
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

    await createAdminUser(formData);
    await loadUsers();
    setCreateSuccess(true);
    setFormData(createDefaultCreateUserForm());

    window.setTimeout(() => {
      setCreateSuccess(false);
    }, 2500);
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
