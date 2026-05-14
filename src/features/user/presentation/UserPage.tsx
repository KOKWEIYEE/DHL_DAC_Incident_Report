import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Header } from '../../../components/layout/Header';
import { TicketsPage } from '../../tickets/presentation/TicketsPage';
import { CreateTicketModal } from '../../tickets/components/CreateTicketModal';
import { createTicketApi } from '../../tickets/data/ticketApi';
import { AuthenticatedUser } from '../../auth/authTypes';

interface UserPageProps {
  currentUser: AuthenticatedUser;
  onLogout: () => void;
}

export function UserPage({ currentUser, onLogout }: UserPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  async function handleCreateTicket(data: { subject: string; description: string; department: string; type: string; priority: string }) {
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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3">
          <div className="text-sm font-semibold text-gray-700">User dashboard</div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Log out
          </button>
        </div>

        <Header onCreateTicket={() => setIsModalOpen(true)} />

        <TicketsPage refreshTrigger={refreshTrigger} />
      </main>

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTicket}
      />
    </div>
  );
}
