import express, { Router } from "express";
import RegisterData from "../controllers/register/register.js";
import Login from "../controllers/login/login.js";
import auth from "../middleware/auth.js";
import LoginLimit from "../middleware/rateLimit.js"

const Route=express.Router();

Route.post("/register",RegisterData);
Route.post("/login",LoginLimit,Login);
Route.get("/me",auth,(req,res)=>{
    res.status(200).json({
        user:req.user
    })
})

export default Route;


