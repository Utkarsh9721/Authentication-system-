import Register from "../../modals/RegisterSchema.js";
import jwt from "jsonwebtoken";


const Login = async(req,res)=>{

    try{

        const {email,password}=req.body;


        if(!email || !password){
            return res.status(400).json({
                message:"All fields required"
            });
        }


        const user = await Register.findOne({email});


        if(!user){
            return res.status(401).json({
                message:"Email not found"
            });
        }


        const checkPassword =
        await user.comparePassword(password);


        if(!checkPassword){
            return res.status(401).json({
                message:"Wrong password"
            });
        }


        const token = jwt.sign(
            {
                id:user._id,
                email:user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );


        res.cookie("token",token,{
            httpOnly:true,
            secure:false, 
            sameSite:"lax",
            maxAge:7*24*60*60*1000
        });


        return res.status(200).json({
            message:"Login successful"
        });


    }catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server error"
        });
    }
}


export default Login;