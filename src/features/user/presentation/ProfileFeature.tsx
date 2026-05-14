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
    <div className="bg-white overflow-hidden">
      <div className="flex flex-col">
        <div className="px-8 flex items-center gap-6 pb-6 border-b border-gray-100">
          <div className="relative inline-block">
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.fullName} 
                className="w-20 h-20 rounded-2xl border-2 border-gray-100 shadow-sm object-cover bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl border-2 border-gray-100 shadow-sm bg-indigo-50 flex items-center justify-center text-2xl font-bold text-indigo-600">
                {getInitial()}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 p-1 bg-white rounded-lg shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
              <Camera size={12} className="text-gray-600" />
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUpdating} />
            </label>
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">User Profile</h2>
            <h3 className="text-lg font-bold text-gray-900">{currentUser.fullName}</h3>
          </div>
        </div>

        <div className="w-full">
          {/* Full Name Row */}
          <div className="grid grid-cols-[240px_1fr] items-center gap-4 py-3 px-8 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-3 text-slate-600">
              <User size={16} className="text-slate-400" />
              <span className="text-[13px] font-medium uppercase tracking-wide">Full Name</span>
            </div>
            <div className="text-[13px] text-slate-500">{currentUser.fullName}</div>
          </div>

          {/* Email Row */}
          <div className="grid grid-cols-[240px_1fr] items-center gap-4 py-3 px-8 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail size={16} className="text-slate-400" />
              <span className="text-[13px] font-medium uppercase tracking-wide">Email</span>
            </div>
            <div className="text-[13px] text-slate-500">{currentUser.username}</div>
          </div>

          {/* Department Row */}
          <div className="grid grid-cols-[240px_1fr] items-center gap-4 py-3 px-8 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-3 text-slate-600">
              <Building size={16} className="text-slate-400" />
              <span className="text-[13px] font-medium uppercase tracking-wide">Department</span>
            </div>
            <div className="text-[13px] text-slate-500">{currentUser.department || 'Unassigned'}</div>
          </div>

          {/* System Role Row */}
          <div className="grid grid-cols-[240px_1fr] items-center gap-4 py-3 px-8 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-3 text-slate-600">
              <ShieldCheck size={16} className="text-slate-400" />
              <span className="text-[13px] font-medium uppercase tracking-wide">System Role</span>
            </div>
            <div className="text-[13px] text-slate-500 capitalize">{currentUser.roleName}</div>
          </div>

          <div className="px-8 py-4">
            {isSuccess && (
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                <CheckCircle2 size={14} />
                Profile picture updated successfully!
              </div>
            )}

            {isUpdating && (
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-medium">
                <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                Uploading image...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
