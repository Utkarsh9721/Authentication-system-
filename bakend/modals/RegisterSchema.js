import mongoose from "mongoose";
import bcrypt from "bcrypt";

const RegisterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

RegisterSchema.pre("save", async function() {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

RegisterSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const Register = mongoose.model("Register", RegisterSchema);

export default Register;