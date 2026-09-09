// src/middleware/auth.js (or wherever your Google OAuth routes are)
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const Route = express.Router();

// ==================== GOOGLE OAUTH ROUTES ====================
// Initiate Google OAuth
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
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`
    }),
    async (req, res) => {
        try {
            // Generate JWT token
            const token = jwt.sign(
                {
                    id: req.user._id,
                    email: req.user.email,
                    name: req.user.name
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d",
                }
            );

            // Set cookie (optional)
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            // Redirect to frontend with token
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(
                `${frontendUrl}/oauth-success?token=${token}&user=${encodeURIComponent(JSON.stringify({
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email
                }))}`
            );
        } catch (error) {
            console.error('Google OAuth Callback Error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_error`);
        }
    }
);

// Get user info from Google token (optional)
Route.get("/google/user",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.status(200).json({
            success: true,
            user: req.user
        });
    }
);

// Logout route (clear cookie)
Route.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

export default Route;