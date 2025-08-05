import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';
import { toast } from '@/components/ui/sonner';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Check for authenticated user on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedUser = localStorage.getItem('quickdesk_user');
                if (storedUser) {
                    const user = JSON.parse(storedUser) as User;
                    const response = await fetch('/auth/user', {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.userId) {
                            const updatedUser = { userId: data.userId };
                            setAuthState({
                                user: updatedUser,
                                isAuthenticated: true,
                                isLoading: false,
                            });
                            localStorage.setItem('quickdesk_user', JSON.stringify(updatedUser));
                        } else {
                            localStorage.removeItem('quickdesk_user');
                            setAuthState({ user: null, isAuthenticated: false, isLoading: false });
                        }
                    } else {
                        // Only clear if token is invalid, not on network error
                        if (response.status === 401) {
                            localStorage.removeItem('quickdesk_user');
                        }
                        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
                    }
                } else {
                    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                setAuthState({ user: null, isAuthenticated: false, isLoading: false });
                toast.error('Failed to verify authentication');
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setAuthState((prev) => ({ ...prev, isLoading: true }));
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            const user: User = {
                userId: data.userId,
            };

            localStorage.setItem('quickdesk_user', JSON.stringify(user));
            setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
            toast.success('Login successful');
        } catch (error: any) {
            setAuthState((prev) => ({ ...prev, isLoading: false }));
            toast.error(error.message || 'Login failed');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('quickdesk_user');
        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};