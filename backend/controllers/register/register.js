import Register from "../../modals/RegisterSchema.js";
const RegisterData=async(req,res)=>{
    try{
        const {name,email,password,confirmPass}=req.body;
        const existingEmail=await Register.findOne({email});
        if(existingEmail){
            return res.status(403).json({message:"email already exists"});
        }
        if(!name ||!password ||!email ||!password|| !confirmPass){
            return res.status(401).json({message:"All fields are required"});
        }
        if(password!==confirmPass){
            return req.status(400).json({message:"password not match"});
        }
        const user=await new Register({
            name,
            email,
            password
        });
        await user.save();
        return res.status(200).json({message:"successfully added user",
            user
        })
        
    }catch(error){
        console.log("register server issue",error);
        return res.status(500).json({message:"serevr error"})
    }
}
export default RegisterData;