import { AnimatePresence, motion } from 'motion/react';
import { LogOut, Shield, UserPlus, Users } from 'lucide-react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { AuthenticatedUser } from '../../auth/authTypes';
import { useAdminPage } from '../logic/useAdminPage';
import { CreateUserFeature } from './CreateUserFeature';
import { ManageUserFeature } from './ManageUserFeature';
import { SecurityFeature } from './SecurityFeature';

interface AdminPageProps {
  currentUser: AuthenticatedUser;
  onLogout?: () => void;
}

export function AdminPage({ currentUser, onLogout }: AdminPageProps) {
  const {
    activeTab,
    createSuccess,
    isLoadingUsers,
    formData,
    departmentFilter,
    handleCreateFieldChange,
    handleCreateUser,
    handleRemoveUser,
    handleSecurityFieldChange,
    handleSecuritySubmit,
    handleSecurityToggle,
    handleTabClick,
    handleToggleUserStatus,
    searchTerm,
    userActionMessage,
    securitySaved,
    securitySettings,
    setDepartmentFilter,
    setSearchTerm,
    users,
  } = useAdminPage(currentUser);

  const visibleUsers = users.filter((user) => user.roleName.toLowerCase() !== 'admin' && user.username !== 'admin');
  const departmentOptions = ['All', ...Array.from(new Set(visibleUsers.map((user) => user.department))).sort()];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <nav className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <div className="text-sm font-semibold text-gray-900">DHL Admin Center</div>
            <div className="text-xs text-gray-500">Signed in as {currentUser.fullName}</div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <LogOut size={16} />
              Log out
            </button>
          )}
        </nav>

        <div className="flex-1 overflow-y-auto">
          <div className="w-full px-6 py-4">
            <div className="flex items-center gap-1 bg-gray-200/60 p-1 rounded-lg mb-4 w-fit">
              {(['Create User', 'Manage User', 'Security'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={handleTabClick(tab)}
                  className={`flex items-center gap-2 px-6 py-1.5 rounded-md text-xs font-bold transition-all ${
                    activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/80'
                  }`}
                >
                  {tab === 'Create User' && <UserPlus size={14} />}
                  {tab === 'Manage User' && <Users size={14} />}
                  {tab === 'Security' && <Shield size={14} />}
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'Create User' && (
                <motion.div
                  key="create-user"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <CreateUserFeature formData={formData} isSuccess={createSuccess} onFieldChange={handleCreateFieldChange} onSubmit={handleCreateUser} />
                </motion.div>
              )}

              {activeTab === 'Manage User' && (
                <motion.div
                  key="manage-users"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <ManageUserFeature
                    users={visibleUsers}
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                    departmentFilter={departmentFilter}
                    departmentOptions={departmentOptions}
                    onDepartmentFilterChange={setDepartmentFilter}
                    onToggleUserStatus={handleToggleUserStatus}
                    onRemoveUser={handleRemoveUser}
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
                  <SecurityFeature
                    settings={securitySettings}
                    isSaved={securitySaved}
                    onToggleSetting={handleSecurityToggle}
                    onFieldChange={handleSecurityFieldChange}
                    onSubmit={handleSecuritySubmit}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {isLoadingUsers && <div className="mt-4 text-xs text-gray-500">Loading users from the database...</div>}
            {userActionMessage && <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{userActionMessage}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
