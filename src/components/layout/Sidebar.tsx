import React, { useState } from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, ClipboardList, ChevronDown, ChevronUp, Timer, IdCard, UserX, FileText, RotateCcw, FolderOpen, Folder } from 'lucide-react';

interface SidebarProps {
  onTicketsClick?: () => void;
  onSettingsClick?: () => void;
  onDashboardClick?: () => void;
  onFilterChange?: (filter: string) => void;
  role?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onTicketsClick, onSettingsClick, onDashboardClick, onFilterChange, role }) => {
  const [isTicketsOpen, setIsTicketsOpen] = useState(true);
  const isAdmin = role?.toLowerCase() === 'admin';

  return (
    <aside className="w-[240px] bg-slate-900 text-white flex flex-col shrink-0 overflow-y-auto hidden md:flex">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shrink-0">
          SD
        </div>
        <div className="text-[18px] font-bold tracking-tight">SupportDesk</div>
      </div>
      
      <nav className="flex-1 py-4 flex flex-col text-sm">
        <a href="#" 
           onClick={(e) => { e.preventDefault(); if (onDashboardClick) onDashboardClick(); }}
           className="flex items-center gap-3 px-6 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border-l-4 border-transparent">
          <LayoutDashboard size={18} />
          {isAdmin ? 'Dashboard' : 'My Tickets'}
        </a>

        {/* Tickets Accordion */}
        <div>
          <button 
            onClick={() => {
              setIsTicketsOpen(!isTicketsOpen);
              if (onTicketsClick) onTicketsClick();
            }}
            className={`w-full flex items-center justify-between px-6 py-3 transition-colors border-l-4 cursor-pointer ${isTicketsOpen ? 'bg-slate-800 text-white border-indigo-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'}`}
          >
            <div className="flex items-center gap-3">
              <ClipboardList size={18} />
              <span className="font-semibold">Tickets</span>
            </div>
            {isTicketsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {isTicketsOpen && (
            <div className="flex flex-col bg-slate-900 py-2">
              <a href="#" 
                 onClick={(e) => { e.preventDefault(); onFilterChange?.('assigned'); }}
                 className="flex items-center gap-3 pl-12 pr-6 py-2.5 text-slate-400 hover:text-white transition-colors">
                <IdCard size={16} />
                Assigned
              </a>
              <a href="#" 
                 onClick={(e) => { e.preventDefault(); onFilterChange?.('unassigned'); }}
                 className="flex items-center gap-3 pl-12 pr-6 py-2.5 text-slate-400 hover:text-white transition-colors">
                <UserX size={16} />
                Unassigned
              </a>
              <a href="#" 
                 onClick={(e) => { e.preventDefault(); onFilterChange?.('Closed'); }}
                 className="flex items-center gap-3 pl-12 pr-6 py-2.5 text-slate-400 hover:text-white transition-colors">
                <Folder size={16} />
                Closed
              </a>
            </div>
          )}
        </div>

        <a href="#" className="flex items-center gap-3 px-6 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border-l-4 border-transparent mt-2">
          <BarChart3 size={18} />
          Reports
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); if (onSettingsClick) onSettingsClick(); }} className="flex items-center gap-3 px-6 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border-l-4 border-transparent">
          <Settings size={18} />
          Settings
        </a>
      </nav>
    </aside>
  );
};
