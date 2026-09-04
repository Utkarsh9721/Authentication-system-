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
    origin: "http://localhost:5173",
    credentials: true
}));
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Backend is running"
    });
});

app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());

Connection();

app.use("/api", Route);
app.use("/auth", authRoute);

app.listen(5000, () => {
    console.log("server is running");
});