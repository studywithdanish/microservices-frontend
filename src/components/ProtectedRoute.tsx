import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { authenticated, checking } = useAuth();
    if (checking) return <div className="container py-5" role="status">Checking your secure session...</div>;
    return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
