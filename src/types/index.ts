export interface TicketHistory {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
}

export interface TicketComment {
  id: string;
  author: string;
  authorEmail: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  isInternal: boolean;
}

export interface Ticket {
  id: string;
  requester: string;
  requesterAvatar: string;
  requesterEmail: string;
  subject: string;
  description: string;
  department: string;
  lastUpdated: string;
  timeCreated: string;
  status: string;
  priority: string;
  type: string;
  tags: string[];
  assignedTo: {
    id?: number | null;
    avatar: string;
    name: string;
    email: string;
    role: string;
  };
  comments: TicketComment[];
  history: TicketHistory[];
}
