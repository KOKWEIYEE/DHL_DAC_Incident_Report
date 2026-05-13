import { ChangeEvent } from 'react';
import { Search, Shield, UserMinus, UserRoundCheck, Users } from 'lucide-react';
import { AdminUser } from '../data/adminTypes';

interface ManageUserFeatureProps {
  users: AdminUser[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onToggleUserStatus: (userId: number) => void;
  onRemoveUser: (userId: number) => void | Promise<void>;
}

export function ManageUserFeature({
  users,
  searchTerm,
  onSearchTermChange,
  onToggleUserStatus,
  onRemoveUser,
}: ManageUserFeatureProps) {
  const filteredUsers = users.filter((user) => {
    const searchValue = searchTerm.trim().toLowerCase();
    if (searchValue === '') {
      return true;
    }

    return [user.username, user.fullName, user.roleName, user.createdAt].some((value) => value.toLowerCase().includes(searchValue));
  });

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    onSearchTermChange(event.target.value);
  }

  return (
    <div className="bg-white border-y border-gray-200 overflow-hidden">
      <div className="px-8 py-3 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">User Directory</h2>
          <p className="text-gray-500 text-[11px] mt-0.5">Review and manage active DHL Support accounts.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search accounts..."
            className="pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500 w-full md:w-64"
          />
        </div>
      </div>

      <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/60 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">Total Users</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{users.length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">Active</div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{users.filter((user) => user.status === 'Active').length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">Locked</div>
          <div className="mt-2 text-2xl font-bold text-amber-600">{users.filter((user) => user.status === 'Locked').length}</div>
        </div>
      </div>

      <div className="p-8">
        {filteredUsers.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center min-h-[260px] text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users size={24} className="text-gray-300" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">No users found</h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1 italic">Try a different search term or create a new account.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-500">User</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-500">Created</th>
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">{user.fullName}</div>
                      <div className="text-xs text-gray-500">{user.username}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">{user.roleName}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${
                          user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {user.status === 'Active' ? <UserRoundCheck size={12} /> : <Shield size={12} />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{user.createdAt}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleUserStatus(user.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <Shield size={13} />
                          {user.status === 'Active' ? 'Lock' : 'Unlock'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveUser(user.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          <UserMinus size={13} />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {searchTerm && filteredUsers.length > 0 && (
        <div className="px-8 pb-5 text-xs text-gray-500">Showing results for "{searchTerm}".</div>
      )}
    </div>
  );
}
