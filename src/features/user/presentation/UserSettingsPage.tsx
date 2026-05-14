import React from 'react';
import { User, Shield, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthenticatedUser } from '../../auth/authTypes';
import { useUserSettings } from '../logic/useUserSettings';
import { ProfileFeature } from './ProfileFeature';
import { UserSecurityFeature } from './UserSecurityFeature';

interface UserSettingsPageProps {
  currentUser: AuthenticatedUser;
}

export const UserSettingsPage: React.FC<UserSettingsPageProps> = ({ currentUser }) => {
  const {
    activeTab,
    handleTabClick,
    passwordForm,
    handlePasswordChange,
    handlePasswordSubmit,
    handleAvatarUpload,
    isSuccess,
    error,
    isUpdating
  } = useUserSettings(currentUser);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Account Settings</h1>
          <p className="text-gray-500">Manage your profile information and security preferences</p>
        </div>

        <div className="flex items-center gap-1 bg-gray-200/60 p-1 rounded-lg mb-8 w-fit">
          <button
            onClick={() => handleTabClick('Profile')}
            className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'Profile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/80'
            }`}
          >
            <User size={16} />
            Profile
          </button>
          <button
            onClick={() => handleTabClick('Security')}
            className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'Security' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/80'
            }`}
          >
            <Shield size={16} />
            Security
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileFeature 
                currentUser={currentUser} 
                onAvatarUpload={handleAvatarUpload}
                isUpdating={isUpdating}
                isSuccess={isSuccess && !error}
              />
            </motion.div>
          )}

          {activeTab === 'Security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <UserSecurityFeature 
                formData={passwordForm}
                onFieldChange={handlePasswordChange}
                onSubmit={handlePasswordSubmit}
                isUpdating={isUpdating}
                isSuccess={isSuccess && !error}
                error={error}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
