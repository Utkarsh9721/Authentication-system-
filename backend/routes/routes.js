// src/routes/routes.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import RegisterData from "../controllers/register/register.js";
import Login from "../controllers/login/login.js";
import LoginLimit from "../middleware/rateLimit.js";
import Forgot from "../controllers/forgotpass/forgotPass.js";
import ResetPassword from "../controllers/forgotpass/newPass.js";
import authMiddleware from "../middleware/authMiddleware.js";

const Route = express.Router();

// ==================== LOCAL AUTH ROUTES ====================
Route.post("/register", RegisterData);
Route.post("/login", LoginLimit, Login);
Route.post("/forgot-password", Forgot);
Route.post("/reset-password/:token", ResetPassword);

// ==================== AUTH CHECK ====================
// ✅ Reads cookie (via authMiddleware) and returns user
Route.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

// ==================== LOGOUT ====================
Route.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: ".onrender.com",
        path: "/"
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

// ==================== GOOGLE OAUTH ROUTES ====================
// Step 1: Redirect to Google
Route.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account"
    })
);

// Step 2: Handle Google callback
Route.get("/google/callback",
    (req, res, next) => {
        passport.authenticate("google", { session: false }, (err, user, info) => {
            const frontendUrl = process.env.FRONTEND_URL || "https://authentication-system-tawny.vercel.app";

            if (err) {
                console.error("❌ Google auth error:", err);
                return res.redirect(`${frontendUrl}/?error=oauth_error`);
            }

            if (!user) {
                console.error("❌ Google auth failed:", info);
                return res.redirect(`${frontendUrl}/?error=oauth_failed`);
            }

            try {
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

                // ✅ Set cookie for cross-domain auth
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,                  // HTTPS only
                    sameSite: "none",              // ✅ Required for cross-domain
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    domain: ".onrender.com",       // Cookie scoped to onrender
                    path: "/"
                });

                // ✅ Redirect to /dashboard (NO token in URL — cookie handles auth)
                console.log("✅ Google OAuth successful, cookie set, redirecting to /dashboard");
                res.redirect(`${frontendUrl}/dashboard`);
            } catch (error) {
                console.error("❌ Token generation error:", error);
                res.redirect(`${frontendUrl}/?error=token_error`);
            }
        })(req, res, next);
    }
);

console.log("✅ Routes registered:");
console.log("   - POST /api/register");
console.log("   - POST /api/login");
console.log("   - POST /api/forgot-password");
console.log("   - POST /api/reset-password/:token");
console.log("   - GET  /api/me (cookie-based)");
console.log("   - POST /api/logout");
console.log("   - GET  /api/google");
console.log("   - GET  /api/google/callback");

export default Route;