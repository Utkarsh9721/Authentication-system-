// src/routes/routes.js
import express, { Router } from "express";
import RegisterData from "../controllers/register/register.js";
import Login from "../controllers/login/login.js";
import auth from "../middleware/auth.js";
import LoginLimit from "../middleware/rateLimit.js";
import Forgot from "../controllers/forgotpass/forgotPass.js";
import ResetPassword from "../controllers/forgotpass/newPass.js";

// Import Google OAuth routes
import googleAuthRoutes from "../middleware/auth.js";

const Route = express.Router();

// ==================== LOCAL AUTH ROUTES ====================
Route.post("/register", RegisterData);
Route.post("/login", LoginLimit, Login);
Route.post("/forgot-password", Forgot);
Route.post("/reset-password/:token", ResetPassword);
Route.get("/me", auth, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

// ==================== GOOGLE OAUTH ROUTES ====================
// Mount Google OAuth routes under /auth
Route.use("/auth", googleAuthRoutes);

console.log("✅ Routes registered:");
console.log("   - POST /api/register");
console.log("   - POST /api/login");
console.log("   - POST /api/forgot-password");
console.log("   - POST /api/reset-password/:token");
console.log("   - GET /api/me");
console.log("   - GET /api/auth/google (Google OAuth)");
console.log("   - GET /api/auth/google/callback (Google Callback)");
console.log("   - GET /api/auth/google/user (Google User)");
console.log("   - GET /api/auth/logout");

export default Route;