import rateLimit from "express-rate-limit";

const LoginLimit=rateLimit({
    windowMs:15*60*1000,//15 min
    max:5,
    message:{
        message:"Too many login attempts. Try again later."
    },
     standardHeaders: true,
    legacyHeaders: false
})
export default LoginLimit;