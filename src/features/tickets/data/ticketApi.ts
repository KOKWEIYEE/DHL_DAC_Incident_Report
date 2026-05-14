import { Ticket } from '../../../types';

const API_BASE_URL = 'http://localhost:4000/api';

export async function fetchTicketsApi(assignedToUserId?: number): Promise<Ticket[]> {
  const url = assignedToUserId ? `${API_BASE_URL}/tickets?assignee_id=${assignedToUserId}` : `${API_BASE_URL}/tickets`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  const data = await response.json();
  return data.tickets;
}

export async function createTicketApi(
  ticketData: { subject: string; description: string; department: string; requester_id: number; type?: string; priority?: string; tags?: string[]; assignee_id?: number | null }
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...ticketData,
      assignee_id: ticketData.assignee_id // Ensure consistency with server naming
    })
  });
  if (!response.ok) {
    throw new Error('Failed to create ticket');
  }
}

export async function fetchTicketByIdApi(id: string): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch ticket');
  }
  const data = await response.json();
  return data.ticket;
}

export async function updateTicketApi(id: string, updates: Partial<Ticket>, actorId: number, historyAction: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...updates, actor_id: actorId, history_action: historyAction })
  });
  if (!response.ok) {
    throw new Error('Failed to update ticket');
  }
}

export async function addTicketCommentApi(ticketId: string, text: string, isInternal: boolean, authorId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, is_internal: isInternal, author_id: authorId })
  });
  if (!response.ok) {
    throw new Error('Failed to add comment');
  }
}

export async function deleteTicketApi(id: string, actorId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}?actorId=${actorId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete ticket');
  }
}

export async function deleteCommentApi(ticketId: string, commentId: string, actorId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/comments/${commentId}?actorId=${actorId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete comment');
  }
}
