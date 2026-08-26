import { Navigate } from "react-router";
import { isLoggedIn } from "../services/auth-service";

const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
