// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import Register from "../modals/RegisterSchema.js";

export const auth = async (req, res, next) => {
    try {
        // 🔍 DEBUG LOGS
        console.log("========== AUTH MIDDLEWARE ==========");
        console.log("req.cookies:", req.cookies);
        console.log("req.headers.cookie:", req.headers.cookie);
        console.log("====================================");

        // ✅ Read token directly from cookie
        const token = req.cookies?.token;

        if (!token) {
            console.log("❌ No token in cookies");
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // ✅ Verify JWT directly
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded JWT:", decoded);

        const user = await Register.findById(decoded.id).select("-password");
        if (!user) {
            console.log("❌ User not found");
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        console.log("✅ Auth success:", user.email);
        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Auth error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized access"
        });
    }
};

export default auth;