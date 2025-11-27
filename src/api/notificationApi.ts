import { apiClient } from "../services/apiClient";

/**
 * Notification Types
 */
export type NotificationType =
    | 'FOLLOW'
    | 'LIKE'
    | 'COMMENT'
    | 'MESSAGE'
    | 'SYSTEM'
    | 'COURSE_UPDATE'
    | 'ACHIEVEMENT';

export type Notification = {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
};

export type MarkReadPayload = {
    notificationIds: string[];
};

/**
 * Notification API
 * 
 * Backend Routes:
 * - GET /notifications - Get list of notifications for current user
 * - POST /notifications/mark-read - Mark notifications as read
 */
export const notificationApi = {
    /**
     * Get list of all notifications for the current user
     * @returns List of notifications
     */
    list: async (): Promise<Notification[]> => {
        return apiClient.get<Notification[]>('/notifications');
    },

    /**
     * Mark one or more notifications as read
     * @param notificationIds - Array of notification IDs to mark as read
     * @returns Success response
     */
    markRead: async (notificationIds: string[]): Promise<{ success: boolean; message: string }> => {
        return apiClient.post<{ success: boolean; message: string }>('/notifications/mark-read', {
            notificationIds,
        });
    },

    /**
     * Mark all notifications as read
     * @returns Success response
     */
    markAllRead: async (): Promise<{ success: boolean; message: string }> => {
        const notifications = await notificationApi.list();
        const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);

        if (unreadIds.length === 0) {
            return { success: true, message: 'No unread notifications' };
        }

        return notificationApi.markRead(unreadIds);
    },
};

export default notificationApi;
