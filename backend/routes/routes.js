// src/routes/routes.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import RegisterData from "../controllers/register/register.js";
import Login from "../controllers/login/login.js";
import auth from "../middleware/authMiddleware.js";
import LoginLimit from "../middleware/rateLimit.js";
import Forgot from "../controllers/forgotpass/forgotPass.js";
import ResetPassword from "../controllers/forgotpass/newPass.js";

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
            if (err) {
                console.error("❌ Google auth error:", err);
                const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
                return res.redirect(`${frontendUrl}/login?error=oauth_error`);
            }

            if (!user) {
                console.error("❌ Google auth failed:", info);
                const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
                return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
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

                // Set cookie (optional)
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

                console.log("✅ Google OAuth successful, redirecting to:", `${frontendUrl}/oauth-success`);
                res.redirect(`${frontendUrl}/oauth-success?token=${token}&user=${userData}`);
            } catch (error) {
                console.error("❌ Token generation error:", error);
                const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
                res.redirect(`${frontendUrl}/login?error=token_error`);
            }
        })(req, res, next);
    }
);

console.log("✅ Routes registered:");
console.log("   - POST /api/register");
console.log("   - POST /api/login");
console.log("   - POST /api/forgot-password");
console.log("   - POST /api/reset-password/:token");
console.log("   - GET /api/me");
console.log("   - GET /api/google");
console.log("   - GET /api/google/callback");

export default Route;