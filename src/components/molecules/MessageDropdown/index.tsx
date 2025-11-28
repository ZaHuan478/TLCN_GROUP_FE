import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { useAuth } from '../../../contexts/AuthContext';

const MessageDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadMessages, resetUnread, notifications, clearNotifications } = useAuth() as any;
  const navigate = useNavigate();

  const handleMessageClick = (conversationId: string) => {
    try {
      resetUnread && resetUnread();
      clearNotifications && clearNotifications();
      navigate(`/connections?conversationId=${conversationId}`);
      setIsOpen(false);
    } catch (e) {
      console.error('Error handling message click:', e);
    }
  };

  const handleViewAllMessages = () => {
    try {
      resetUnread && resetUnread();
      clearNotifications && clearNotifications();
      navigate('/connections');
      setIsOpen(false);
    } catch (e) {
      console.error('Error viewing all messages:', e);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="relative">
      <Button
        onClick={() => {
          setIsOpen(!isOpen);
          try {
            resetUnread && resetUnread();
          } catch (e) {
            console.error('Error resetting unread:', e);
          }
        }}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        title="Messages"
      >
        <MessageCircle className="w-6 h-6" />
        {(unreadMessages || 0) > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadMessages > 9 ? '9+' : unreadMessages}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Messages</h3>
            <p className="text-sm text-gray-600">
              You have {unreadMessages || 0} new message{(unreadMessages || 0) !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification: any, index: number) => (
                <div
                  key={index}
                  onClick={() => handleMessageClick(notification.conversationId)}
                  className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-start space-x-3">
                    {notification.message?.sender ? (
                      <img
                        src={
                          notification.message.sender.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            notification.message.sender.fullName || notification.message.sender.username || 'User'
                          )}&background=3B82F6&color=fff&size=40`
                        }
                        alt={notification.message.sender.fullName || notification.message.sender.username}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const name = notification.message.sender?.fullName || notification.message.sender?.username || 'User';
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6B7280&color=fff&size=40`;
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">?</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.message?.sender?.fullName || notification.message?.sender?.username || 'Someone'}
                      </p>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {notification.message?.content || 'New message'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.receivedAt ? formatTimeAgo(new Date(notification.receivedAt).toISOString()) : 'Recently'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No new messages</div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleViewAllMessages}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
            >
              View all messages
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;