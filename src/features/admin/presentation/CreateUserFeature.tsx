import { ChangeEvent, FormEvent } from 'react';
import { CheckCircle2, Briefcase, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { CreateUserForm } from '../data/adminTypes';

interface CreateUserFeatureProps {
  formData: CreateUserForm;
  isSuccess: boolean;
  onFieldChange: (field: keyof CreateUserForm, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function CreateUserFeature({ formData, isSuccess, onFieldChange, onSubmit }: CreateUserFeatureProps) {
  function handleFieldChange(field: keyof CreateUserForm) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onFieldChange(field, event.target.value);
    };
  }

  return (
    <div className="bg-white border-y border-gray-200 overflow-hidden">
      <div className="px-8 py-2 bg-gray-50 border-b border-gray-200">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Register New Team Member</h2>
      </div>

      <form onSubmit={onSubmit} className="divide-y divide-gray-100">
        <div className="flex flex-col">
          <div className="grid grid-cols-[220px_1fr] items-center px-8 py-1 hover:bg-gray-50/50 transition-colors">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
              <User size={14} />
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={handleFieldChange('fullName')}
              className="w-full py-1.5 px-3 bg-transparent border-0 focus:ring-0 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-300"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="grid grid-cols-[220px_1fr] items-center px-8 py-1 hover:bg-gray-50/50 transition-colors">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
              <Mail size={14} />
              Username / Email
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={handleFieldChange('username')}
              className="w-full py-1.5 px-3 bg-transparent border-0 focus:ring-0 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-300"
              placeholder="j.doe@dhl.com"
            />
          </div>

          <div className="grid grid-cols-[220px_1fr] items-center px-8 py-1 hover:bg-gray-50/50 transition-colors">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
              <Lock size={14} />
              Temp Password
            </label>
            <input
              type="text"
              required
              value={formData.password}
              onChange={handleFieldChange('password')}
              className="w-full py-1.5 px-3 bg-transparent border-0 focus:ring-0 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-300"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-[220px_1fr] items-center px-8 py-1 hover:bg-gray-50/50 transition-colors">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
              <Briefcase size={14} />
              Department
            </label>
            <input
              type="text"
              required
              value={formData.department}
              onChange={handleFieldChange('department')}
              className="w-full py-1.5 px-3 bg-transparent border-0 focus:ring-0 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-300"
              placeholder="e.g. Operations"
            />
          </div>

          <div className="grid grid-cols-[220px_1fr] items-center px-8 py-1 hover:bg-gray-50/50 transition-colors">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-2">
              <ShieldCheck size={14} />
              System Role
            </label>
            <select
              value={formData.roleName}
              onChange={handleFieldChange('roleName')}
              className="w-full py-1.5 px-3 bg-transparent border-0 focus:ring-0 outline-none transition-all text-sm text-gray-900"
            >
              <option value="user">User</option>
              <option value="agent">Agent</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="px-8 py-3 bg-gray-50/50 flex items-center justify-end border-t border-gray-200">
          <button
            type="submit"
            className="px-10 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-xs shadow-md transition-all uppercase tracking-wide"
          >
            Create
          </button>
        </div>
      </form>

      {isSuccess && (
        <div className="mx-8 mb-8 mt-4 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700">
          <CheckCircle2 size={20} />
          <span className="font-semibold text-sm">User account provisioned successfully. Credential email sent.</span>
        </div>
      )}
    </div>
  );
}
