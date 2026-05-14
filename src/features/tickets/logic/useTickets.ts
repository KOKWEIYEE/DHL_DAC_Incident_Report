import { useState, useEffect, useMemo } from 'react';
import { Ticket } from '../../../types';
import { fetchTicketsApi } from '../data/ticketApi';

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTicketsApi();
      setTickets(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const uniqueAssignees = Array.from(new Set(tickets.map(t => t.department).filter(Boolean)));

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchStatus = statusFilter === 'All' || ticket.status.toLowerCase() === statusFilter.toLowerCase();
      const matchPriority = priorityFilter === 'All' || ticket.priority.toLowerCase() === priorityFilter.toLowerCase();
      const matchAssignee = assigneeFilter === 'All' || ticket.department === assigneeFilter;
      const matchDate = dateFilter === '' || ticket.timeCreated.startsWith(dateFilter);
      return matchStatus && matchPriority && matchAssignee && matchDate;
    });
  }, [tickets, statusFilter, priorityFilter, assigneeFilter, dateFilter]);

  return {
    tickets: filteredTickets,
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
    refreshTickets: loadTickets
  };
}
