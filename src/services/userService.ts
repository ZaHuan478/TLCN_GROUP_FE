// User service for handling authentication and profile data
import { apiClient } from "./apiClient";
import { User } from "../types/types";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string | null;
  // Add other profile fields as needed
}

// Update user role via API
export const updateUserRole = async (userId: string, role: string): Promise<User> => {
  try {
    console.log(`Calling API to update role for user ${userId} to ${role}`);
    
    const { data } = await apiClient.put<{ data: User }>(
      `/users/${userId}/role`,
      { role }
    );
    
    console.log("Update role response:", data);
    
    // Cập nhật user trong localStorage nếu là user hiện tại
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.id === userId) {
        user.role = role;
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<User> => {
  const { data } = await apiClient.get<{ data: User }>(`/users/${userId}`);
  return data;
};
