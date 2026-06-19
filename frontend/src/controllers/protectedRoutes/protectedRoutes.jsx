import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ isAuthenticated, children }) => {

    if (isAuthenticated === null) {
        return <h2>Loading...</h2>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoutes;