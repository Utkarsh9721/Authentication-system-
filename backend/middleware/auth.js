// src/middleware/auth.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const Route = express.Router();

// ==================== GOOGLE OAUTH ROUTES ====================
Route.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
        accessType: "offline"
    })
);

// Google OAuth Callback
Route.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        // ✅ FIX: Redirect errors to / instead of /login
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=oauth_failed`
    }),
    async (req, res) => {
        try {
            const token = jwt.sign(
                {
                    id: req.user._id,
                    email: req.user.email,
                    name: req.user.name
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

            // ✅ FIX: Redirect to / instead of /oauth-success
            res.redirect(
                `${frontendUrl}/?token=${token}&user=${encodeURIComponent(JSON.stringify({
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email
                }))}`
            );
        } catch (error) {
            console.error('Google OAuth Callback Error:', error);
            // ✅ FIX: Redirect errors to / instead of /login
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=oauth_error`);
        }
    }
);

// Get user info from Google token (protected)
Route.get("/google/user",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.status(200).json({
            success: true,
            user: req.user
        });
    }
);

// Logout route
Route.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

console.log("✅ Google OAuth Routes registered:");
console.log("   - GET /api/google");
console.log("   - GET /api/google/callback");
console.log("   - GET /api/google/user");
console.log("   - GET /api/logout");

export default Route;