import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Header } from '../../../components/layout/Header';
import { TicketsPage } from '../../tickets/presentation/TicketsPage';
import { CreateTicketModal } from '../../tickets/components/CreateTicketModal';
import { createTicketApi } from '../../tickets/data/ticketApi';
import { TicketDetailPage } from '../../tickets/presentation/TicketDetailPage';
import { AuthenticatedUser } from '../../auth/authTypes';
import { UserSettingsPage } from './UserSettingsPage';

interface UserPageProps {
  currentUser: AuthenticatedUser;
  onLogout: () => void;
}

export function UserPage({ currentUser, onLogout }: UserPageProps) {
  // Admin sidebar integration - ensure UserPage doesn't try to use onSettingsClick
  const _userOnlyPage = true;
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'MyTickets' | 'AllTickets' | 'Settings'>('MyTickets');

  async function handleCreateTicket(data: { subject: string; description: string; department: string; type: string; priority: string; tags?: string[] }) {
    try {
      await createTicketApi({
        ...data,
        requester_id: currentUser.id
      });
      setRefreshTrigger(prev => prev + 1);
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to create ticket.');
      console.error(err);
    }
  }

  const handleTicketsNav = () => {
    setActiveTab('AllTickets');
    setSelectedTicketId(null);
  };

  const handleDashboardNav = () => {
    setActiveTab('MyTickets');
    setSelectedTicketId(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      <Sidebar 
        onDashboardClick={handleDashboardNav}
        onTicketsClick={handleTicketsNav} 
        onSettingsClick={() => setActiveTab('Settings')}
        role={currentUser.roleName}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3 shrink-0">
          <div className="text-sm font-semibold text-gray-700">
            {activeTab === 'MyTickets' ? 'My Tickets' : activeTab === 'AllTickets' ? 'All Tickets' : 'User settings'}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Log out
          </button>
        </div>

        {activeTab === 'MyTickets' || activeTab === 'AllTickets' ? (
          selectedTicketId ? (
            <div className="flex-1 overflow-hidden">
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
              {/* Header and Create Ticket removed for User */}
              <TicketsPage 
                refreshTrigger={refreshTrigger} 
                onTicketClick={(id) => setSelectedTicketId(id)} 
                currentUser={currentUser}
                filterAssignedToUserId={activeTab === 'MyTickets' ? currentUser.id : undefined}
              />
            </>
          )
        ) : (
          <UserSettingsPage currentUser={currentUser} />
        )}
      </main>
    </div>
  );
}
