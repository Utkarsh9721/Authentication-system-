// src/models/Register.js
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
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // New fields for social features
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register'
    }],
    friendRequests: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Register'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    privacy: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'friends'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

RegisterSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

RegisterSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const Register = mongoose.model("Register", RegisterSchema);
export default Register;