import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";

import Connection from "./modals/connection.js";
import Route from "./routes/routes.js";
import authRoute from "./middleware/auth.js";


import "./config/passport.js";

configDotenv();

const app = express();

// ==================== FIXED CORS CONFIGURATION ====================
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    process.env.FRONTEND_URL, // Your vercel URL from .env
    "https://authentication-system-tawny.vercel.app", // From your .env
    "https://authentication-system-qacwnpc8k.vercel.app", // Your actual URL
    "https://*.vercel.app"
].filter(Boolean);

console.log('🔗 CORS Allowed Origins:', allowedOrigins);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }

        // Check if origin is allowed
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed.includes('*')) {
                // Handle wildcard domains like *.vercel.app
                const pattern = allowed.replace('*', '.*');
                return new RegExp(pattern).test(origin);
            }
            return allowed === origin;
        });

        if (isAllowed || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            console.warn(`❌ CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cookie',
        'Set-Cookie',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials'
    ],
    exposedHeaders: ['Authorization', 'Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    maxAge: 86400
};

// Apply CORS with options
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// ==================== OTHER MIDDLEWARE ====================
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ==================== DATABASE CONNECTION ====================
Connection();

// ==================== HEALTH CHECK ====================
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Backend is running",
        environment: process.env.NODE_ENV || 'development',
        cors: {
            enabled: true,
            allowedOrigins: allowedOrigins
        }
    });
});

// ==================== CORS TEST ENDPOINT ====================
app.get("/api/test-cors", (req, res) => {
    res.json({
        success: true,
        message: "CORS is working correctly!",
        origin: req.headers.origin || 'No origin',
        method: req.method,
        allowedOrigins: allowedOrigins
    });
});

// ==================== EXISTING ROUTES ====================
app.use("/api", Route);        // Your existing API routes
app.use("/auth", authRoute);   // Your existing auth routes

// ==================== ACHIEVEMENT ROUTES ====================
app.use("/api/achievements", achievementRoutes);

// ==================== 404 HANDLER ====================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);

    // Handle CORS errors specifically
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            message: 'CORS error: Origin not allowed',
            yourOrigin: req.headers.origin,
            allowedOrigins: allowedOrigins
        });
    }

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 CORS Allowed Origins:`, allowedOrigins);
    console.log(`📡 API endpoints:`);
    console.log(`   - /api/* (existing routes)`);
    console.log(`   - /auth/* (auth routes)`);
    console.log(`   - /api/achievements (achievement routes)`);
    console.log(`   - /api/test-cors (CORS test)`);
});

export default app;