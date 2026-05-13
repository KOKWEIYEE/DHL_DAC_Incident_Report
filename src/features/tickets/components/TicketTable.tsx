import React from 'react';
import { StatusBadge, PriorityBadge } from './Badges';
import { Ticket } from '../../../types';

interface TicketTableProps {
  tickets: Ticket[];
}

export const TicketTable: React.FC<TicketTableProps> = ({ tickets }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200">
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</th>
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Ticket ID</th>
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Subject / Issue</th>
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Assignee</th>
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Priority</th>
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Time Created</th>
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="py-3 px-4 text-sm font-mono text-indigo-500 font-semibold">
                  {ticket.id}
                </td>
                <td className="py-3 px-4 text-sm text-slate-800 max-w-[200px] truncate" title={ticket.subject}>
                  {ticket.subject}
                </td>
                <td className="py-3 px-4 text-sm text-slate-800">
                  {ticket.department}
                </td>
                <td className="py-3 px-4">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="py-3 px-4 text-sm text-slate-800">
                  {ticket.timeCreated}
                </td>
                <td className="py-3 px-4 text-sm text-slate-800">
                  {ticket.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="py-3 px-4 bg-slate-50 flex items-center justify-between border-t border-gray-200">
        <div className="text-[13px] text-slate-500">
          Showing 1 to {Math.min(5, tickets.length)} of {tickets.length} incidents
        </div>
        <div className="flex gap-1">
          <button className="px-2.5 py-1 min-w-[32px] border border-gray-200 bg-white rounded text-xs text-slate-500 hover:bg-gray-50 transition-colors cursor-pointer">
            Previous
          </button>
          <button className="px-2.5 py-1 min-w-[32px] border border-indigo-500 bg-indigo-500 text-white rounded text-xs font-medium cursor-pointer">
            1
          </button>
          <button className="px-2.5 py-1 min-w-[32px] border border-gray-200 bg-white rounded text-xs text-slate-500 hover:bg-gray-50 transition-colors cursor-pointer" disabled={tickets.length <= 5}>
            2
          </button>
          <button className="px-2.5 py-1 min-w-[32px] border border-gray-200 bg-white rounded text-xs text-slate-500 hover:bg-gray-50 transition-colors cursor-pointer" disabled={tickets.length <= 5}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
