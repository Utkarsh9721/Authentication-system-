// src/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./controllers/register";
import Login from "./controllers/login/login";
import Dashboard from "./controllers/dashboard/dashboard";
import ProtectedRoutes from "./controllers/protectedRoutes/protectedRoutes";
import ForgotPassword from "./forgotPassword/forgot";
import ResetPassword from "./forgotPassword/resetPass";

// ✅ Global: send cookies with every request
axios.defaults.withCredentials = true;

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
                withCredentials: true
            })
            .then(() => isMounted && setIsAuthenticated(true))
            .catch(() => isMounted && setIsAuthenticated(false))
            .finally(() => isMounted && setIsLoading(false));

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh"
                }}
            >
                Loading...
            </div>
        );
    }

    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoutes isAuthenticated={isAuthenticated}>
                            <Dashboard />
                        </ProtectedRoutes>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </div>
    );
};

export default App;