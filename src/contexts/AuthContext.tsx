import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService, User } from "../services/authService";
import { apiClient } from "../services/apiClient";

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
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
                        await authService.logout();
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                await authService.logout();
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
            console.error('Logout error:', error)
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUser = async (): Promise<void> => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Refresh user error:', error);
            setUser(null);
        }
    };

    const register = async (userData: any): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await authService.register(userData);
            setUser(response.user);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value: AuthContextType = { 
        user, 
        isAuthenticated: authService.isAuthenticated() && !!user, // Fix: Calculate dynamically
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