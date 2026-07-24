import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Headphones } from 'lucide-react';
import api from '../../api/axios';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [adminId, setAdminId] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setIsLoggedIn(true);
      try {
        const u = JSON.parse(userStr);
        setCurrentUserId(u.id || '');
      } catch (e) {}
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch admin ID on mount
  useEffect(() => {
    if (!isLoggedIn) return;
    api.get('/chat/admin-id')
      .then(res => setAdminId(res.data?.data?.admin_id || ''))
      .catch(() => {});
  }, [isLoggedIn]);

  // Fetch messages when chat opens
  const fetchMessages = () => {
    if (!adminId || !isLoggedIn) return;
    api.get(`/chat/messages/${adminId}`)
      .then(res => {
        const msgs = res.data?.data || [];
        setMessages(msgs);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (isOpen && adminId) {
      fetchMessages();
      // Poll every 3 seconds for new messages
      pollingRef.current = setInterval(fetchMessages, 3000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isOpen, adminId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isLoggedIn) return;

    try {
      await api.post('/chat/send', { 
        message: message.trim(),
        receiver_id: adminId 
      });
      setMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  // Don't show bubble if not logged in
  if (!isLoggedIn) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[420px] animate-in slide-in-from-bottom-5 fade-in duration-200">
          {/* Header */}
          <div className="bg-emerald-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Headphones size={20} className="text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-emerald-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-white leading-tight">Admin Support</h3>
                <p className="text-xs text-emerald-100">Chat langsung dengan admin</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 text-sm mt-8">
                <Headphones size={32} className="mx-auto mb-2 opacity-40" />
                <p>Mulai percakapan dengan admin.</p>
                <p className="text-xs mt-1">Pesan Anda akan langsung diterima oleh tim CS.</p>
              </div>
            )}
            {messages.map((msg: any) => {
              const isMe = msg.sender_id === currentUserId;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      isMe
                        ? 'bg-emerald-500 text-white rounded-tr-sm shadow-sm shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
                    }`}
                  >
                    {!isMe && <p className="text-[10px] text-emerald-400 font-semibold mb-1">{msg.sender_name || 'Admin'}</p>}
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-800 bg-slate-900">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pesan Anda..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 flex items-center justify-center text-white transition-colors"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 transition-transform duration-200 ${isOpen ? 'bg-slate-700 scale-90' : 'bg-emerald-500 hover:bg-emerald-600 hover:scale-105'}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}
