import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const Route = express.Router();

Route.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

Route.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
    }),
    async (req, res) => {

        const token = jwt.sign(
            {
                id: req.user._id,
                email: req.user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
        });

        res.redirect(
            "http://localhost:5173/dashboard"
        );
    }
);

export default Route;