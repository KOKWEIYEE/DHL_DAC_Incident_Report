import React from 'react';
import { Lock, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PasswordChangeForm } from '../data/userSettingsTypes';

interface UserSecurityFeatureProps {
  formData: PasswordChangeForm;
  onFieldChange: (field: keyof PasswordChangeForm, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isUpdating: boolean;
  isSuccess: boolean;
  error: string | null;
}

export const UserSecurityFeature: React.FC<UserSecurityFeatureProps> = ({ 
  formData, onFieldChange, onSubmit, isUpdating, isSuccess, error 
}) => {
  return (
    <div className="bg-white overflow-hidden">
      <div className="flex flex-col">
        <div className="px-8 flex items-center gap-3 mb-4 pb-6 border-b border-gray-100">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <Shield size={22} />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">Security Settings</h2>
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Change Password</h3>
          </div>
        </div>

        <form onSubmit={onSubmit} className="w-full">
          {/* Current Password */}
          <div className="grid grid-cols-[240px_1fr] items-center gap-4 py-3 px-8 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors">
            <label className="flex items-center gap-3 text-slate-600">
              <Lock size={16} className="text-slate-400" />
              <span className="text-[13px] font-medium uppercase tracking-wide">Current Password</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => onFieldChange('currentPassword', e.target.value)}
                className="w-full max-w-sm px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-[13px]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div className="grid grid-cols-[240px_1fr] items-center gap-4 py-3 px-8 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors">
            <label className="flex items-center gap-3 text-slate-600">
              <Lock size={16} className="text-slate-400" />
              <span className="text-[13px] font-medium uppercase tracking-wide">New Password</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => onFieldChange('newPassword', e.target.value)}
                className="w-full max-w-sm px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-[13px]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="grid grid-cols-[240px_1fr] items-center gap-4 py-3 px-8 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors">
            <label className="flex items-center gap-3 text-slate-600">
              <Lock size={16} className="text-slate-400" />
              <span className="text-[13px] font-medium uppercase tracking-wide">Confirm Password</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => onFieldChange('confirmPassword', e.target.value)}
                className="w-full max-w-sm px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-[13px]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="px-8 py-6 flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-[13px] font-medium">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {isSuccess && (
              <div className="flex items-center gap-2 text-emerald-600 text-[13px] font-medium">
                <CheckCircle2 size={14} />
                Password changed successfully!
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-10 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 disabled:bg-indigo-300 disabled:active:scale-100 uppercase tracking-wider text-[11px]"
              >
                {isUpdating ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
