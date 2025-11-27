import { apiClient } from "../services/apiClient";
import { Notification } from "../types/types";

export const notificationApi = {
    list: async (): Promise<Notification[]> => {
        return apiClient.get<Notification[]>('/notifications');
    },

    markRead: async (notificationIds: string[]): Promise<{ success: boolean; message: string }> => {
        return apiClient.post<{ success: boolean; message: string }>('/notifications/mark-read', {
            notificationIds,
        });
    },

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
