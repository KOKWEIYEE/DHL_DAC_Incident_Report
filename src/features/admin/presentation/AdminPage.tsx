import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut, Shield, UserPlus, Users } from 'lucide-react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Header } from '../../../components/layout/Header';
import { AuthenticatedUser } from '../../auth/authTypes';
import { useAdminPage } from '../logic/useAdminPage';
import { CreateUserFeature } from './CreateUserFeature';
import { ManageUserFeature } from './ManageUserFeature';
import { UserSecurityFeature } from '../../user/presentation/UserSecurityFeature';
import { useUserSettings } from '../../user/logic/useUserSettings';
import { TicketsPage } from '../../tickets/presentation/TicketsPage';
import { TicketDetailPage } from '../../tickets/presentation/TicketDetailPage';
import { CreateTicketModal } from '../../tickets/components/CreateTicketModal';
import { createTicketApi } from '../../tickets/data/ticketApi';

interface AdminPageProps {
  currentUser: AuthenticatedUser;
  onLogout?: () => void;
}

export function AdminPage({ currentUser, onLogout }: AdminPageProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const {
    activeTab,
    createSuccess,
    createError,
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
    handleUpdateUser,
    searchTerm,
    userActionMessage,
    securitySaved,
    securitySettings,
    setDepartmentFilter,
    setSearchTerm,
    setActiveTab,
    users,
  } = useAdminPage(currentUser);

  const {
    passwordForm,
    handlePasswordChange,
    handlePasswordSubmit,
    isUpdating: isSecurityUpdating,
    isSuccess: isSecuritySuccess,
    error: securityError,
  } = useUserSettings(currentUser);

  const visibleUsers = users.filter((user) => user.roleName.toLowerCase() !== 'admin' && user.username !== 'admin');
  const departmentOptions = ['All', ...Array.from(new Set(visibleUsers.map((user) => user.department))).sort()];
  
  const [sidebarStatusFilter, setSidebarStatusFilter] = useState('All');
  const [sidebarAssignmentFilter, setSidebarAssignmentFilter] = useState('All');
  
  const handleTicketsNav = () => {
    setActiveTab('Tickets');
    setSelectedTicketId(null);
    setSidebarStatusFilter('All');
    setSidebarAssignmentFilter('All');
  };

  const handleFilterChange = (filter: string) => {
    setActiveTab('Tickets');
    setSelectedTicketId(null);
    if (filter === 'assigned' || filter === 'unassigned') {
      setSidebarStatusFilter('All');
      setSidebarAssignmentFilter(filter);
    } else {
      setSidebarStatusFilter(filter);
      setSidebarAssignmentFilter('All');
    }
  };

  async function handleCreateTicket(data: { subject: string; description: string; department: string; type: string; priority: string; tags?: string[]; assigneeId?: number | null }) {
    try {
      await createTicketApi({
        ...data,
        requester_id: currentUser.id,
        assignee_id: data.assigneeId
      });
      setRefreshTrigger(prev => prev + 1);
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to create ticket.');
      console.error(err);
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900">
      <Sidebar 
        role="admin"
        onTicketsClick={handleTicketsNav}
        onSettingsClick={() => setActiveTab('Create User')}
        onFilterChange={handleFilterChange}
      />

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
            {activeTab !== 'Tickets' && (
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
            )}
            

            <AnimatePresence mode="wait">
              {activeTab === 'Create User' && (
                <motion.div
                  key="create-user"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <CreateUserFeature 
                    formData={formData} 
                    isSuccess={createSuccess} 
                    error={createError}
                    onFieldChange={handleCreateFieldChange} 
                    onSubmit={handleCreateUser} 
                  />
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
                    onUpdateUser={handleUpdateUser}
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
                  <UserSecurityFeature 
                    formData={passwordForm}
                    onFieldChange={handlePasswordChange}
                    onSubmit={handlePasswordSubmit}
                    isUpdating={isSecurityUpdating}
                    isSuccess={isSecuritySuccess && !securityError}
                    error={securityError}
                  />
                </motion.div>
              )}

              {activeTab === 'Tickets' && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="h-[calc(100vh-200px)] flex flex-col"
                >
                  {selectedTicketId ? (
                    <div className="flex-1 overflow-hidden h-full">
                      <TicketDetailPage 
                        ticketId={selectedTicketId} 
                        currentUser={currentUser} 
                        onBack={() => {
                          setSelectedTicketId(null);
                          setRefreshTrigger(prev => prev + 1);
                        }} 
                      />
                    </div>
                  ) : (
                    <>
                      <Header onCreateTicket={() => setIsModalOpen(true)} />
                      <TicketsPage 
                        refreshTrigger={refreshTrigger}
                        onTicketClick={(id) => setSelectedTicketId(id)}
                        currentUser={currentUser}
                        initialStatusFilter={sidebarStatusFilter}
                        initialAssignmentFilter={sidebarAssignmentFilter}
                      />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {isLoadingUsers && <div className="mt-4 text-xs text-gray-500">Loading users from the database...</div>}
            {userActionMessage && <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{userActionMessage}</div>}
          </div>
        </div>
      </main>

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTicket}
      />
    </div>
  );
}

