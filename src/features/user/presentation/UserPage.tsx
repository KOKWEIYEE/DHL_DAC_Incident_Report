import React, { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Header } from '../../../components/layout/Header';
import { TicketsPage } from '../../tickets/TicketsPage';
import { CreateTicketModal } from '../../tickets/components/CreateTicketModal';
import { INITIAL_TICKETS } from '../../../data/mockTickets';
import { Ticket } from '../../../types';

interface UserPageProps {
  onLogout: () => void;
}

export function UserPage({ onLogout }: UserPageProps) {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreateTicket(newTicket: Ticket) {
    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
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

        <TicketsPage tickets={tickets} />
      </main>

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTicket}
        nextId={1 + tickets.length}
      />
    </div>
  );
}
