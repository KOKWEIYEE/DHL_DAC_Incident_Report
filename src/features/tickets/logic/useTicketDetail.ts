import { useState, useEffect, useRef } from 'react';
import { Ticket } from '../../../types';
import { fetchTicketByIdApi, updateTicketApi, addTicketCommentApi } from '../data/ticketApi';
import { AuthenticatedUser } from '../../auth/authTypes';

export function useTicketDetail(ticketId: string, currentUser: AuthenticatedUser) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState<'Comments'>('Comments');
  
  const [currentStatus, setCurrentStatus] = useState('');
  const [currentPriority, setCurrentPriority] = useState('');
  const [currentType, setCurrentType] = useState('');
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<{ [key: string]: boolean }>({});

  const loadTicket = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTicketByIdApi(ticketId);
      setTicket(data);
      setCurrentStatus(data.status);
      setCurrentPriority(data.priority);
      setCurrentType(data.type);
      setCurrentTags(data.tags || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
    });
  };

  const handleCommand = (command: string) => {
    document.execCommand(command, false);
    updateActiveFormats();
    if (editorRef.current) {
      setCommentText(editorRef.current.innerHTML);
    }
  };

  const handleSubmitComment = async () => {
    const cleanText = commentText.replace(/<[^>]*>/g, '').trim();
    if (!cleanText || !ticket) return;
    
    try {
      await addTicketCommentApi(ticketId, commentText, false, currentUser.id);
      setCommentText('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      setActiveFormats({});
      await loadTicket(); // Refresh to show new comment
    } catch (err: any) {
      alert(`Error adding comment: ${err.message}`);
    }
  };

  const handleSave = async () => {
    if (!ticket) return;
    
    let hasChanges = false;
    const updates: Partial<Ticket> = {};
    const actions: string[] = [];

    if (currentStatus !== ticket.status) {
        hasChanges = true;
        updates.status = currentStatus;
        actions.push(`Ticket Status set to: ${currentStatus}`);
    }
    if (currentPriority !== ticket.priority) {
        hasChanges = true;
        updates.priority = currentPriority;
        actions.push(`Ticket Priority set to: ${currentPriority}`);
    }
    if (currentType !== ticket.type) {
        hasChanges = true;
        updates.type = currentType;
        actions.push(`Ticket Type set to: ${currentType}`);
    }
    
    const newTags = [...currentTags];
    if (newTags.join(',') !== (ticket.tags || []).join(',')) {
        hasChanges = true;
        updates.tags = newTags;
        actions.push(`Ticket Tags updated`);
    }

    if (hasChanges) {
      try {
        await updateTicketApi(ticketId, updates, currentUser.id, actions.join(', '));
        await loadTicket(); // refresh
      } catch (err: any) {
        alert(`Error saving changes: ${err.message}`);
      }
    }
  };

  return {
    ticket,
    isLoading,
    error,
    commentText,
    setCommentText,
    activeTab,
    setActiveTab,
    currentStatus,
    setCurrentStatus,
    currentPriority,
    setCurrentPriority,
    currentType,
    setCurrentType,
    currentTags,
    setCurrentTags,
    newTagInput,
    setNewTagInput,
    editorRef,
    activeFormats,
    updateActiveFormats,
    handleCommand,
    handleSubmitComment,
    handleSave,
    hasChanges: ticket ? (
      currentStatus !== ticket.status || 
      currentPriority !== ticket.priority || 
      currentType !== ticket.type || 
      currentTags.join(',') !== (ticket.tags || []).join(',')
    ) : false
  };
}
