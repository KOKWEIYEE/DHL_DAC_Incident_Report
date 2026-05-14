import React from 'react';
import { User, Camera, Mail, Building, ShieldCheck } from 'lucide-react';
import { AuthenticatedUser } from '../../auth/authTypes';

interface ProfileFeatureProps {
  currentUser: AuthenticatedUser;
  onAvatarUpload: (file: File) => void;
  isUpdating: boolean;
  isSuccess: boolean;
}

export const ProfileFeature: React.FC<ProfileFeatureProps> = ({ currentUser, onAvatarUpload, isUpdating, isSuccess }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAvatarUpload(e.target.files[0]);
    }
  };

  const getInitial = () => {
    return currentUser.fullName.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
      <div className="px-8 pb-8">
        <div className="relative -mt-16 mb-6 inline-block">
          {currentUser.avatar ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.fullName} 
              className="w-32 h-32 rounded-2xl border-4 border-white shadow-md object-cover bg-white"
            />
          ) : (
            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-md bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600">
              {getInitial()}
            </div>
          )}
          <label className="absolute bottom-2 right-2 p-2 bg-white rounded-lg shadow-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <Camera size={18} className="text-gray-600" />
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUpdating} />
          </label>
        </div>

        <div className="space-y-6 max-w-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentUser.fullName}</h2>
            <p className="text-gray-500">Manage your personal information and profile picture</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Mail size={14} />
                Username / Email
              </label>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-700 font-medium">
                {currentUser.username}
              </div>
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Building size={14} />
                Role
              </label>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-700 font-medium capitalize">
                {currentUser.roleName}
              </div>
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <ShieldCheck size={14} />
                Account Status
              </label>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-700 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active
                </span>
              </div>
            </div>
          </div>

          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
              Profile updated successfully!
            </div>
          )}

          {isUpdating && (
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              Updating profile...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
