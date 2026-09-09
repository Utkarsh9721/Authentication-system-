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

// ==================== CORS CONFIGURATION ====================
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    process.env.FRONTEND_URL,
    "https://authentication-system-tawny.vercel.app",
    "https://authentication-system-qacwnpc8k.vercel.app"
].filter(Boolean);

console.log('🔗 CORS Allowed Origins:', allowedOrigins);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
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
        'Set-Cookie'
    ],
    exposedHeaders: ['Authorization', 'Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    maxAge: 86400
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, Cookie, Set-Cookie');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    res.status(200).end();
});

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
        message: "Authentication System Backend is running",
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// ==================== ROUTES ====================
// Only authentication routes
app.use("/api", Route);        // Your existing API routes
app.use("/auth", authRoute);   // Your existing auth routes

// ==================== DEBUG ROUTES ====================
app.get("/routes", (req, res) => {
    const routes = [];

    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            routes.push({
                path: middleware.route.path,
                methods: Object.keys(middleware.route.methods)
            });
        } else if (middleware.name === 'router' && middleware.handle) {
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    routes.push({
                        path: handler.route.path,
                        methods: Object.keys(handler.route.methods)
                    });
                }
            });
        }
    });

    res.json({
        success: true,
        routes: routes
    });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
    console.log(`Route not found: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
        method: req.method,
        availableRoutes: [
            "/api/register",
            "/api/login",
            "/api/forgot-password",
            "/api/reset-password/:token",
            "/api/me",
            "/auth/forgot-password",
            "/auth/reset-password/:token",
            "/health",
            "/routes"
        ]
    });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
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
    console.log(`📡 API Endpoints:`);
    console.log(`   - POST /api/register`);
    console.log(`   - POST /api/login`);
    console.log(`   - POST /api/forgot-password`);
    console.log(`   - POST /api/reset-password/:token`);
    console.log(`   - GET /api/me`);
    console.log(`   - GET /health`);
    console.log(`   - GET /routes (debug)`);
});

export default app;