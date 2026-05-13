import { FormEvent, useEffect, useState } from 'react';
import {
  createDefaultCreateUserForm,
  createInitialSecuritySettings,
} from '../data/adminData';
import { createAdminUser, deleteAdminUser, fetchAdminUsers } from '../data/adminApi';
import { AdminTab, AdminUser, CreateUserForm, SecuritySettings } from '../data/adminTypes';

export function useAdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('Create User');
  const [formData, setFormData] = useState<CreateUserForm>(createDefaultCreateUserForm);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(createInitialSecuritySettings);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [securitySaved, setSecuritySaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  function handleToggleUserStatus(userId: number) {
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
    setSearchTerm,
    users,
    reloadUsers: loadUsers,
  };
}
