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
    <div className="bg-white border-y border-gray-200 overflow-hidden">
      <div className="px-8 py-2 bg-gray-50 border-b border-gray-200">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Change Password</h2>
      </div>

      <form onSubmit={onSubmit} className="divide-y divide-gray-100">
        <div className="flex flex-col">
          {/* Current Password */}
          <div className="grid grid-cols-[220px_1fr] items-center px-8 py-1 hover:bg-gray-50/50 transition-colors">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
              <Lock size={14} />
              Current Password
            </label>
            <input
              type="password"
              required
              value={formData.currentPassword}
              onChange={(e) => onFieldChange('currentPassword', e.target.value)}
              className="w-full py-1.5 px-3 bg-transparent border-0 focus:ring-0 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-300"
              placeholder="••••••••"
            />
          </div>

          {/* New Password */}
          <div className="grid grid-cols-[220px_1fr] items-center px-8 py-1 hover:bg-gray-50/50 transition-colors">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
              <Lock size={14} />
              New Password
            </label>
            <input
              type="password"
              required
              value={formData.newPassword}
              onChange={(e) => onFieldChange('newPassword', e.target.value)}
              className="w-full py-1.5 px-3 bg-transparent border-0 focus:ring-0 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-300"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div className="grid grid-cols-[220px_1fr] items-center px-8 py-1 hover:bg-gray-50/50 transition-colors">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
              <Lock size={14} />
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => onFieldChange('confirmPassword', e.target.value)}
              className="w-full py-1.5 px-3 bg-transparent border-0 focus:ring-0 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-300"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="px-8 py-3 bg-gray-50/50 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs font-medium">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            {isSuccess && !error && (
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                <CheckCircle2 size={14} />
                Password updated successfully.
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-10 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-xs shadow-md transition-all uppercase tracking-wide disabled:bg-indigo-300"
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};
