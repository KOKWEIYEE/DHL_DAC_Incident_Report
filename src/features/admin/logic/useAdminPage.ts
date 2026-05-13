import { FormEvent, useState } from 'react';
import {
  createDefaultCreateUserForm,
  createInitialAdminUsers,
  createInitialSecuritySettings,
} from '../data/adminData';
import { AdminTab, AdminUser, CreateUserForm, SecuritySettings } from '../data/adminTypes';

export function useAdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('Create User');
  const [formData, setFormData] = useState<CreateUserForm>(createDefaultCreateUserForm);
  const [users, setUsers] = useState<AdminUser[]>(createInitialAdminUsers);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(createInitialSecuritySettings);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [securitySaved, setSecuritySaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextUserId = users.length === 0 ? 1 : Math.max(...users.map((user) => user.id)) + 1;
    const createdUser: AdminUser = {
      id: nextUserId,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: 'Active',
      lastLogin: 'Never',
    };

    setUsers((currentUsers) => [createdUser, ...currentUsers]);
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

  function handleRemoveUser(userId: number) {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
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
    securitySaved,
    securitySettings,
    setSearchTerm,
    users,
    setActiveTab,
  };
}
