// src/controllers/protectedRoutes/protectedRoutes.jsx
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ isAuthenticated, children }) => {
    const location = useLocation();

    // Show loading while checking
    if (isAuthenticated === null) {
        return <h2>Loading...</h2>;
    }

    // Not authenticated → redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoutes;