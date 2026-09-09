// src/modals/RegisterSchema.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const RegisterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    // Google OAuth fields
    googleId: {
        type: String,
        sparse: true,
        index: true
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    profilePicture: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: {
        type: Date,
        default: null
    },
    // Account status
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password before saving
RegisterSchema.pre("save", async function (next) {
    if (!this.isModified("password") || this.authProvider === 'google') {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
RegisterSchema.methods.comparePassword = async function (password) {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
};

// Indexes
RegisterSchema.index({ email: 1 });
RegisterSchema.index({ googleId: 1 });

const Register = mongoose.model("Register", RegisterSchema);
export default Register;