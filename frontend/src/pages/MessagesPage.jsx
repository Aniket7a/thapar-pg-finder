import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Send, User, Building2, Check, CheckCheck, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MessagesPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('user');
  const targetPropId = searchParams.get('property');

  const [conversations, setConversations] = useState([]);
  const [activeUserId, setActiveUserId] = useState(targetUserId || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch all conversation threads
  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations || []);
        if (!activeUserId && res.data.conversations?.length > 0) {
          setActiveUserId(res.data.conversations[0].user?._id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch thread for active user
  const fetchThread = async (userId) => {
    if (!userId) return;
    try {
      const res = await api.get(`/messages/thread/${userId}`);
      if (res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeUserId) {
      fetchThread(activeUserId);
      const interval = setInterval(() => fetchThread(activeUserId), 4000);
      return () => clearInterval(interval);
    }
  }, [activeUserId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUserId) return;

    setSending(true);
    try {
      const res = await api.post('/messages', {
        receiverId: activeUserId,
        propertyId: targetPropId || undefined,
        content: newMessage.trim(),
      });

      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setNewMessage('');
        fetchConversations();
      }
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const activeCounterparty =
    conversations.find((c) => c.user?._id === activeUserId)?.user ||
    (targetUserId ? { _id: targetUserId, name: 'Landlord / Student' } : null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[750px]">
        {/* Left: Conversation List */}
        <div className="border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h2 className="font-extrabold text-slate-900 text-base">In-App Messages</h2>
            <p className="text-xs text-slate-500">Communicate directly regarding stays & visits</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active conversations yet. Visit a PG listing to send a direct message.
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.user?._id}
                  type="button"
                  onClick={() => setActiveUserId(c.user?._id)}
                  className={`w-full text-left p-4 flex items-center gap-3 transition ${
                    activeUserId === c.user?._id
                      ? 'bg-red-50/80 border-l-4 border-red-600'
                      : 'hover:bg-slate-100/60'
                  }`}
                >
                  <img
                    src={c.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={c.user?.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-slate-900 truncate block">
                        {c.user?.name}
                      </strong>
                      {c.unreadCount > 0 && (
                        <span className="w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {c.lastMessage?.content || 'No messages yet'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {activeCounterparty ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <img
                    src={activeCounterparty.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <strong className="text-xs sm:text-sm text-slate-900 block">
                      {activeCounterparty.name}
                    </strong>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {activeCounterparty.role || 'User'} • Patiala
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">Secure Direct Thread</div>
              </div>

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                {messages.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 text-xs">
                    Start a conversation with {activeCounterparty.name}. Ask about room vacancies, gate pass timings, or meal plans.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender?._id === user?._id || m.sender === user?._id;
                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-red-600 text-white rounded-br-none'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                          }`}
                        >
                          {m.content}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 px-1">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-300" />
              <span>Select a contact from the left list to view conversation.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
