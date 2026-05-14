import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Type, Quote, List as ListIcon, ListOrdered, Link, Eye, Paperclip, X } from 'lucide-react';
import { Ticket } from '../../../types';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { subject: string; description: string; department: string; type: string; priority: string }) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [priority, setPriority] = useState('Medium');
  const [subject, setSubject] = useState('Ticket with and image');
  const [group, setGroup] = useState('IT Services');
  const [type, setType] = useState('Issue');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertUnorderedList: false,
    insertOrderedList: false,
  });
  const editorRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const updateFormatState = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    });
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateFormatState();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      setAttachments([...attachments, ...Array.from(e.clipboardData.files)]);
    }
  };

  const handleCreateTicket = (e: React.MouseEvent) => {
    e.preventDefault();
    const description = editorRef.current?.innerHTML || subject;
    
    onCreate({
      subject: subject || 'New Request',
      department: group || 'IT Services',
      description,
      type,
      priority
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto w-full h-full">
      <div className="bg-white rounded shadow-xl w-full max-w-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 sm:p-8 flex-1 text-[#334155]">
            <div className="mb-6">
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Subject</label>
                <input 
                type="text" 
                className="w-full border-b-[2px] border-dotted border-gray-300 py-1 outline-none focus:border-indigo-500 text-slate-800 text-[15px]" 
                value={subject} 
                onChange={e=>setSubject(e.target.value)}
                placeholder="Subject" 
                />
            </div>
            
            <div className="mb-6">
                <label className="text-[13px] font-bold text-[#1e3a8a] mb-1 block">Department</label>
                <select 
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-indigo-500 text-slate-800 bg-transparent text-[15px]"
                value={group} 
                onChange={e=>setGroup(e.target.value)}
                >
                <option value="IT Services">IT Services</option>
                <option value="Operation">Operation</option>
                <option value="Customer Services">Customer Services</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Sales">Sales</option>
                </select>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-1">
                <label className="text-[13px] font-bold text-[#1e3a8a] mb-1 block">Type</label>
                <select 
                  className="w-full border-b border-gray-300 py-2 outline-none focus:border-indigo-500 text-slate-800 bg-transparent text-[15px]"
                  value={type}
                  onChange={e => setType(e.target.value)}
                >
                    <option>Issue</option>
                    <option>Task</option>
                    <option>Request</option>
                </select>
                </div>
                <div className="flex-1">
                <label className="text-[13px] font-bold text-[#1e3a8a] mb-1 block">Tags</label>
                <input type="text" className="w-full border-b border-gray-300 py-2 outline-none focus:border-indigo-500 text-slate-800 text-[15px]" />
                </div>
            </div>

            <div className="mb-6">
                <label className="text-[13px] font-bold text-[#1e3a8a] mb-3 block">Priority</label>
                <div className="flex gap-4 items-center">
                {[
                    { label: 'Low', color: 'bg-[#64748b]' },
                    { label: 'Medium', color: 'bg-[#3b82f6]' },
                    { label: 'High', color: 'bg-[#ea580c]' },
                    { label: 'Urgent', color: 'bg-[#ef4444]' }
                ].map(p => (
                    <label key={p.label} onClick={() => setPriority(p.label)} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-[18px] h-[18px] rounded-full border-[2px] flex items-center justify-center transition-colors ${priority === p.label ? 'border-blue-500' : 'border-gray-500 group-hover:border-gray-700'}`}>
                        {priority === p.label && <div className="w-[8px] h-[8px] rounded-full bg-blue-500 flex-shrink-0"></div>}
                    </div>
                    <span className={`px-2 py-0.5 text-xs text-white rounded font-medium ${p.color}`}>
                        {p.label}
                    </span>
                    </label>
                ))}
                </div>
            </div>

            <div className="mb-2">
                <label className="text-[13px] text-gray-500 mb-1 block">Description</label>
                <div className="border border-gray-300 rounded flex flex-col">
                <div className="flex items-center gap-2 border-b border-gray-200 p-2 text-gray-400 overflow-x-auto whitespace-nowrap">
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); formatText('bold'); }} className={`transition-colors p-1 rounded ${activeFormats.bold ? 'bg-gray-200 text-gray-900' : 'hover:text-gray-800 hover:bg-gray-100'}`}><Bold size={16} strokeWidth={3}/></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); formatText('italic'); }} className={`transition-colors p-1 rounded ${activeFormats.italic ? 'bg-gray-200 text-gray-900' : 'hover:text-gray-800 hover:bg-gray-100'}`}><Italic size={16} strokeWidth={3}/></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); formatText('underline'); }} className={`transition-colors p-1 rounded ${activeFormats.underline ? 'bg-gray-200 text-gray-900' : 'hover:text-gray-800 hover:bg-gray-100'}`}><Underline size={16} strokeWidth={3}/></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); formatText('strikeThrough'); }} className={`transition-colors p-1 rounded ${activeFormats.strikeThrough ? 'bg-gray-200 text-gray-900' : 'hover:text-gray-800 hover:bg-gray-100'}`}><Type size={16} strokeWidth={3}/></button>
                    <div className="w-px h-4 bg-gray-300 shrink-0 mx-1"></div>
                    <button type="button" onMouseDown={(e) => { 
                      e.preventDefault(); 
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
                      editorRef.current?.focus();
                    }} className="transition-colors p-1 rounded hover:text-gray-800 hover:bg-gray-100"><Quote size={16} strokeWidth={3}/></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); formatText('insertUnorderedList'); }} className={`transition-colors p-1 rounded ${activeFormats.insertUnorderedList ? 'bg-gray-200 text-gray-900' : 'hover:text-gray-800 hover:bg-gray-100'}`}><ListIcon size={16} strokeWidth={3}/></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); formatText('insertOrderedList'); }} className={`transition-colors p-1 rounded ${activeFormats.insertOrderedList ? 'bg-gray-200 text-gray-900' : 'hover:text-gray-800 hover:bg-gray-100'}`}><ListOrdered size={16} strokeWidth={3}/></button>
                    <div className="w-px h-4 bg-gray-300 shrink-0 mx-1"></div>
                    <button type="button" onMouseDown={(e) => {
                      e.preventDefault();
                      const url = prompt('Enter link URL:');
                      if (url) {
                        const selection = window.getSelection();
                        if (selection && selection.isCollapsed) {
                          document.execCommand('insertHTML', false, `<a href="${url}" class="text-blue-500 hover:underline" target="_blank">${url}</a>`);
                        } else {
                          formatText('createLink', url);
                          if (editorRef.current) {
                            const links = editorRef.current.getElementsByTagName('a');
                            for (let i = 0; i < links.length; i++) {
                              links[i].classList.add('text-blue-500', 'hover:underline');
                              links[i].target = '_blank';
                            }
                          }
                        }
                      }
                    }} className="transition-colors p-1 rounded hover:text-gray-800 hover:bg-gray-100"><Link size={16} strokeWidth={3}/></button>
                </div>
                <div 
                    ref={editorRef}
                    contentEditable
                    onPaste={handlePaste}
                    onKeyUp={updateFormatState}
                    onMouseUp={updateFormatState}
                    className="w-full p-4 outline-none resize-y min-h-[160px] text-[15px] text-gray-800 leading-relaxed overflow-y-auto"
                    data-placeholder="Enter description here..."
                ></div>
                {attachments.length > 0 && (
                  <div className="p-4 border-t border-gray-200 flex flex-wrap gap-2">
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
                <div className="border-t border-dashed border-gray-300 p-4 text-[13px] text-gray-500 flex flex-col items-center justify-center relative cursor-pointer hover:bg-slate-50 transition-colors text-center w-full">
                    <span className="flex items-center gap-2">
                      <Paperclip size={16} /> 
                      Attach images, PDFs, or Docs by dragging & dropping or pasting from clipboard.
                    </span>
                    <input type="file" multiple onChange={handleFileUpload} accept=".pdf,.docx,.doc,.txt,image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>
                </div>
            </div>
            <p className="text-[12px] text-gray-500 leading-relaxed max-w-[95%] mt-2">
                Please try to be as specific as possible. Please include any details you think may be relevant, such as troubleshooting steps you've taken.
            </p>
        </div>
        
        <div className="p-6 pt-2 flex justify-end gap-6 items-center">
            <button 
            onClick={onClose}
            className="text-[#1e3a8a] font-bold text-[14px] hover:text-[#1e40af] transition-colors tracking-wide">
            CANCEL
            </button>
            <button 
            onClick={handleCreateTicket}
            className="text-[#3b82f6] font-bold text-[14px] hover:text-[#2563eb] transition-colors tracking-wide">
            CREATE
            </button>
        </div>
      </div>
    </div>
  );
};
