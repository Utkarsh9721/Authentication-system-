import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";

import Connection from "./modals/connection.js";
import Route from "./routes/routes.js";
import authRoute from "./middleware/auth.js";

import "./config/passport.js";

configDotenv();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());

Connection();

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Backend is running"
    });
});

app.use("/api", Route);
app.use("/auth", authRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});