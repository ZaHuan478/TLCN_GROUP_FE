import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService } from "../services/authService";
import { User } from "../types/types";
import { apiClient } from "../services/apiClient";

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const oauthResult = authService.handleOAuthCallback();
                if (oauthResult) {
                    // Fix: Get user info after setting tokens
                    try {
                        const response = await apiClient.get<{ data: { user: User } }>('/auth/me');
                        setUser(response.data.user);
                        localStorage.setItem("user", JSON.stringify(response.data.user));
                    } catch (error) {
                        console.error('Failed to get user info after OAuth:', error);
                        // Fallback: try to get from localStorage
                        await refreshUser();
                    }
                } else {
                    const savedUser = await authService.getCurrentUser();
                    if (savedUser && authService.isAuthenticated()) {
                        setUser(savedUser);
                    } else {
                        authService.clearSession();
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                authService.clearSession();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (username: string, password: string): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await authService.login({ username, password });
            setUser(response.user);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () : Promise<void> => {
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
                    const response = await apiClient.get<{ data: { user: User } }>('/auth/me');
                    const updatedUser = response.data.user;
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
            
            // Log response để debug
            console.log("Register response:", response);
            
            // Kiểm tra response có user info không
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
        isAuthenticated: authService.isAuthenticated() && !!user,
        isLoading, 
        login, 
        register,
        logout, 
        refreshUser 
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = () : AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}