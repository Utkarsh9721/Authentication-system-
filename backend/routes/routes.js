// src/routes/routes.js
import express, { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import RegisterData from "../controllers/register/register.js";
import Login from "../controllers/login/login.js";
import auth from "../middleware/auth.js";
import LoginLimit from "../middleware/rateLimit.js";
import Forgot from "../controllers/forgotpass/forgotPass.js";
import ResetPassword from "../controllers/forgotpass/newPass.js";

const Route = express.Router();

// ==================== LOCAL AUTH ROUTES (with /api) ====================
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

// ==================== GOOGLE OAUTH ROUTES (without /api) ====================
// Mount directly on /auth/google instead of /api/auth/google
// Initiate Google OAuth
Route.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account"
    })
);

// Google OAuth callback
Route.get("/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`
    }),
    async (req, res) => {
        try {
            const user = req.user;

            // Generate JWT token
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    name: user.name
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            // Set cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            // Redirect to frontend with token
            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
            const userData = encodeURIComponent(JSON.stringify({
                id: user._id,
                name: user.name,
                email: user.email
            }));

            res.redirect(`${frontendUrl}/oauth-success?token=${token}&user=${userData}`);

        } catch (error) {
            console.error("Google OAuth callback error:", error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_error`);
        }
    }
);

console.log("✅ Routes registered:");
console.log("   - POST /api/register");
console.log("   - POST /api/login");
console.log("   - POST /api/forgot-password");
console.log("   - POST /api/reset-password/:token");
console.log("   - GET /api/me");
console.log("   - GET /auth/google (Google OAuth - matches Google Console)");
console.log("   - GET /auth/google/callback (Google Callback - matches Google Console)");

export default Route;