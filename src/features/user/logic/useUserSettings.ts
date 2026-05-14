import { useState, FormEvent } from 'react';
import { AuthenticatedUser } from '../../auth/authTypes';
import { PasswordChangeForm, UserSettingsTab } from '../data/userSettingsTypes';
import { updateProfileApi, changePasswordApi } from '../data/userSettingsApi';

export function useUserSettings(currentUser: AuthenticatedUser) {
  const [activeTab, setActiveTab] = useState<UserSettingsTab>('Profile');
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTabClick = (tab: UserSettingsTab) => {
    setActiveTab(tab);
    setError(null);
    setIsSuccess(false);
  };

  const handlePasswordChange = (field: keyof PasswordChangeForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Password validation: min 8 chars and at least 1 special char
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (!specialCharRegex.test(passwordForm.newPassword)) {
      setError('New password must contain at least one special character (!@#$%^&* etc.).');
      return;
    }

    setIsUpdating(true);
    try {
      await changePasswordApi(currentUser.id, passwordForm);
      setIsSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setError(null);
    setIsSuccess(false);
    setIsUpdating(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        await updateProfileApi(currentUser.id, base64);
        // We might want to update the local currentUser state here if possible, 
        // but for now we rely on the API success and maybe a reload or parent state update.
        setIsSuccess(true);
        window.location.reload(); // Hard reload to refresh avatar everywhere
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message);
      setIsUpdating(false);
    }
  };

  return {
    activeTab,
    handleTabClick,
    passwordForm,
    handlePasswordChange,
    handlePasswordSubmit,
    handleAvatarUpload,
    isSuccess,
    error,
    isUpdating
  };
}
