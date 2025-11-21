import { apiClient } from "../services/apiClient";
import { User, CreateUserPayload, UpdateUserPayload } from "../types/types";

export const userApi = {
    async getAll(role?: "STUDENT" | "COMPANY" | "ADMIN"): Promise<User[]> {
        try {
            const url = role ? `/users?role=${role}` : '/users';
            const response = await apiClient.get<User[] | { data: User[] }>(url);
            const users = Array.isArray(response) ? response : (response.data || []);
            return users;
        } catch (error) {
            console.error('Failed to fetch users:', error);
            throw error;
        }
    },

    async getById(id: string): Promise<User> {
        try {
            const response = await apiClient.get<{ data: User }>(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch user ${id}:`, error);
            throw error;
        }
    },

    async create(userData: CreateUserPayload): Promise<User> {
        try {
            const response = await apiClient.post<{ data: User }>('/users', userData);
            return response.data;
        } catch (error) {
            console.error('Failed to create user:', error);
            throw error;
        }
    },

    async update(id: string, userData: UpdateUserPayload): Promise<User> {
        try {
            const response = await apiClient.put<{ data: User }>(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error(`Failed to update user ${id}:`, error);
            throw error;
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await apiClient.put(`/users/${id}`, { isActive: false });
        } catch (error) {
            console.error(`Failed to delete user ${id}:`, error);
            throw error;
        }
    }
};
