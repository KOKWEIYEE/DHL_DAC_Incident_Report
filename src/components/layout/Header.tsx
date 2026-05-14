import React from 'react';
import { Search, Bell, Wand2 } from 'lucide-react';

interface HeaderProps {
  onCreateTicket: () => void;
  onAIDraft: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateTicket, onAIDraft }) => {
  return (
    <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="relative w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search incidents, customers, or internal knowledge base..." 
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
        />
      </div>
      <div className="flex items-center gap-5">
        <button 
          onClick={onAIDraft}
          className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md text-sm font-bold border border-indigo-200 cursor-pointer transition-colors">
          <Wand2 size={16} />
          AI Draft
        </button>
        <button 
          onClick={onCreateTicket}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium border-none cursor-pointer transition-colors shadow-sm">
          + Create Ticket
        </button>
      </div>
    </header>
  );
};
