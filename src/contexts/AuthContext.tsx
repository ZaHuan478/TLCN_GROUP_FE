import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService } from "../services/authService";
import { User } from "../types/types";
import { apiClient } from "../services/apiClient";

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<User>;
    register: (userData: any) => Promise<any>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start with true while checking auth

    // Restore user on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Failed to restore auth:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (username: string, password: string): Promise<User> => {
        try {
            setIsLoading(true);
            const response = await authService.login({ username, password });
            setUser(response.user);
            return response.user;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            authService.clearSession();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUser = async (): Promise<void> => {
        try {
            // Try to get fresh user data from backend
            if (authService.isAuthenticated()) {
                try {
                    // apiClient.get already extracts .data, so response = { user: User }
                    const response = await apiClient.get<{ user: User }>('/auth/me');
                    const updatedUser = response.user;
                    console.log('Refreshed user data:', updatedUser);
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                } catch (apiError) {
                    console.warn('Failed to refresh from API, using cached data:', apiError);
                    // Fallback to cached user
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Refresh user error:', error);
            setUser(null);
        }
    };

    const register = async (userData: any): Promise<any> => {
        try {
            setIsLoading(true);
            const response = await authService.register(userData);
            console.log("Register response:", response);

            if (response && response.user) {
                setUser(response.user);
            } else {
                console.error("Invalid response from register:", response);
            }

            return response;
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: authService.isAuthenticated() && !!user, // 👈 Production mode: check token + user
        // isAuthenticated: !!user, // 🔥 DEV MODE: Simplified check
        isLoading,
        login,
        register,
        logout,
        refreshUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}