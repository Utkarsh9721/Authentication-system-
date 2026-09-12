// src/controllers/login/login.js
import Register from "../../modals/RegisterSchema.js";
import jwt from "jsonwebtoken";

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            });
        }

        // ✅ .select("+password") — REQUIRED because schema has select: false
        const user = await Register.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email not found"
            });
        }

        const checkPassword = await user.comparePassword(password);

        if (!checkPassword) {
            return res.status(401).json({
                success: false,
                message: "Wrong password"
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ✅ FIXED cookie options (cross-domain)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,               // ✅ was false
            sameSite: "none",           // ✅ was lax
            maxAge: 7 * 24 * 60 * 60 * 1000,
            domain: ".onrender.com",    // ✅ was missing
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export default Login;