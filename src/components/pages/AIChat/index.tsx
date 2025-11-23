import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import chatbotApi, { ChatMessage } from '../../../api/chatbotApi';

const AIChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessment, setAssessment] = useState<string>('');
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSession = async () => {
    try {
      setLoadingSession(true);
      const session = await chatbotApi.getSession();
      setSessionId(session.sessionId);
      setMessages(session.messages || []);
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setLoadingSession(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setLoading(true);

    // Add user message immediately
    const tempUserMsg: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await chatbotApi.sendMessage(userMessage);
      
      // Replace temp message with actual response
      setMessages((prev) => {
        const withoutTemp = prev.slice(0, -1);
        return [...withoutTemp, response.userMessage, response.aiResponse];
      });
      
      setSessionId(response.sessionId);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      // Remove temp message on error
      setMessages((prev) => prev.slice(0, -1));
      alert('Lỗi gửi tin nhắn: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) return;

    try {
      await chatbotApi.clearHistory();
      setMessages([]);
      alert('Đã xóa lịch sử chat');
    } catch (error) {
      console.error('Failed to clear history:', error);
      alert('Lỗi xóa lịch sử');
    }
  };

  const handleGetAssessment = async () => {
    try {
      setLoadingAssessment(true);
      setShowAssessment(true);
      const result = await chatbotApi.getAssessment();
      setAssessment(result.assessment);
    } catch (error) {
      console.error('Failed to get assessment:', error);
      alert('Lỗi tạo báo cáo đánh giá');
      setShowAssessment(false);
    } finally {
      setLoadingAssessment(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">AI Trợ Lý Học Tập</h1>
            <p className="text-sm text-gray-500">Hỏi đáp và tư vấn về học tập của bạn</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGetAssessment}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              📊 Đánh giá
            </button>
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              🗑️ Xóa lịch sử
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-lg">Chào {user?.fullName}!</p>
              <p className="text-sm">Hãy hỏi tôi bất cứ điều gì về học tập của bạn</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                    <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-white border-t px-6 py-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn... (Enter để gửi)"
              className="flex-1 resize-none border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !inputText.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '⏳' : '📤'}
            </button>
          </div>
        </div>
      </div>

      {/* Assessment Sidebar */}
      {showAssessment && (
        <div className="w-96 bg-white border-l overflow-auto">
          <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
            <h2 className="font-semibold">📊 Báo Cáo Đánh Giá</h2>
            <button
              onClick={() => setShowAssessment(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            {loadingAssessment ? (
              <div className="text-center text-gray-500">Đang tạo báo cáo...</div>
            ) : (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {assessment}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
