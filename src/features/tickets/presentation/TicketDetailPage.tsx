import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Printer, 
  ToggleRight, 
  MoreVertical, 
  Paperclip, 
  Edit2, 
  X,
  Send,
  Bold,
  Italic,
  Underline,
  Type,
  Code,
  Quote,
  List,
  ListOrdered,
  Link,
  Eye,
  User,
  History,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { StatusBadge } from '../components/Badges';
import { useTicketDetail } from '../logic/useTicketDetail';
import { AuthenticatedUser } from '../../auth/authTypes';

interface TicketDetailPageProps {
  ticketId: string;
  currentUser: AuthenticatedUser;
  onBack: () => void;
}

const Avatar = ({ src, alt, email, className }: { src: string; alt: string; email: string; className: string }) => {
  if (!src) {
    const initial = email ? email.charAt(0).toUpperCase() : alt ? alt.charAt(0).toUpperCase() : '?';
    return (
      <div className={`${className} bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase shrink-0`}>
        {initial}
      </div>
    );
  }
  return <img src={src} alt={alt} className={`${className} shrink-0 object-cover`} />;
};

export function TicketDetailPage({ ticketId, currentUser, onBack }: TicketDetailPageProps) {
  const {
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
    hasChanges
  } = useTicketDetail(ticketId, currentUser);

  if (isLoading) {
    return <div className="p-6 text-gray-500 flex h-full items-center justify-center">Loading ticket details...</div>;
  }

  if (error || !ticket) {
    return <div className="p-6 text-red-500 flex h-full items-center justify-center">Error: {error || 'Ticket not found'}</div>;
  }

  const filteredHistoryAndComments = [...ticket.comments, ...ticket.history].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900 overflow-hidden font-sans w-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">Ticket #{ticket.id}</h1>
            <StatusBadge status={currentStatus} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          { hasChanges ? (
            <button 
              onClick={handleSave}
              className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-bold transition-colors shadow-sm"
            >
              Save Changes
            </button>
          ) : (
            <span className="text-xs font-semibold text-gray-400 px-4 py-1.5">No changes</span>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Sidebar */}
        <aside className="w-72 bg-gray-50 border-r border-gray-200 overflow-y-auto p-6 space-y-8 shrink-0 custom-scrollbar">
          {/* Assignee Section */}
          <section>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Assignee</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar 
                  src={ticket.assignedTo.avatar} 
                  alt={ticket.assignedTo.name} 
                  email={ticket.assignedTo.email}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{ticket.assignedTo.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{ticket.assignedTo.email}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{ticket.assignedTo.role}</p>
              </div>
            </div>
          </section>

          {/* Ticket Info Section */}
          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Status</label>
                <div className="relative">
                  <select 
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-700 appearance-none outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    {['Draft', 'Reviewed', 'Published', 'Closed'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Type</label>
                <div className="relative">
                  <select 
                    value={currentType}
                    onChange={(e) => setCurrentType(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-700 appearance-none outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    {['Task', 'Incident', 'Problem', 'Question'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Priority</label>
                <div className="relative">
                  <select 
                    value={currentPriority}
                    onChange={(e) => setCurrentPriority(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-700 appearance-none outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    {['Low', 'Medium', 'High', 'Urgent', 'Critical'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {currentTags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-medium rounded border border-blue-100 flex items-center gap-1 group">
                    {tag}
                    <button 
                      onClick={() => setCurrentTags(currentTags.filter(t => t !== tag))}
                      className="opacity-50 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              {currentTags.length < 3 && (
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTagInput.trim()) {
                      e.preventDefault();
                      if (!currentTags.includes(newTagInput.trim())) {
                        setCurrentTags([...currentTags, newTagInput.trim()]);
                      }
                      setNewTagInput('');
                    }
                  }}
                  className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-700 outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-colors placeholder:text-gray-400"
                  placeholder="Type tag & press Enter..."
                />
              )}
            </div>
          </section>

          {/* Ticket History Section */}
          <section>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Ticket History</h3>
            <div className="space-y-4 pr-2 text-xs">
              {ticket.history.map(item => (
                <div key={item.id} className="relative pl-4 border-l border-gray-200 pb-4 last:pb-0">
                  <div className="absolute left-[-5px] top-1 w-2 h-2 bg-gray-300 rounded-full"></div>
                  <p className="font-bold text-gray-600">{item.timestamp}</p>
                  <p className="text-gray-500 mt-1">
                    Action by: <span className="text-blue-600">{item.actor}</span>
                  </p>
                  <p className="text-gray-400 mt-0.5 italic">{item.action}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white min-w-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-8 space-y-8">
              {/* Original Incident Report */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 group"
              >
                <Avatar src={ticket.requesterAvatar} alt={ticket.requester} email={ticket.requesterEmail || ''} className="w-10 h-10 rounded-full shadow-sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-[15px] font-semibold text-gray-900">{ticket.subject}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-blue-600">{ticket.requester}</span>
                        <span className="text-[11px] text-gray-400 ml-2">{ticket.timeCreated}</span>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100"
                    dangerouslySetInnerHTML={{ __html: ticket.description }}
                  />
                </div>
              </motion.div>

              {/* Content Filters */}
              <div className="flex items-center gap-6 border-b border-gray-100 pb-1">
                {[
                  { id: 'Comments', label: 'Comments', count: ticket.comments.length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 pb-2 text-xs font-bold uppercase tracking-wider transition-all relative ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {tab.count}
                    </span>
                    {activeTab === tab.id && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Comments Thread */}
              <div className="space-y-8">
                {ticket.comments.map(comment => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={comment.id} 
                    className={`flex gap-4 group`}
                  >
                    <Avatar src={comment.authorAvatar} alt={comment.author} email={comment.authorEmail} className="w-10 h-10 rounded-full shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-gray-900">Re: {ticket.subject}</h3>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-blue-600">{comment.author}</span>
                            <span className="text-[11px] text-gray-400">&lt;{comment.authorEmail}&gt;</span>
                            <span className="text-[11px] text-gray-400 ml-2">{comment.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm p-5 rounded-xl border bg-white border-gray-100 text-gray-700 shadow-sm"
                           dangerouslySetInnerHTML={{ __html: comment.text }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Combined Comment Editor - Integrated at the bottom across page */}
            <div id="comment-editor" className="mt-auto shrink-0">
              <div className="bg-white border-t border-gray-200 overflow-hidden flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-6 px-8 py-3 border-b border-gray-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Comment</span>
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-1 px-8 py-2 border-b border-gray-100 bg-gray-50/50 overflow-x-auto whitespace-nowrap">
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('bold'); }} className={`p-1.5 rounded transition-all ${activeFormats.bold ? 'bg-gray-200 text-gray-900 border border-gray-300' : 'text-slate-400 hover:text-gray-900 hover:bg-gray-200'}`}><Bold size={16} strokeWidth={3} /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('italic'); }} className={`p-1.5 rounded transition-all ${activeFormats.italic ? 'bg-gray-200 text-gray-900 border border-gray-300' : 'text-slate-400 hover:text-gray-900 hover:bg-gray-200'}`}><Italic size={16} strokeWidth={3} /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('underline'); }} className={`p-1.5 rounded transition-all ${activeFormats.underline ? 'bg-gray-200 text-gray-900 border border-gray-300' : 'text-slate-400 hover:text-gray-900 hover:bg-gray-200'}`}><Underline size={16} strokeWidth={3} /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('strikeThrough'); }} className={`p-1.5 rounded transition-all ${activeFormats.strikeThrough ? 'bg-gray-200 text-gray-900 border border-gray-300' : 'text-slate-400 hover:text-gray-900 hover:bg-gray-200'}`}><Type size={16} strokeWidth={3} /></button>
                    <div className="w-px h-4 bg-gray-300 mx-1 shrink-0"></div>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('quote'); }} className="p-1.5 rounded transition-all text-slate-400 hover:text-gray-900 hover:bg-gray-200"><Quote size={16} strokeWidth={3} /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('insertUnorderedList'); }} className={`p-1.5 rounded transition-all ${activeFormats.unorderedList ? 'bg-gray-200 text-gray-900 border border-gray-300' : 'text-slate-400 hover:text-gray-900 hover:bg-gray-200'}`}><List size={16} strokeWidth={3} /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('insertOrderedList'); }} className={`p-1.5 rounded transition-all ${activeFormats.orderedList ? 'bg-gray-200 text-gray-900 border border-gray-300' : 'text-slate-400 hover:text-gray-900 hover:bg-gray-200'}`}><ListOrdered size={16} strokeWidth={3} /></button>
                    <div className="w-px h-4 bg-gray-300 mx-1 shrink-0"></div>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('createLink'); }} className="p-1.5 rounded transition-all text-slate-400 hover:text-gray-900 hover:bg-gray-200"><Link size={16} strokeWidth={3} /></button>
                  </div>
                  <div 
                    ref={editorRef}
                    contentEditable
                    onInput={(e) => {
                      setCommentText(e.currentTarget.innerHTML);
                      updateActiveFormats();
                    }}
                    onPaste={handlePaste}
                    onKeyUp={updateActiveFormats}
                    onMouseUp={updateActiveFormats}
                    placeholder="Enter description here..."
                    className="w-full bg-white px-8 py-6 text-[15px] text-gray-800 resize-none outline-none min-h-[160px] max-h-[400px] overflow-y-auto empty:before:content-[attr(placeholder)] empty:before:text-gray-400 leading-relaxed active:border-0"
                  />
                  {attachments.length > 0 && (
                    <div className="px-8 py-4 border-t border-gray-100 flex flex-wrap gap-2">
                      {attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded text-[13px] text-gray-700 font-medium">
                          <Paperclip size={14} />
                          <span className="truncate max-w-[150px]">{file.name}</span>
                          <button type="button" onClick={() => handleRemoveAttachment(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 relative cursor-pointer hover:text-blue-600 transition-colors">
                      <Paperclip size={16} className="text-gray-500" />
                      <span className="text-xs font-medium text-gray-500">Attach files</span>
                      <input type="file" multiple onChange={handleFileUpload} accept=".pdf,.docx,.doc,.txt,image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    </div>
                    <button 
                      onClick={handleSubmitComment}
                      disabled={!commentText.replace(/<[^>]*>/g, '').trim() && attachments.length === 0}
                      className={`flex items-center gap-2 px-8 py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-200`}
                    >
                      <Send size={14} />
                      Send Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}