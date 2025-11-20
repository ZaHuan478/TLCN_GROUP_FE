import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import socketService from "../../../services/socket";
import { useAuth } from "../../../contexts/AuthContext";
import conversationApi, { ConversationListItem } from "../../../api/conversationApi";

const ConnectionsPage: React.FC = () => {
  const { user } = useAuth();
  const { resetUnread } = useAuth() as any;
  const location = useLocation();
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [selected, setSelected] = useState<ConversationListItem | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchConversations();
    try { resetUnread(); } catch (e) {}
  }, []);

  // handle possible conversationId in query params to auto-select
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const convoId = params.get("conversationId");
    if (!convoId) return;
    // once conversations loaded, select matching conversation
    if (conversations.length > 0) {
      const found = conversations.find((c) => c.conversation.id === convoId);
      if (found) setSelected(found);
    }
  }, [conversations]);

  useEffect(() => {
    if (selected) {
      fetchMessages(selected.conversation.id);
      // ensure socket is connected and join conversation room for real-time updates
      try {
        const sock = socketService.connectSocket(user?.id || '');
        if (sock) {
          if ((sock as any).connected) {
            socketService.joinConversationRoom(selected.conversation.id);
          } else {
            const onConn = () => {
              try { socketService.joinConversationRoom(selected.conversation.id); } catch (e) {}
              try { (sock as any).off('connect', onConn); } catch (e) {}
            };
            (sock as any).on('connect', onConn);
          }
        }
      } catch (e) {
        console.error('Failed to join conversation room', e);
      }
    }
  }, [selected]);

  // leave conversation room when switching or unmounting
  useEffect(() => {
    let prevId: string | null = null;
    if (selected) prevId = selected.conversation.id;
    return () => {
      if (prevId) {
        try { socketService.leaveConversationRoom(prevId); } catch (e) {}
      }
    };
  }, [selected]);

  // subscribe to new_message socket events
  useEffect(() => {
    const off = socketService.onNewMessage((payload: any) => {
      try {
        if (!payload) return;
        const { conversationId, message } = payload;
        // ignore messages sent by ourselves to avoid duplicate (we already append REST response)
        if (message && message.sender && user && String(message.sender.id) === String(user.id)) {
          return;
        }
        // only append if it's for the currently selected conversation
        if (selected && selected.conversation.id === conversationId) {
          setMessages((s) => [...s, message]);
          scrollToBottom();
        } else {
          // optionally update conversation list preview (lastMessage)
          setConversations((prev) => prev.map((c) => {
            if (c.conversation.id === conversationId) {
              return { ...c, lastMessage: message };
            }
            return c;
          }));
        }
      } catch (e) {
        console.error('Error handling new_message payload', e);
      }
    });

    return () => {
      try {
        if (off && typeof off === 'function') off();
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const fetchConversations = async () => {
    try {
      const data = await conversationApi.listConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const msgs = await conversationApi.getMessages(conversationId, { limit: 50 });
      setMessages(msgs);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (item: ConversationListItem) => {
    setSelected(item);
  };

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleSend = async () => {
    if (!selected) return;
    if (!messageText.trim()) return;
    try {
      const newMsg = await conversationApi.sendMessage(selected.conversation.id, messageText.trim());
      setMessages((s) => [...s, newMsg]);
      setMessageText("");
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const otherParticipant = (item: ConversationListItem) => {
    if (!user) return null;
    return item.participants.find((p) => p.id !== user.id) || item.participants[0];
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Left: list */}
      <div className="w-80 border-r bg-white overflow-auto">
        <div className="p-4 font-semibold">Connections</div>
        {conversations.length === 0 && <div className="p-4 text-sm text-gray-500">Không có cuộc trò chuyện</div>}
        <ul>
          {conversations.map((c) => {
            const other = otherParticipant(c);
            return (
              <li
                key={c.conversation.id}
                onClick={() => handleSelect(c)}
                className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 ${selected?.conversation.id === c.conversation.id ? 'bg-gray-100' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {other?.avatar ? (
                    <img src={other.avatar} alt={other.username || other.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold">{(other?.fullName || other?.username || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{other?.fullName || other?.username || 'Unknown'}</div>
                  <div className="text-xs text-gray-500 truncate">{c.lastMessage?.content || 'No messages yet'}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right: chat */}
      <div className="flex-1 flex flex-col">
        {selected ? (
          <>
            <div className="p-4 border-b font-semibold">{otherParticipant(selected)?.fullName || otherParticipant(selected)?.username}</div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded ${m.senderId === user?.id ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                      <div className="text-sm">{m.content}</div>
                      <div className="text-[10px] text-gray-400 mt-1 text-right">{new Date(m.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-4 border-t flex items-center gap-3 bg-white">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Gửi tin nhắn..."
                className="flex-1 border rounded px-3 py-2"
              />
              <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">Chọn một connection để bắt đầu trò chuyện</div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
