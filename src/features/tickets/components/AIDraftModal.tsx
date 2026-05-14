import React, { useState, useEffect } from 'react';
import { X, Wand2, FileText, Globe, Loader2, AlertCircle } from 'lucide-react';

interface AIDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDraftGenerated: (draft: any) => void;
}

export const AIDraftModal: React.FC<AIDraftModalProps> = ({ isOpen, onClose, onDraftGenerated }) => {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingFiles, setIsFetchingFiles] = useState(false);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchDriveFiles();
    }
  }, [isOpen]);

  const fetchDriveFiles = async () => {
    setIsFetchingFiles(true);
    setError(null);
    try {
      const response = await fetch('/api/drive/files');
      const data = await response.json();
      if (data.files) {
        setDriveFiles(data.files);
      } else if (data.message) {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to connect to backend.');
    } finally {
      setIsFetchingFiles(false);
    }
  };

  const handleGenerateDraft = async () => {
    if (!content && !selectedFileId) return;

    setIsProcessing(true);
    setError(null);
    try {
      const response = await fetch('/api/tickets/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, fileId: selectedFileId }),
      });

      const data = await response.json();
      if (data.draft) {
        onDraftGenerated(data.draft);
        onClose();
      } else {
        setError(data.message || 'AI failed to generate a draft.');
      }
    } catch (err) {
      setError('Communication error with the server.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Wand2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">AI Ticket Draft</h3>
              <p className="text-xs text-gray-500">Generate a ticket from notes or Google Drive</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-[13px] font-bold text-gray-700 mb-3 block flex items-center gap-2">
              <FileText size={16} className="text-gray-400" />
              Raw Notes / Message
            </label>
            <textarea
              className="w-full h-32 p-4 text-[14px] border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none bg-slate-50/30"
              placeholder="Paste the customer's email, chat logs, or your rough notes here..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (e.target.value) setSelectedFileId(null);
              }}
              disabled={isProcessing}
            ></textarea>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-medium">OR FETCH FROM DRIVE</span>
            </div>
          </div>

          <div>
            <label className="text-[13px] font-bold text-gray-700 mb-3 block flex items-center gap-2">
              <Globe size={16} className="text-gray-400" />
              Select Recent File
            </label>
            <div className="grid gap-2 max-h-40 overflow-y-auto pr-1">
              {isFetchingFiles ? (
                <div className="flex items-center justify-center py-4 text-gray-400 gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-xs">Connecting to Drive...</span>
                </div>
              ) : driveFiles.length > 0 ? (
                driveFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => {
                      setSelectedFileId(file.id);
                      setContent('');
                    }}
                    className={`flex items-center gap-3 p-3 text-left rounded-lg border transition-all ${
                      selectedFileId === file.id
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <FileText size={16} className={selectedFileId === file.id ? 'text-indigo-500' : 'text-gray-400'} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{file.name}</div>
                      <div className="text-[10px] opacity-70">
                        {new Date(file.createdTime).toLocaleDateString()} at {new Date(file.createdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  No files found in the shared folder
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateDraft}
            disabled={isProcessing || (!content && !selectedFileId)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Generate Draft
                <Wand2 size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
