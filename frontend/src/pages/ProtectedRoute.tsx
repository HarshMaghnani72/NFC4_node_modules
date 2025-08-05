import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'userId:', user?.userId, 'isLoading:', isLoading); // Debug log

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user?.userId) {
        console.log('ProtectedRoute: Redirecting to /login because isAuthenticated is false or userId is missing');
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};