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
  const [attachments, setAttachments] = useState<File[]>([]);

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
      strikeThrough: document.queryCommandState('strikeThrough'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
    });
  };

  const handleCommand = (command: string, value?: string) => {
    if (command === 'quote') {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
          const text = selection.toString();
          document.execCommand('insertText', false, `"${text}"`);
      } else {
          document.execCommand('insertText', false, `""`);
          const sel = window.getSelection();
          if (sel) {
              sel.modify('move', 'backward', 'character');
          }
      }
    } else if (command === 'createLink') {
      const url = prompt('Enter link URL:');
      if (url) {
        const selection = window.getSelection();
        if (selection && selection.isCollapsed) {
          document.execCommand('insertHTML', false, `<a href="${url}" class="text-blue-500 hover:underline" target="_blank">${url}</a>`);
        } else {
          document.execCommand('createLink', false, url);
          if (editorRef.current) {
            const links = editorRef.current.getElementsByTagName('a');
            for (let i = 0; i < links.length; i++) {
              links[i].classList.add('text-blue-500', 'hover:underline');
              links[i].target = '_blank';
            }
          }
        }
      }
    } else {
      document.execCommand(command, false, value);
    }
    
    if (editorRef.current) {
      editorRef.current.focus();
      setCommentText(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      setAttachments([...attachments, ...Array.from(e.clipboardData.files)]);
    }
  };

  const handleSubmitComment = async () => {
    const cleanText = commentText.replace(/<[^>]*>/g, '').trim();
    if ((!cleanText && attachments.length === 0) || !ticket) return;
    
    let finalText = commentText;
    if (attachments.length > 0) {
      const attachmentNames = attachments.map(f => f.name).join(', ');
      finalText += `<br/><br/><div style="color: #64748b; font-size: 12px; padding: 8px; background: #f8fafc; border-radius: 4px;"><strong>Attachments:</strong> ${attachmentNames}</div>`;
    }
    
    try {
      await addTicketCommentApi(ticketId, finalText, false, currentUser.id);
      setCommentText('');
      setAttachments([]);
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
    attachments,
    handleFileUpload,
    handleRemoveAttachment,
    handlePaste,
    hasChanges: ticket ? (
      currentStatus !== ticket.status || 
      currentPriority !== ticket.priority || 
      currentType !== ticket.type || 
      currentTags.join(',') !== (ticket.tags || []).join(',')
    ) : false
  };
}
