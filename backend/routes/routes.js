import express, { Router } from "express";
import RegisterData from "../controllers/register/register.js";
import Login from "../controllers/login/login.js";
import auth from "../middleware/auth.js";
import LoginLimit from "../middleware/rateLimit.js"
import Forgot from "../controllers/forgotpass/forgotPass.js"
import ResetPassword from "../controllers/forgotpass/newPass.js";

const Route = express.Router();

Route.post("/register", RegisterData);
Route.post("/login", LoginLimit, Login);
Route.post(
    "/forgot-password",
    Forgot
);

Route.post(
    "/reset-password/:token",
    ResetPassword
);
Route.get("/me", auth, (req, res) => {
    res.status(200).json({
        user: req.user
    })
})

export default Route;


