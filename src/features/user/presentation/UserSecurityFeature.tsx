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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
          <Shield size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
          <p className="text-sm text-gray-500">Manage your password and account security</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => onFieldChange('currentPassword', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => onFieldChange('newPassword', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => onFieldChange('confirmPassword', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {isSuccess && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
            <CheckCircle2 size={16} />
            Password changed successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full md:w-auto px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 disabled:bg-indigo-300 disabled:active:scale-100"
        >
          {isUpdating ? 'Changing Password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};
