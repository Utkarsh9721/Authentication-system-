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
        unique: true, // ✅ Keep this
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    googleId: {
        type: String,
        sparse: true,
        // ❌ Remove 'index: true' from here
        unique: true
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
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// ❌ Remove these duplicate index definitions
// RegisterSchema.index({ email: 1 });
// RegisterSchema.index({ googleId: 1 });

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

const Register = mongoose.model("Register", RegisterSchema);
export default Register;