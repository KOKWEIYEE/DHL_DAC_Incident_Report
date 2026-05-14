import React from 'react';
import { User, Mail, Building, ShieldCheck, CheckCircle2, Camera } from 'lucide-react';
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
    <div className="bg-white border-y border-gray-200 overflow-hidden">
      <div className="px-8 py-2 bg-gray-50 border-b border-gray-200">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">User Profile</h2>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {/* Profile Picture Row (All along to the left) */}
        <div className="px-8 py-6 hover:bg-gray-50/50 transition-colors">
          <div className="relative inline-block">
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.fullName} 
                className="w-16 h-16 rounded-xl border-2 border-white shadow-sm object-cover bg-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl border-2 border-white shadow-sm bg-indigo-50 flex items-center justify-center text-xl font-bold text-indigo-600">
                {getInitial()}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 p-1 bg-white rounded-lg shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
              <Camera size={10} className="text-gray-600" />
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUpdating} />
            </label>
          </div>
        </div>
        {/* Full Name Row */}
        <div className="grid grid-cols-[220px_1fr] items-center px-8 py-3 hover:bg-gray-50/50 transition-colors">
          <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
            <User size={14} />
            Full Name
          </label>
          <div className="text-sm text-gray-900 px-3">{currentUser.fullName}</div>
        </div>

        {/* Email Row */}
        <div className="grid grid-cols-[220px_1fr] items-center px-8 py-3 hover:bg-gray-50/50 transition-colors">
          <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
            <Mail size={14} />
            Email
          </label>
          <div className="text-sm text-gray-900 px-3">{currentUser.username}</div>
        </div>

        {/* Department Row */}
        <div className="grid grid-cols-[220px_1fr] items-center px-8 py-3 hover:bg-gray-50/50 transition-colors">
          <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
            <Building size={14} />
            Department
          </label>
          <div className="text-sm text-gray-900 px-3">{currentUser.department || 'Unassigned'}</div>
        </div>

        {/* System Role Row */}
        <div className="grid grid-cols-[220px_1fr] items-center px-8 py-3 hover:bg-gray-50/50 transition-colors">
          <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
            <ShieldCheck size={14} />
            System Role
          </label>
          <div className="text-sm text-gray-900 px-3 capitalize">{currentUser.roleName}</div>
        </div>
      </div>

      <div className="px-8 py-3 bg-gray-50/50 border-t border-gray-200">
        {isSuccess && (
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
            <CheckCircle2 size={14} />
            Profile updated successfully.
          </div>
        )}
        {isUpdating && (
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-medium">
            <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            Uploading avatar...
          </div>
        )}
      </div>
    </div>
  );
};


