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

// ==================== LOCAL AUTH ====================
Route.post("/register", RegisterData);
Route.post("/login", LoginLimit, Login);
Route.post("/forgot-password", Forgot);
Route.post("/reset-password/:token", ResetPassword);

// ==================== AUTH CHECK ====================
Route.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

// ==================== LOGOUT ====================
Route.post("/logout", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

// ==================== GOOGLE OAUTH ====================
Route.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account"
    })
);

Route.get("/google/callback",
    (req, res, next) => {
        passport.authenticate("google", { session: false }, (err, user, info) => {
            const frontendUrl =
                process.env.FRONTEND_URL ||
                "https://authentication-system-tawny.vercel.app";

            if (err) {
                console.error("❌ Google auth error:", err);
                return res.redirect(`${frontendUrl}/?error=oauth_error`);
            }

            if (!user) {
                console.error("❌ Google auth failed:", info);
                return res.redirect(`${frontendUrl}/?error=oauth_failed`);
            }

            try {
                const token = jwt.sign(
                    { id: user._id, email: user.email, name: user.name },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );

                // ✅ Redirect to frontend with token in URL
                const userData = encodeURIComponent(
                    JSON.stringify({
                        id: user._id,
                        name: user.name,
                        email: user.email
                    })
                );

                console.log("✅ Google OAuth success, redirecting with token");
                res.redirect(
                    `${frontendUrl}/oauth-success?token=${token}&user=${userData}`
                );
            } catch (error) {
                console.error("❌ Token error:", error);
                res.redirect(`${frontendUrl}/?error=token_error`);
            }
        })(req, res, next);
    }
);

export default Route;