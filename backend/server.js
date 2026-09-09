// server.js
import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";

import Connection from "./modals/connection.js";
import Route from "./routes/routes.js";
import "./config/passport.js";

configDotenv();

const app = express();

// ==================== CORS ====================
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_2,
    process.env.FRONTEND_URL_3,
    "https://authentication-system-tawny.vercel.app",
    "https://authentication-system-git-main-raiutkarsh544-gmailcoms-projects.vercel.app",
    "https://authentication-system-2sds1p8sf.vercel.app",
    /\.vercel\.app$/
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed instanceof RegExp) return allowed.test(origin);
            return allowed === origin;
        });

        if (isAllowed || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            console.warn(`❌ CORS blocked: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'Cookie'],
    exposedHeaders: ['Authorization'],
    optionsSuccessStatus: 200
}));

app.options('*', cors());

// ==================== MIDDLEWARE ====================
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ==================== DATABASE ====================
Connection();

// ==================== ROUTES ====================
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Authentication System Backend is running",
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        googleCallbackUrl: process.env.CALLBACK_URL
    });
});

// Mount all routes under /api
app.use("/api", Route);

// ==================== 404 ====================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
        method: req.method
    });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// ==================== START ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API Base: /api/*`);
    console.log(`📡 Google OAuth: GET /api/auth/google`);
    console.log(`📡 Google Callback: GET /api/auth/google/callback`);
});