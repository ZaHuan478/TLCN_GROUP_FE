import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../../api/notificationApi';
import { onNewNotification, onNotificationsRead } from '../../../services/socket';
import { Notification } from '../../../types/types';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();

    // Listen for real-time notifications
    const unsubscribeNew = onNewNotification((notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    const unsubscribeRead = onNotificationsRead(({ newUnreadCount }) => {
      setUnreadCount(newUnreadCount);
    });

    return () => {
      unsubscribeNew?.();
      unsubscribeRead?.();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.list(10, 0);
      console.log('Loaded notifications:', response.notifications);
      response.notifications.forEach(n => {
        console.log('Notification actor:', n.actor);
        console.log('Has avatar:', n.actor?.avatar);
      });
      setNotifications(response.notifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      await notificationApi.markAsRead(notificationIds);
      setNotifications(prev => 
        prev.map(n => 
          notificationIds.includes(n.id) ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    console.log('Notification clicked:', notification);
    console.log('Actor data:', notification.actor);
    
    if (!notification.isRead) {
      markAsRead([notification.id]);
    }

    setIsOpen(false);

    // Navigate to blog and trigger blog modal open
    if (notification.blogId) {
      navigate('/', { 
        state: { 
          scrollToBlogId: notification.blogId,
          openBlogModal: notification.blogId 
        } 
      });
      
      // Trigger blog modal after navigation
      setTimeout(() => {
        const blogElement = document.getElementById(`blog-${notification.blogId}`);
        if (blogElement) {
          // Find and click the blog card to open modal
          const blogCard = blogElement.querySelector('.blog-card-clickable');
          if (blogCard) {
            (blogCard as HTMLElement).click();
          } else {
            // Fallback: just scroll to blog
            blogElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            blogElement.style.border = '2px solid #3B82F6';
            setTimeout(() => {
              blogElement.style.border = '';
            }, 3000);
          }
        }
      }, 500);
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
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5zM12 3a6 6 0 016 6c0 7 3 9 3 9H3s3-2 3-9a6 6 0 016-6z" />
        </svg>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
                  markAsRead(unreadIds);
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Actor Avatar */}
                    {notification.actor && (
                      <img
                        src={notification.actor.avatar || 'https://via.placeholder.com/40x40/gray/white?text=U'}
                        alt={notification.actor.fullName || notification.actor.username}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/40x40/gray/white?text=U';
                        }}
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 10 && (
            <div className="p-4 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800 w-full text-center">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;