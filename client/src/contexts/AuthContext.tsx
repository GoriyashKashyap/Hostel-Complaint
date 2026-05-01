import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient, User } from "@/lib/api";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: { email: string; password: string; role?: string; full_name?: string; semester?: string; branch?: string; phone?: string; hostel?: string; room?: string }) => Promise<void>;
    refreshUser: () => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            if (apiClient.isAuthenticated()) {
                try {
                    const currentUser = await apiClient.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    apiClient.logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        await apiClient.login({ email, password });
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
    };

    const register = async (data: { email: string; password: string; role?: string; full_name?: string; semester?: string; branch?: string; phone?: string; hostel?: string; room?: string }) => {
        await apiClient.register(data);
        // Auto-login after registration
        await login(data.email, data.password);
    };

    const refreshUser = async () => {
        if (!apiClient.isAuthenticated()) {
            setUser(null);
            return;
        }

        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
    };

    const logout = () => {
        apiClient.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                refreshUser,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
