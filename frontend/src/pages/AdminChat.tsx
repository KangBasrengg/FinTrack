import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Users, Search } from 'lucide-react';
import api from '../api/axios';

export default function AdminChat() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setCurrentUserId(u.id || '');
      } catch (e) {}
    }
    fetchConversations();
  }, []);

  const fetchConversations = () => {
    api.get('/chat/conversations')
      .then(res => setConversations(res.data?.data || []))
      .catch(console.error);
  };

  const fetchMessages = (userId: string) => {
    api.get(`/chat/messages/${userId}`)
      .then(res => {
        setMessages(res.data?.data || []);
        // Refresh conversations to update unread counts
        fetchConversations();
      })
      .catch(console.error);
  };

  const selectUser = (convo: any) => {
    setSelectedUser(convo);
    fetchMessages(convo.user_id);

    // Start polling
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => fetchMessages(convo.user_id), 3000);
  };

  useEffect(() => {
    // Poll conversations list too
    const convoInterval = setInterval(fetchConversations, 5000);
    return () => {
      clearInterval(convoInterval);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await api.post('/chat/send', {
        message: newMessage.trim(),
        receiver_id: selectedUser.user_id,
      });
      setNewMessage('');
      fetchMessages(selectedUser.user_id);
    } catch (err) {
      console.error('Failed to send', err);
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <MessageCircle className="text-emerald-400" />
          Customer Support Chat
        </h1>
        <p className="text-slate-400 mt-1">Respon pesan dari pengguna secara real-time.</p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Conversation List */}
        <div className="w-80 shrink-0 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700">
              <Search size={16} className="text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pengguna..."
                className="bg-transparent border-none outline-none ml-2 w-full text-sm text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <Users size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Belum ada percakapan.</p>
              </div>
            )}
            {filteredConversations.map((convo: any) => (
              <div
                key={convo.user_id}
                onClick={() => selectUser(convo)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-slate-700/50 ${
                  selectedUser?.user_id === convo.user_id
                    ? 'bg-emerald-500/10 border-l-2 border-l-emerald-500'
                    : 'hover:bg-slate-700/30'
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                    {convo.user_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {convo.unread_count > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {convo.unread_count}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{convo.user_name}</p>
                  <p className="text-xs text-slate-400 truncate">{convo.last_message}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {new Date(convo.last_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl flex flex-col overflow-hidden">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                  {selectedUser.user_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-white">{selectedUser.user_name}</p>
                  <p className="text-xs text-emerald-400">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg: any) => {
                  const isMe = msg.sender_id === currentUserId;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          isMe
                            ? 'bg-emerald-500 text-white rounded-tr-sm'
                            : 'bg-slate-700 text-slate-200 rounded-tl-sm border border-slate-600'
                        }`}
                      >
                        {!isMe && <p className="text-[10px] text-indigo-400 font-semibold mb-1">{msg.sender_name}</p>}
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

              {/* Input */}
              <div className="p-4 border-t border-slate-700">
                <form onSubmit={handleSend} className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik balasan..."
                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium transition-colors flex items-center gap-2"
                  >
                    <Send size={16} />
                    Kirim
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <MessageCircle size={48} className="mx-auto mb-4 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-400">Pilih Percakapan</h3>
                <p className="text-sm text-slate-500 mt-1">Pilih pengguna dari daftar di sebelah kiri untuk<br/>mulai membalas pesan.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
