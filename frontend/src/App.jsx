// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./controllers/register";
import Login from "./controllers/login/login";
import Dashboard from "./controllers/dashboard/dashboard";
import ProtectedRoutes from "./controllers/protectedRoutes/protectedRoutes";
import ForgotPassword from "./forgotPassword/forgot";
import ResetPassword from "./forgotPassword/resetPass";
import OAuthSuccess from "./controllers/oauth/OAuthSuccess";
import api from "./api";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            // ✅ No token → not authenticated
            if (!token) {
                if (isMounted) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                }
                return;
            }

            // ✅ Token exists → verify with backend
            try {
                await api.get("/api/me");
                if (isMounted) setIsAuthenticated(true);
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                if (isMounted) setIsAuthenticated(false);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        checkAuth();

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
                <Route path="/oauth-success" element={<OAuthSuccess />} />
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