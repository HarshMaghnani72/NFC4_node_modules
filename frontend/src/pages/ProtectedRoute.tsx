import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner component
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Redirecting to /login because isAuthenticated is false");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};