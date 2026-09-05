import React, { useEffect, useState } from "react";
import axios from "axios";

import Register from "./controllers/register";
import Login from "./controllers/login/login";
import Dashboard from "./controllers/dashboard/dashboard";
import ProtectedRoutes from "./controllers/protectedRoutes/protectedRoutes";
import { Routes, Route } from "react-router-dom";
import ForgotPassword from "./forgotPassword/forgot";
import ResetPassword from "./forgotPassword/resetPass";

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/me`,
            {
                withCredentials: true
            }
        )
            .then(() => {
                setIsAuthenticated(true);
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
    }, []);

    return (
        <div className="app">

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoutes
                            isAuthenticated={isAuthenticated}
                        >
                            <Dashboard />
                        </ProtectedRoutes>
                    }
                />

            </Routes>

        </div>
    );
};

export default App;