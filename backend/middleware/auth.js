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
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(
            `${process.env.FRONTEND_URL}/dashboard`
        );
    }
);

export default Route;