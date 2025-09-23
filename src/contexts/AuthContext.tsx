import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService, User } from "../services/authService";

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
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

    const isAuthenticated = authService.isAuthenticated();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const oauthResult = authService.handleOAuthCallback();
                if (oauthResult) {
                    await refreshUser();
                } else {
                    const savedUser = await authService.getCurrentUser();
                    if (savedUser && isAuthenticated) {
                        setUser(savedUser);
                    } else {
                        authService.logout();
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                authService.logout();
            } finally {
                setIsLoading(true);
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

    const value: AuthContextType = { user, isAuthenticated, isLoading, login, logout, refreshUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = () : AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}