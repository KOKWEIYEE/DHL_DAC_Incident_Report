import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  onCreateTicket: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateTicket }) => {
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
          onClick={onCreateTicket}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium border-none cursor-pointer transition-colors shadow-sm">
          + Create Ticket
        </button>
        <div className="relative cursor-pointer text-slate-500 hover:text-slate-700 transition-colors">
          <Bell size={22} />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden cursor-pointer border border-gray-200">
          <img src="https://i.pravatar.cc/150?u=admin" alt="User Profile" className="h-full w-full object-cover" />
        </div>
      </div>
    </header>
  );
};
