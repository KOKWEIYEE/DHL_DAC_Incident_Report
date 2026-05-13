import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TicketsPage } from './features/tickets/TicketsPage';
import { CreateTicketModal } from './features/tickets/components/CreateTicketModal';
import { INITIAL_TICKETS } from './data/mockTickets';
import { Ticket } from './types';

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTicket = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
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
