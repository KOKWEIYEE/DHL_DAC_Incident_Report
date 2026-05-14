import React, { useEffect } from 'react';
import { TicketTable } from '../components/TicketTable';
import { useTickets } from '../logic/useTickets';
import { AuthenticatedUser } from '../../auth/authTypes';
import { deleteTicketApi } from '../data/ticketApi';

interface TicketsPageProps {
  refreshTrigger?: number;
  onTicketClick?: (ticketId: string) => void;
  currentUser?: AuthenticatedUser;
  filterAssignedToUserId?: number;
  initialStatusFilter?: string;
  initialAssignmentFilter?: string;
}

export const TicketsPage: React.FC<TicketsPageProps> = ({ 
  refreshTrigger = 0, 
  onTicketClick, 
  currentUser, 
  filterAssignedToUserId,
  initialStatusFilter = 'All',
  initialAssignmentFilter = 'All'
}) => {
  const {
    tickets,
    isLoading,
    error,
    uniqueAssignees,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    dateFilter,
    setDateFilter,
    assignmentFilter,
    setAssignmentFilter,
    refreshTickets
  } = useTickets(filterAssignedToUserId);

  useEffect(() => {
    if (initialStatusFilter) setStatusFilter(initialStatusFilter);
    if (initialAssignmentFilter) setAssignmentFilter(initialAssignmentFilter);
  }, [initialStatusFilter, initialAssignmentFilter]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      refreshTickets();
    }
  }, [refreshTrigger]);

  if (isLoading && tickets.length === 0) {
    return <div className="p-6 text-gray-500">Loading tickets...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

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
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
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

      <TicketTable 
        tickets={tickets} 
        onTicketClick={onTicketClick} 
        isAdmin={currentUser?.roleName?.toLowerCase() === 'admin'}
        onDeleteTicket={async (id) => {
          if (window.confirm(`Are you sure you want to delete ticket #${id}?`)) {
            try {
              if (currentUser) {
                await deleteTicketApi(id, currentUser.id);
                refreshTickets();
              }
            } catch (err: any) {
              alert('Failed to delete ticket: ' + err.message);
            }
          }
        }}
      />
    </div>
  );
};
