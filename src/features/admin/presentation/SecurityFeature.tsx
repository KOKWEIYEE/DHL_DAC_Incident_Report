import { ChangeEvent, FormEvent } from 'react';
import { ShieldCheck, TimerReset, LockKeyhole, GlobeLock, ClipboardCheck } from 'lucide-react';
import { SecuritySettings } from '../data/adminTypes';

interface SecurityFeatureProps {
  settings: SecuritySettings;
  isSaved: boolean;
  onToggleSetting: (field: keyof Pick<SecuritySettings, 'mfaEnabled' | 'ipWhitelistEnabled' | 'auditLoggingEnabled'>) => void;
  onFieldChange: (field: 'passwordExpiryDays' | 'sessionTimeoutMinutes', value: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function SecurityFeature({ settings, isSaved, onToggleSetting, onFieldChange, onSubmit }: SecurityFeatureProps) {
  function handleNumberChange(field: 'passwordExpiryDays' | 'sessionTimeoutMinutes') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      onFieldChange(field, Number(event.target.value));
    };
  }

  return (
    <div className="bg-white border-y border-gray-200 overflow-hidden">
      <div className="px-8 py-3 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Security & Authentication</h2>
        <p className="text-gray-500 text-[11px] mt-0.5">Configure MFA, IP whitelisting, and password policies.</p>
      </div>

      <form onSubmit={onSubmit} className="p-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
            <div className="flex items-center gap-3 text-gray-900 font-semibold">
              <ShieldCheck size={18} className="text-indigo-600" />
              Multi-factor authentication
            </div>
            <p className="mt-2 text-xs text-gray-500">Require a second verification step for every admin login.</p>
            <button
              type="button"
              onClick={() => onToggleSetting('mfaEnabled')}
              className={`mt-4 inline-flex rounded-full px-4 py-1.5 text-xs font-semibold ${
                settings.mfaEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {settings.mfaEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
            <div className="flex items-center gap-3 text-gray-900 font-semibold">
              <GlobeLock size={18} className="text-indigo-600" />
              IP whitelist
            </div>
            <p className="mt-2 text-xs text-gray-500">Limit access to trusted corporate networks.</p>
            <button
              type="button"
              onClick={() => onToggleSetting('ipWhitelistEnabled')}
              className={`mt-4 inline-flex rounded-full px-4 py-1.5 text-xs font-semibold ${
                settings.ipWhitelistEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {settings.ipWhitelistEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
            <div className="flex items-center gap-3 text-gray-900 font-semibold">
              <ClipboardCheck size={18} className="text-indigo-600" />
              Audit logging
            </div>
            <p className="mt-2 text-xs text-gray-500">Track sensitive actions for compliance and reviews.</p>
            <button
              type="button"
              onClick={() => onToggleSetting('auditLoggingEnabled')}
              className={`mt-4 inline-flex rounded-full px-4 py-1.5 text-xs font-semibold ${
                settings.auditLoggingEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {settings.auditLoggingEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="rounded-2xl border border-gray-200 p-5 bg-white">
            <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
              <LockKeyhole size={18} className="text-indigo-600" />
              Password expiry window
            </div>
            <p className="mt-2 text-xs text-gray-500">Rotate passwords on a predictable schedule.</p>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="range"
                min={30}
                max={180}
                step={30}
                value={settings.passwordExpiryDays}
                onChange={handleNumberChange('passwordExpiryDays')}
                className="w-full accent-indigo-600"
              />
              <span className="w-16 text-right text-sm font-semibold text-gray-900">{settings.passwordExpiryDays}d</span>
            </div>
          </label>

          <label className="rounded-2xl border border-gray-200 p-5 bg-white">
            <div className="flex items-center gap-3 text-sm font-semibold text-gray-900">
              <TimerReset size={18} className="text-indigo-600" />
              Session timeout
            </div>
            <p className="mt-2 text-xs text-gray-500">Automatically sign out idle sessions.</p>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="range"
                min={15}
                max={120}
                step={15}
                value={settings.sessionTimeoutMinutes}
                onChange={handleNumberChange('sessionTimeoutMinutes')}
                className="w-full accent-indigo-600"
              />
              <span className="w-16 text-right text-sm font-semibold text-gray-900">{settings.sessionTimeoutMinutes}m</span>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50/60 px-5 py-4">
          <div>
            <div className="text-sm font-semibold text-gray-900">Policy snapshot</div>
            <p className="text-xs text-gray-500">Saved changes apply to new logins after the next refresh.</p>
          </div>

          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-indigo-700"
          >
            Save security policy
          </button>
        </div>

        {isSaved && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            Security policy updated successfully.
          </div>
        )}
      </form>
    </div>
  );
}
