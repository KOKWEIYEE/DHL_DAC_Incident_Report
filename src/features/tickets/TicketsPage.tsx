import React, { useState, useMemo } from 'react';
import { TicketTable } from './components/TicketTable';
import { Ticket } from '../../types';

interface TicketsPageProps {
  tickets: Ticket[];
}

export const TicketsPage: React.FC<TicketsPageProps> = ({ tickets }) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // get unique assignees for dropdown
  const uniqueAssignees = Array.from(new Set(tickets.map(t => t.department)));

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchStatus = statusFilter === 'All' || ticket.status.toLowerCase() === statusFilter.toLowerCase();
      const matchPriority = priorityFilter === 'All' || ticket.priority.toLowerCase() === priorityFilter.toLowerCase();
      const matchAssignee = assigneeFilter === 'All' || ticket.department === assigneeFilter;
      const matchDate = dateFilter === '' || ticket.timeCreated.startsWith(dateFilter);
      return matchStatus && matchPriority && matchAssignee && matchDate;
    });
  }, [tickets, statusFilter, priorityFilter, assigneeFilter, dateFilter]);

  return (
    <div className="flex-1 p-6 flex flex-col overflow-y-auto">
      {/* Filters & Actions Bar */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-3 flex-wrap">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] bg-white text-slate-600 outline-none focus:border-indigo-500"
          >
            <option value="All">Status: All</option>
            <option value="Draft">Draft</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Published">Published</option>
          </select>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] bg-white text-slate-600 outline-none focus:border-indigo-500"
          >
            <option value="All">Priority: All</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select 
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] bg-white text-slate-600 outline-none focus:border-indigo-500"
          >
            <option value="All">Assignee: All</option>
            {uniqueAssignees.map(a => (
               <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] bg-white text-slate-600 outline-none focus:border-indigo-500"
            title="Filter by Date Created"
          />
        </div>
      </div>

      <TicketTable tickets={filteredTickets} />
    </div>
  );
};
