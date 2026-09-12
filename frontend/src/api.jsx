// src/services/api.js
import axios from "axios";

const API_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://authentication-system-sh1d.onrender.com";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// ✅ Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // Don't auto-redirect here — let components handle it
        }
        return Promise.reject(error);
    }
);

export default api;