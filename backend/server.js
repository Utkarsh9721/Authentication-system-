import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";

import Connection from "./modals/connection.js";
import Route from "./routes/routes.js";
import authRoute from "./middleware/auth.js";

// Import new routes
import friendshipRoutes from "./routes/friendshipRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";

import "./config/passport.js";

configDotenv();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());

Connection();

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Backend is running"
    });
});

// ==================== EXISTING ROUTES ====================
app.use("/api", Route);        // Your existing API routes
app.use("/auth", authRoute);   // Your existing auth routes

// ==================== NEW ROUTES ====================
// Friendship and Achievement routes (protected with auth)
app.use("/api/friends", friendshipRoutes);
app.use("/api/achievements", achievementRoutes);

// Or if you want them under auth route:
// app.use("/auth/friends", friendshipRoutes);
// app.use("/auth/achievements", achievementRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});