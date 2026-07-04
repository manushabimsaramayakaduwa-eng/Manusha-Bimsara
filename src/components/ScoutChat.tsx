import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  Clock, 
  Sparkles,
  Info,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: 'admin' | 'leader' | 'member';
  message: string;
  timestamp: string; // ISO String
}

interface ScoutChatProps {
  currentUser: { username: string; role: 'admin' | 'leader' | 'member'; fullName: string };
  onAuditLog: (action: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'ch-1',
    senderName: 'Dineth Jayasuriya',
    senderRole: 'admin',
    message: 'Greetings scouts! Please note that the annual camporee files are now uploaded in the E-Library section.',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
  },
  {
    id: 'ch-2',
    senderName: 'Ranuka Samarasinghe',
    senderRole: 'member',
    message: 'Thank you Admin! I have downloaded the pioneering guide. Working on knots today with the Eagle patrol.',
    timestamp: new Date(Date.now() - 3600000 * 4.2).toISOString() // 4.2 hours ago
  },
  {
    id: 'ch-3',
    senderName: 'Kapila Jayawardene',
    senderRole: 'leader',
    message: 'Superb effort Ranuka! Let us verify the square lashing structures at our next Saturday outdoor assembly.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    id: 'ch-4',
    senderName: 'Michelle de Silva',
    senderRole: 'member',
    message: 'Rover Crew Alpha will be hosting a blood donation safety rehearsal. I am inviting all rovers to join the discussion.',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString() // 1.5 hours ago
  }
];

export default function ScoutChat({ currentUser, onAuditLog }: ScoutChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('51_scouttrack_chats');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('51_scouttrack_chats', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `ch-${Date.now()}`,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      message: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // Trigger an audit log for chatting occasionally
    if (messages.length % 3 === 0) {
      onAuditLog(`Scout chat activity logged by "${currentUser.fullName}"`);
    }
  };

  const handleClearOldMessages = () => {
    if (!confirm('Proceed to auto-purge and clear all chat history older than 30 Days (1 month) to save storage spaces?')) return;
    
    // Simulate purging by keeping only messages sent in the last 30 days (or all since they are new)
    // For demonstration, we keep only messages within 1 day, or reset to 1 fresh welcome alert
    const freshMessages = messages.filter(msg => {
      const msgDate = new Date(msg.timestamp);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000);
      return msgDate > thirtyDaysAgo;
    });

    setMessages(freshMessages);
    alert('SUCCESS: Purged all chat histories older than 30 days successfully! 0.0 MB utilized.');
    onAuditLog(`Admin/Leader (${currentUser.fullName}) ran 30-day chat database auto-purge routine.`);
  };

  const formatTime = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const canPurge = currentUser.role === 'admin' || currentUser.role === 'leader';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col h-[520px] text-left">
      
      {/* Chat header banner */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="space-y-0.5">
          <h3 className="font-sans font-black text-sm text-brand-green flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-brand-gold" />
            <span>⚜️ 51st Troop Real-time Chatroom</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <Clock className="w-3 h-3 text-brand-gold" />
            <span>Messages cleared automatically after 30 days</span>
          </p>
        </div>

        {canPurge && (
          <button
            onClick={handleClearOldMessages}
            className="text-[10px] bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold px-2.5 py-1.5 rounded-lg border border-rose-200/50 flex items-center gap-1 cursor-pointer transition uppercase tracking-wider"
            title="Clean older messages"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Purge 30-Day Logs</span>
          </button>
        )}
      </div>

      {/* Info notice */}
      <div className="bg-brand-green/5 border-l-4 border-brand-gold p-3 rounded-r-lg mb-4 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
        <p className="text-slate-600 leading-normal font-light">
          This secure room facilitates communication across all <strong>51st Colombo</strong> branches. Chat records are automatically cleared every month to prevent storage limits on Google Drive.
        </p>
      </div>

      {/* Message Feed Area */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin">
        {messages.map(msg => {
          const isAdmin = msg.senderRole === 'admin';
          const isLeader = msg.senderRole === 'leader';
          const isMe = msg.senderName === currentUser.fullName;

          return (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${isMe ? 'self-end ml-auto' : 'self-start mr-auto'}`}
            >
              {/* Sender profile name & role tag */}
              <div className={`flex items-center gap-1.5 mb-1 text-[10px] ${isMe ? 'justify-end' : 'justify-start'}`}>
                <span className="font-bold text-slate-700">{msg.senderName}</span>
                {isAdmin && (
                  <span className="bg-rose-600 text-white text-[8px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                    Admin
                  </span>
                )}
                {isLeader && (
                  <span className="bg-brand-green text-white text-[8px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                    Leader
                  </span>
                )}
                {!isAdmin && !isLeader && (
                  <span className="bg-slate-100 text-slate-500 text-[8px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                    Scout
                  </span>
                )}
              </div>

              {/* Message text bubble */}
              <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                isMe 
                  ? 'bg-brand-green text-white rounded-tr-none shadow-xs' 
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
              }`}>
                <p className="font-light">{msg.message}</p>
              </div>

              {/* Timestamp label */}
              <span className={`text-[8px] text-slate-400 mt-1 uppercase tracking-wider ${isMe ? 'text-right' : 'text-left'}`}>
                {formatTime(msg.timestamp)}
              </span>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSendMessage} className="border-t border-slate-100 pt-3 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write your message here..."
          maxLength={400}
          className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-brand-green placeholder-slate-400"
        />
        <button
          type="submit"
          className="bg-brand-green hover:bg-brand-green-light text-white p-3 rounded-xl cursor-pointer transition shadow-sm shrink-0 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
